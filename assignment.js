(function attachTimerHubAssignment(root) {
    const FORMAT = 'timerhub-assignment';
    const VERSION = 1;
    const MODES = ['add', 'replace'];
    const SHAPES = ['circle', 'square', 'rounded', 'diamond', 'triangle', 'hexagon', 'octagon', 'star', 'heart', 'oval'];
    const SIZES = ['small', 'medium', 'large'];
    const PATH_SEPARATOR = ' · ';
    const LIMITS = Object.freeze({
        inputBytes: 512 * 1024,
        groups: 300,
        activities: 1000,
        depth: 8,
        name: 120,
        notes: 500,
        assignmentName: 120,
        pathName: 240,
        excluded: 200
    });

    class AssignmentError extends Error {
        constructor(code, path = '', message = '') {
            super(code);
            this.name = 'AssignmentError';
            this.code = code;
            this.path = path;
            this.detail = message;
        }
    }

    const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    const fail = (code, path = '') => {
        throw new AssignmentError(code, path);
    };

    const normalizeText = (value, max, { allowNewlines = false } = {}) => {
        let text = String(value).replace(/\r\n?/g, '\n');
        text = allowNewlines
            ? text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ')
            : text.replace(/[\u0000-\u001f\u007f]/g, ' ');
        text = allowNewlines ? text.replace(/[ \t]+/g, ' ') : text.replace(/\s+/g, ' ');
        return text.trim().slice(0, max);
    };

    const requireName = (value, path) => {
        if (typeof value !== 'string') fail('invalid_type', `${path}.name`);
        const name = normalizeText(value, LIMITS.name);
        if (!name) fail('invalid_name', `${path}.name`);
        return name;
    };

    const normalizeActivity = (raw, path) => {
        if (!isRecord(raw)) fail('invalid_type', path);
        for (const key of Object.keys(raw)) {
            if (!['name', 'notes', 'color', 'shape', 'size', 'exclude'].includes(key)) {
                fail('unexpected_property', `${path}.${key}`);
            }
        }
        if (raw.exclude !== undefined && typeof raw.exclude !== 'boolean') fail('invalid_type', `${path}.exclude`);
        const activity = { name: requireName(raw.name, path) };
        if (raw.notes !== undefined) {
            if (typeof raw.notes !== 'string') fail('invalid_type', `${path}.notes`);
            activity.notes = normalizeText(raw.notes, LIMITS.notes, { allowNewlines: true });
        }
        if (raw.color !== undefined) {
            if (typeof raw.color !== 'string' || !/^#[0-9a-f]{6}$/i.test(raw.color.trim())) fail('invalid_value', `${path}.color`);
            activity.color = raw.color.trim().toLowerCase();
        }
        if (raw.shape !== undefined) {
            if (typeof raw.shape !== 'string' || !SHAPES.includes(raw.shape.trim().toLowerCase())) fail('invalid_value', `${path}.shape`);
            activity.shape = raw.shape.trim().toLowerCase();
        }
        if (raw.size !== undefined) {
            if (typeof raw.size !== 'string' || !SIZES.includes(raw.size.trim().toLowerCase())) fail('invalid_value', `${path}.size`);
            activity.size = raw.size.trim().toLowerCase();
        }
        if (raw.exclude === true) activity.exclude = true;
        return activity;
    };

    const normalizeGroup = (raw, path, depth, counters) => {
        if (!isRecord(raw)) fail('invalid_type', path);
        if (depth > LIMITS.depth) fail('too_deep', path);
        for (const key of Object.keys(raw)) {
            if (!['name', 'activities', 'children', 'collapsed', 'exclude'].includes(key)) {
                fail('unexpected_property', `${path}.${key}`);
            }
        }
        if (raw.collapsed !== undefined && typeof raw.collapsed !== 'boolean') fail('invalid_type', `${path}.collapsed`);
        if (raw.exclude !== undefined && typeof raw.exclude !== 'boolean') fail('invalid_type', `${path}.exclude`);
        const group = { name: requireName(raw.name, path) };
        if (raw.collapsed === true) group.collapsed = true;
        if (raw.exclude === true) group.exclude = true;
        counters.groups += 1;
        if (counters.groups > LIMITS.groups) fail('too_many_groups', path);
        group.activities = [];
        if (raw.activities !== undefined) {
            if (!Array.isArray(raw.activities)) fail('invalid_type', `${path}.activities`);
            const seen = new Set();
            raw.activities.forEach((item, index) => {
                const activity = normalizeActivity(item, `${path}.activities[${index}]`);
                const key = activity.name.toLowerCase();
                if (seen.has(key)) fail('duplicate_name', `${path}.activities[${index}].name`);
                seen.add(key);
                counters.activities += 1;
                if (counters.activities > LIMITS.activities) fail('too_many_activities', path);
                group.activities.push(activity);
            });
        }
        group.children = [];
        if (raw.children !== undefined) {
            if (!Array.isArray(raw.children)) fail('invalid_type', `${path}.children`);
            const seen = new Set();
            raw.children.forEach((item, index) => {
                const childPath = `${path}.children[${index}]`;
                const key = isRecord(item) && typeof item.name === 'string' ? normalizeText(item.name, LIMITS.name).toLowerCase() : '';
                if (key && seen.has(key)) fail('duplicate_name', `${childPath}.name`);
                if (key) seen.add(key);
                group.children.push(normalizeGroup(item, childPath, depth + 1, counters));
            });
        }
        return group;
    };

    const normalizeAssignment = data => {
        if (!isRecord(data)) fail('invalid_format', '');
        for (const key of Object.keys(data)) {
            if (!['format', 'version', 'name', 'mode', 'groups', 'activities'].includes(key)) {
                fail('unexpected_property', key);
            }
        }
        if (data.format !== FORMAT) fail('invalid_format', 'format');
        if (data.version !== VERSION) fail('unsupported_version', 'version');
        let assignmentName = '';
        if (data.name !== undefined) {
            if (typeof data.name !== 'string') fail('invalid_type', 'name');
            assignmentName = normalizeText(data.name, LIMITS.assignmentName);
        }
        let mode = 'add';
        if (data.mode !== undefined) {
            if (typeof data.mode !== 'string' || !MODES.includes(data.mode.trim().toLowerCase())) fail('invalid_value', 'mode');
            mode = data.mode.trim().toLowerCase();
        }
        const counters = { groups: 0, activities: 0 };
        const assignment = { groupNodes: [], activities: [] };
        if (data.groups !== undefined) {
            if (!Array.isArray(data.groups)) fail('invalid_type', 'groups');
            if (data.groups.length > LIMITS.groups) fail('too_many_groups', 'groups');
            const seen = new Set();
            data.groups.forEach((item, index) => {
                const path = `groups[${index}]`;
                const key = isRecord(item) && typeof item.name === 'string' ? normalizeText(item.name, LIMITS.name).toLowerCase() : '';
                if (key && seen.has(key)) fail('duplicate_name', `${path}.name`);
                if (key) seen.add(key);
                assignment.groupNodes.push(normalizeGroup(item, path, 1, counters));
            });
        }
        if (data.activities !== undefined) {
            if (!Array.isArray(data.activities)) fail('invalid_type', 'activities');
            const seen = new Set();
            data.activities.forEach((item, index) => {
                const activity = normalizeActivity(item, `activities[${index}]`);
                const key = activity.name.toLowerCase();
                if (seen.has(key)) fail('duplicate_name', `activities[${index}].name`);
                seen.add(key);
                counters.activities += 1;
                if (counters.activities > LIMITS.activities) fail('too_many_activities', 'activities');
                assignment.activities.push(activity);
            });
        }
        if (!assignment.groupNodes.length && !assignment.activities.length) fail('empty_assignment', '');
        return { assignmentName, mode, assignment };
    };

    const byteLength = text => {
        if (typeof TextEncoder === 'function') return new TextEncoder().encode(text).length;
        return String(text).length * 2;
    };

    const parseAssignment = text => {
        if (typeof text !== 'string' || !text.trim()) fail('empty_input', '');
        if (byteLength(text) > LIMITS.inputBytes) fail('too_large', '');
        let data;
        try {
            data = JSON.parse(text);
        } catch (error) {
            fail('invalid_json', '');
        }
        return normalizeAssignment(data);
    };

    const buildPlan = normalized => {
        const plan = {
            assignmentName: normalized.assignmentName,
            mode: normalized.mode,
            groups: [],
            topLevelActivities: [],
            excluded: [],
            groupCount: 0,
            activityCount: 0
        };
        const addActivity = (activity, groupPath, sourcePath) => {
            if (activity.exclude) {
                plan.excluded.push({ kind: 'activity', path: sourcePath, name: activity.name });
                return;
            }
            plan.activityCount += 1;
            const entry = {
                name: activity.name,
                notes: activity.notes || '',
                color: activity.color || null,
                shape: activity.shape || null,
                size: activity.size || null
            };
            if (groupPath) plan.groups[plan.groups.length - 1].activities.push(entry);
            else plan.topLevelActivities.push(entry);
        };
        const walk = (nodes, parentPath, sourcePrefix) => {
            nodes.forEach((node, index) => {
                const sourcePath = `${sourcePrefix}[${index}]`;
                const fullName = parentPath
                    ? `${parentPath}${PATH_SEPARATOR}${node.name}`.slice(0, LIMITS.pathName)
                    : node.name;
                if (node.exclude) {
                    plan.excluded.push({ kind: 'group', path: sourcePath, name: fullName });
                    return;
                }
                plan.groupCount += 1;
                plan.groups.push({
                    name: fullName,
                    collapsed: node.collapsed === true,
                    activities: [],
                    sourcePath
                });
                node.activities.forEach((activity, activityIndex) => {
                    addActivity(activity, fullName, `${sourcePath}.activities[${activityIndex}]`);
                });
                if (node.children.length) walk(node.children, fullName, `${sourcePath}.children`);
            });
        };
        walk(normalized.assignment.groupNodes, '', 'groups');
        normalized.assignment.activities.forEach((activity, index) => {
            addActivity(activity, null, `activities[${index}]`);
        });
        if (plan.excluded.length > LIMITS.excluded) fail('too_many_excluded', '');
        return plan;
    };

    const fingerprint = normalized => {
        const canonical = JSON.stringify({
            name: normalized.assignmentName,
            mode: normalized.mode,
            groups: normalized.assignment.groupNodes,
            activities: normalized.assignment.activities
        });
        let hash = 2166136261;
        for (let index = 0; index < canonical.length; index++) {
            hash ^= canonical.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return `a1:${(hash >>> 0).toString(16).padStart(8, '0')}`;
    };

    const ASSIGNMENT_PROMPT = [
        'You convert a work assignment into the TimerHub assignment JSON format.',
        'Return valid JSON only. Do not use Markdown fences, comments, or explanations.',
        '',
        'Schema (version 1):',
        '{',
        '  "format": "timerhub-assignment",',
        '  "version": 1,',
        '  "name": "short assignment name (optional)",',
        '  "mode": "add" | "replace" (optional, default "add"),',
        '  "groups": [Group, ...],',
        '  "activities": [Activity, ...]',
        '}',
        'Group = {',
        '  "name": "required group name",',
        '  "collapsed": true (optional),',
        '  "exclude": true (optional, see below),',
        '  "activities": [Activity, ...],',
        '  "children": [Group, ...]',
        '}',
        'Activity = {',
        '  "name": "required activity name",',
        '  "notes": "optional note",',
        '  "color": "#RRGGBB" (optional),',
        '  "shape": "circle" | "square" | "rounded" | "diamond" | "triangle" | "hexagon" | "octagon" | "star" | "heart" | "oval" (optional),',
        '  "size": "small" | "medium" | "large" (optional),',
        '  "exclude": true (optional)',
        '}',
        '',
        'Rules:',
        '- Use "groups" for streets, locations, or other containers and "children" for nested containers such as houses. Nesting is unlimited, but keep it as shallow as the assignment allows.',
        '- Put every work instruction into exactly one activity. Use "activities" directly on the group it belongs to.',
        '- Preserve every address and every work instruction exactly as written. Never invent addresses, activities, colors, or requirements. If the assignment does not state a value, omit that property.',
        '- Never drop anything silently. If an instruction is intentionally not to be imported, represent it with "exclude": true instead of removing it.',
        '- Use "mode": "replace" only when the user explicitly asks to replace a previous TimerHub import of the same "name". Otherwise omit mode.',
        '- Group and activity names must be unique among their siblings.',
        '- If any instruction is ambiguous or cannot be interpreted reliably, stop and ask the user a clarifying question instead of guessing. A clarifying question must not be valid JSON; ask it before producing the final JSON.',
        '- Output raw JSON only, with no other text.'
    ].join('\n');

    root.TimerHubAssignment = {
        FORMAT,
        VERSION,
        MODES,
        SHAPES,
        SIZES,
        LIMITS,
        PATH_SEPARATOR,
        ASSIGNMENT_PROMPT,
        AssignmentError,
        parseAssignment,
        normalizeAssignment,
        buildPlan,
        fingerprint
    };
})(globalThis);
