import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const assignmentSource = await readFile(new URL('../assignment.js', import.meta.url), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));

function makeAssignment() {
    const context = vm.createContext({
        TextEncoder,
        JSON,
        Math,
        String,
        Array,
        Object,
        Error,
        Set,
        Number
    });
    vm.runInContext(assignmentSource, context, { filename: 'assignment.js' });
    return vm.runInContext('TimerHubAssignment', context);
}

const simple = {
    format: 'timerhub-assignment',
    version: 1,
    name: 'Example assignment',
    groups: [
        {
            name: 'Flower Street',
            children: [
                { name: '10', activities: [{ name: 'Paint walls' }] }
            ]
        }
    ]
};

test('a valid simple assignment parses, plans and titles correctly', () => {
    const Assignment = makeAssignment();
    const normalized = Assignment.parseAssignment(JSON.stringify(simple));
    assert.equal(normalized.assignmentName, 'Example assignment');
    assert.equal(normalized.mode, 'add');
    const plan = Assignment.buildPlan(normalized);
    assert.equal(plan.groupCount, 2);
    assert.equal(plan.activityCount, 1);
    assert.deepEqual(plain(plan.groups.map(group => group.name)), ['Flower Street', 'Flower Street · 10']);
    assert.deepEqual(plain(plan.groups[1].activities.map(activity => activity.name)), ['Paint walls']);
    assert.equal(plan.groups[0].activities.length, 0);
    assert.deepEqual(plain(plan.excluded), []);
});

test('multiple streets and houses with direct and nested activities plan correctly', () => {
    const Assignment = makeAssignment();
    const data = {
        format: 'timerhub-assignment',
        version: 1,
        groups: [
            {
                name: 'Flower Street',
                activities: [{ name: 'Set up scaffold' }],
                children: [
                    { name: '10', activities: [{ name: 'Paint walls' }] },
                    { name: '12', activities: [{ name: 'Sand ceiling', notes: 'Hallway' }] }
                ]
            },
            {
                name: 'Main Road',
                children: [{ name: '3a', activities: [{ name: 'Wallpaper' }] }]
            }
        ],
        activities: [{ name: 'Load truck' }]
    };
    const plan = Assignment.buildPlan(Assignment.normalizeAssignment(data));
    assert.equal(plan.groupCount, 5);
    assert.equal(plan.activityCount, 5);
    assert.deepEqual(plain(plan.groups.map(group => group.name)), [
        'Flower Street', 'Flower Street · 10', 'Flower Street · 12', 'Main Road', 'Main Road · 3a'
    ]);
    assert.deepEqual(plain(plan.groups[0].activities.map(activity => activity.name)), ['Set up scaffold']);
    assert.deepEqual(plain(plan.topLevelActivities.map(activity => activity.name)), ['Load truck']);
    assert.equal(plan.groups[2].activities[0].notes, 'Hallway');
});

test('unicode, Cyrillic, German characters and letter-suffixed addresses survive', () => {
    const Assignment = makeAssignment();
    const data = {
        format: 'timerhub-assignment',
        version: 1,
        groups: [{
            name: 'Straße 50a',
            activities: [{ name: 'Weiß gemalert', notes: 'В зале' }],
            children: [{ name: 'Дом 2б', activities: [{ name: 'Покраска' }] }]
        }]
    };
    const plan = Assignment.buildPlan(Assignment.normalizeAssignment(data));
    assert.deepEqual(plain(plan.groups.map(group => group.name)), ['Straße 50a', 'Straße 50a · Дом 2б']);
    assert.equal(plan.groups[0].activities[0].name, 'Weiß gemalert');
    assert.equal(plan.groups[0].activities[0].notes, 'В зале');
    assert.equal(plan.groups[1].activities[0].name, 'Покраска');
});

