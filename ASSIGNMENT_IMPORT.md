# TimerHub Work Assignment Import (JSON)

TimerHub can create groups and activities from a versioned JSON "work assignment". The JSON is normally produced by an external AI assistant (ChatGPT, DeepSeek, Gemini, …) from the user's own instructions. TimerHub never calls an AI service, never requires an AI API key, and never uploads the assignment or any user data. Parsing, validation, previewing and the import itself all happen locally in the browser.

## How to use it

1. Open **Settings → Work assignments → Import assignment from JSON**.
2. Press **Copy AI prompt** and give that prompt plus your assignment text to an AI assistant. You can also use the prompt below.
3. Paste the returned JSON into the text area (or choose a `.json` file).
4. Press **Validate & preview**. TimerHub validates everything locally and shows the groups, houses, activities and any explicit exclusions or replacements.
5. Press **Import** (or **Import again** for an assignment that was already imported) to create the structure. **Cancel** always leaves all data unchanged.

Nothing is written until the preview is confirmed. A failed write is atomic: TimerHub never leaves a partially created hierarchy behind.

## Mapping to the existing TimerHub model

TimerHub Groups V1 is a flat model: every activity belongs to at most one group. Nested assignment groups are therefore mapped to flat groups whose names contain the full path, joined with ` · `:

```text
Flower Street
Flower Street · 10
Flower Street · 12
```

All activities of a nested group are placed into that flattened group. Activities listed directly on a parent group stay in the parent group. Top-level activities are created without a group. Imported activities default to the smallest supported size so small assignments stay compact; an explicit `size` in the JSON is honored, and existing user-created activities keep their sizes. Group bounds are computed from the actual member boxes with the usual padding and header.

## Schema (version 1)

Top level:

```json
{
  "format": "timerhub-assignment",
  "version": 1,
  "name": "optional assignment name",
  "mode": "add",
  "groups": [Group],
  "activities": [Activity]
}
```

| Field | Required | Description |
| --- | --- | --- |
| `format` | yes | Always `timerhub-assignment`. |
| `version` | yes | Always `1`. Other versions are rejected. |
| `name` | no | Assignment name, up to 120 characters. Used to label a `replace` import. |
| `mode` | no | `"add"` (default) or `"replace"`. |
| `groups` | no | Array of group nodes. |
| `activities` | no | Array of ungrouped activity nodes. |

At least one group or activity must be present.

Group:

```json
{
  "name": "Flower Street",
  "collapsed": false,
  "exclude": false,
  "activities": [Activity],
  "children": [Group]
}
```

| Field | Required | Description |
| --- | --- | --- |
| `name` | yes | Group name, up to 120 characters, unique among its siblings. |
| `collapsed` | no | Start the imported group collapsed. |
| `exclude` | no | Explicitly exclude this group and its subtree from the import. |
| `activities` | no | Activities that belong directly to this group. |
| `children` | no | Nested groups (streets → houses). Nesting is limited to 8 levels. |

Activity:

```json
{
  "name": "Weiß gemalert",
  "notes": "В зале",
  "color": "#e74c3c",
  "shape": "square",
  "size": "large",
  "icon": "mop",
  "exclude": false
}
```

| Field | Required | Description |
| --- | --- | --- |
| `name` | yes | Activity name, up to 120 characters, unique among its siblings. |
| `notes` | no | Default note for new time entries, up to 500 characters. |
| `color` | no | `#RRGGBB`. Defaults to the TimerHub palette. |
| `shape` | no | One of `circle`, `square`, `rounded`, `diamond`, `triangle`, `hexagon`, `octagon`, `star`, `heart`, `oval`. |
| `size` | no | `small`, `medium` or `large`. |
| `icon` | no | Activity template icon: `vacuum-attic`, `vacuum-basement`, `mop`, `squeegee`, `duster` or `car`. Omit when nothing matches. |
| `exclude` | no | Explicitly exclude this activity from the import. |

Unknown fields are rejected (no silent forward compatibility). This keeps the schema strict and predictable; a future change will use a new `version`.