test('deep nesting is accepted within the limit and rejected beyond it', () => {
    const Assignment = makeAssignment();
    const build = depth => {
        let node = { name: `L${depth}`, activities: [{ name: `Work ${depth}` }] };
        for (let level = depth - 1; level >= 1; level--) {
            node = { name: `L${level}`, children: [node] };
        }
        return { format: 'timerhub-assignment', version: 1, groups: [node] };
    };
    const plan = Assignment.buildPlan(Assignment.normalizeAssignment(build(Assignment.LIMITS.depth)));
    assert.equal(plan.groupCount, Assignment.LIMITS.depth);
    assert.throws(
        () => Assignment.normalizeAssignment(build(Assignment.LIMITS.depth + 1)),
        error => error.code === 'too_deep'
    );
});

test('missing required names and invalid property types are rejected with a path', () => {
    const Assignment = makeAssignment();
    assert.throws(() => Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1, groups: [{ activities: [{ name: 'Paint' }] }]
    }), error => error.code === 'invalid_type' && error.path === 'groups[0].name');
    assert.throws(() => Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1, groups: [{ name: 'Street', activities: [{ name: 'Paint', notes: 5 }] }]
    }), error => error.code === 'invalid_type' && error.path === 'groups[0].activities[0].notes');
    assert.throws(() => Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1, groups: [{ name: 'Street', activities: ['Paint'] }]
    }), error => error.code === 'invalid_type' && error.path === 'groups[0].activities[0]');
    assert.throws(() => Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1, groups: [{ name: 'Street', collapsed: 'yes' }]
    }), error => error.code === 'invalid_type');
    assert.throws(() => Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1, groups: [{ name: 'Street', activities: [{ name: 'Paint', color: 'red' }] }]
    }), error => error.code === 'invalid_value' && error.path === 'groups[0].activities[0].color');
    assert.throws(() => Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1, groups: [{ name: 'Street', activities: [{ name: 'Paint', shape: 'blob' }] }]
    }), error => error.code === 'invalid_value');
});

test('unsupported versions, wrong formats and unexpected fields are rejected', () => {
    const Assignment = makeAssignment();
    assert.throws(() => Assignment.normalizeAssignment({ format: 'timerhub-assignment', version: 2 }), error => error.code === 'unsupported_version');
    assert.throws(() => Assignment.normalizeAssignment({ format: 'other', version: 1 }), error => error.code === 'invalid_format');
    assert.throws(() => Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1, groups: [{ name: 'Street', id: 'hack' }]
    }), error => error.code === 'unexpected_property' && error.path === 'groups[0].id');
    assert.throws(() => Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1, name: 'A', unknown: true
    }), error => error.code === 'unexpected_property' && error.path === 'unknown');
});

test('malformed JSON, empty input and oversized input fail safely', () => {
    const Assignment = makeAssignment();
    assert.throws(() => Assignment.parseAssignment('{not json'), error => error.code === 'invalid_json');
    assert.throws(() => Assignment.parseAssignment(''), error => error.code === 'empty_input');
    const huge = JSON.stringify({ format: 'timerhub-assignment', version: 1, name: 'x'.repeat(Assignment.LIMITS.inputBytes) });
    assert.throws(() => Assignment.parseAssignment(huge), error => error.code === 'too_large');
});

test('excessive group and activity counts are rejected', () => {
    const Assignment = makeAssignment();
    const manyGroups = {
        format: 'timerhub-assignment',
        version: 1,
        groups: Array.from({ length: Assignment.LIMITS.groups + 1 }, (unused, index) => ({ name: `G${index}` }))
    };
    assert.throws(() => Assignment.normalizeAssignment(manyGroups), error => error.code === 'too_many_groups');
    const manyActivities = {
        format: 'timerhub-assignment',
        version: 1,
        groups: [{
            name: 'Street',
            activities: Array.from({ length: Assignment.LIMITS.activities + 1 }, (unused, index) => ({ name: `A${index}` }))
        }]
    };
    assert.throws(() => Assignment.normalizeAssignment(manyActivities), error => error.code === 'too_many_activities');
});

test('duplicate sibling group and activity names are rejected as conflicts', () => {
    const Assignment = makeAssignment();
    assert.throws(() => Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1,
        groups: [{ name: 'Street' }, { name: 'street' }]
    }), error => error.code === 'duplicate_name' && error.path === 'groups[1].name');
    assert.throws(() => Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1,
        groups: [{ name: 'Street', activities: [{ name: 'Paint' }, { name: 'paint' }] }]
    }), error => error.code === 'duplicate_name');
    assert.throws(() => Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1,
        groups: [{ name: 'Street', children: [{ name: '10' }, { name: '10' }] }]
    }), error => error.code === 'duplicate_name');
});

test('explicit exclusions are recorded and never silently dropped', () => {
    const Assignment = makeAssignment();
    const data = {
        format: 'timerhub-assignment',
        version: 1,
        groups: [{
            name: 'Street',
            activities: [{ name: 'Paint' }, { name: 'Skip me', exclude: true }],
            children: [{ name: 'Removed house', exclude: true, activities: [{ name: 'Nothing' }] }]
        }]
    };
    const plan = Assignment.buildPlan(Assignment.normalizeAssignment(data));
    assert.equal(plan.activityCount, 1);
    assert.equal(plan.groupCount, 1);
    assert.deepEqual(plain(plan.excluded.map(item => [item.kind, item.path])), [
        ['activity', 'groups[0].activities[1]'],
        ['group', 'groups[0].children[0]']
    ]);
});

test('replace mode and empty assignments are detected', () => {
    const Assignment = makeAssignment();
    const normalized = Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1, mode: 'replace', groups: [{ name: 'Street' }]
    });
    assert.equal(normalized.mode, 'replace');
    assert.throws(() => Assignment.normalizeAssignment({
        format: 'timerhub-assignment', version: 1, mode: 'merge', groups: [{ name: 'Street' }]
    }), error => error.code === 'invalid_value' && error.path === 'mode');
    assert.throws(() => Assignment.normalizeAssignment({ format: 'timerhub-assignment', version: 1 }), error => error.code === 'empty_assignment');
});

test('script-like and HTML-looking strings are preserved as plain text', () => {
    const Assignment = makeAssignment();
    const data = {
        format: 'timerhub-assignment',
        version: 1,
        groups: [{
            name: '<img src=x onerror=alert(1)>',
            activities: [{ name: '<script>alert(1)</script>', notes: '"><svg onload=alert(1)>' }]
        }]
    };
    const plan = Assignment.buildPlan(Assignment.normalizeAssignment(data));
    assert.equal(plan.groups[0].name, '<img src=x onerror=alert(1)>');
    assert.equal(plan.groups[0].activities[0].name, '<script>alert(1)</script>');
    assert.equal(plan.groups[0].activities[0].notes, '"><svg onload=alert(1)>');
});

test('fingerprints are stable for equal assignments and differ for changes', () => {
    const Assignment = makeAssignment();
    const first = Assignment.normalizeAssignment(JSON.parse(JSON.stringify(simple)));
    const second = Assignment.normalizeAssignment(JSON.parse(JSON.stringify(simple)));
    assert.equal(Assignment.fingerprint(first), Assignment.fingerprint(second));
    const changed = Assignment.normalizeAssignment(JSON.parse(JSON.stringify(simple)));
    changed.assignmentName = 'Other';
    assert.notEqual(Assignment.fingerprint(first), Assignment.fingerprint(changed));
});

test('the AI prompt documents the exact schema and safety rules', () => {
    const Assignment = makeAssignment();
    const prompt = Assignment.ASSIGNMENT_PROMPT;
    assert.ok(prompt.includes('timerhub-assignment'));
    assert.ok(prompt.includes('"version": 1'));
    assert.ok(prompt.includes('"children"'));
    assert.ok(prompt.includes('"exclude": true'));
    assert.ok(prompt.includes('"mode": "replace"'));
    assert.ok(/Return valid JSON only/.test(prompt));
    assert.ok(/Never invent/.test(prompt));
    assert.ok(/ambiguous/.test(prompt));
    assert.ok(/clarifying question/.test(prompt));
});