## Operations

- **add** (default): only creates new groups and activities. Existing groups, activities, time entries, settings, credentials and Clockodo state are never modified.
- **replace**: before importing, TimerHub removes only groups and activities that were created by a previous import with the same assignment `name`. User-created items and everything unrelated stay untouched. The preview lists exactly what will be removed.
- **exclude**: a node marked `"exclude": true` is not imported. It is shown in the preview with an "excluded" badge, so nothing is discarded silently.

Duplicate sibling names (groups or activities inside the same parent, case-insensitive) are rejected as ambiguous. A repeated import of the exact same assignment is detected and requires the explicit **Import again** action.

## Limits

| Limit | Value |
| --- | --- |
| JSON input size | 512 KB |
| Groups | 300 |
| Activities | 1000 |
| Nesting depth | 8 |
| Name length | 120 characters |
| Note length | 500 characters |
| Explicitly excluded items | 200 |

Errors are shown with the relevant JSON path, for example: `Duplicate names in the same group are not allowed. (at groups[0].children[1].name)`.

## Ready-to-copy AI prompt

The same prompt is available in the import dialog via **Copy AI prompt**.

```text
You convert a work assignment into the TimerHub assignment JSON format.
Return valid JSON only. Do not use Markdown fences, comments, or explanations.

Schema (version 1):
{
  "format": "timerhub-assignment",
  "version": 1,
  "name": "short assignment name (optional)",
  "mode": "add" | "replace" (optional, default "add"),
  "groups": [Group, ...],
  "activities": [Activity, ...]
}
Group = {
  "name": "required group name",
  "collapsed": true (optional),
  "exclude": true (optional, see below),
  "activities": [Activity, ...],
  "children": [Group, ...]
}
Activity = {
  "name": "required activity name",
  "notes": "optional note",
  "color": "#RRGGBB" (optional),
  "shape": "circle" | "square" | "rounded" | "diamond" | "triangle" | "hexagon" | "octagon" | "star" | "heart" | "oval" (optional),
  "size": "small" | "medium" | "large" (optional),
  "icon": "vacuum-attic" | "vacuum-basement" | "mop" | "squeegee" | "duster" | "car" (optional),
  "exclude": true (optional)
}

Rules:
- Use "groups" for streets, locations, or other containers and "children" for nested containers such as houses. Nesting is unlimited, but keep it as shallow as the assignment allows.
- Put every work instruction into exactly one activity. Use "activities" directly on the group it belongs to.
- Set "icon" only when the instruction clearly matches one of the supported templates: vacuum-attic (vacuuming the attic), vacuum-basement (vacuuming the basement), mop (mopping or floor cleaning), squeegee (window cleaning), duster (dusting), car (travelling to a site). Omit it when nothing matches.
- Preserve every address and every work instruction exactly as written. Never invent addresses, activities, colors, or requirements. If the assignment does not state a value, omit that property.
- Never drop anything silently. If an instruction is intentionally not to be imported, represent it with "exclude": true instead of removing it.
- Use "mode": "replace" only when the user explicitly asks to replace a previous TimerHub import of the same "name". Otherwise omit mode.
- Group and activity names must be unique among their siblings.
- If any instruction is ambiguous or cannot be interpreted reliably, stop and ask the user a clarifying question instead of guessing. A clarifying question must not be valid JSON; ask it before producing the final JSON.
- Output raw JSON only, with no other text.
```

## Security notes

- The JSON document is treated as untrusted input regardless of its source.
- Imported names and notes are only ever rendered as text (`textContent` / escaped HTML), never as markup.
- The import cannot supply internal IDs, database keys, URLs, storage paths or executable content. TimerHub generates all identifiers itself.
- The import cannot modify settings, credentials, time entries or Clockodo sync state; it only creates groups, activities and the local import ledger.
- The import is written in a single IndexedDB transaction; cancellation and failures leave the stored data unchanged.

Client-side validation reduces risk but is not a substitute for the browser's same-origin trust boundary; TimerHub stores assignments locally and does not execute imported content.
