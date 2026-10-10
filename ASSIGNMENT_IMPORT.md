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
  "displayMode": "icon-and-text",
  "exclude": false
}
```

| Field | Required | Description |
| --- | --- | --- |
| `name` | yes | Activity name, up to 120 characters, unique among its siblings. |
| `notes` | no | Default note for new time entries, up to 500 characters. |
| `color` | no | `#RRGGBB`. Defaults to the TimerHub palette. |
| `shape` | no | One of `circle`, `square`, `rounded`, `diamond`, `triangle`, `hexagon`, `octagon`, `star`, `heart`, `oval`. |
| `size` | no | `small`, `medium` or `large`. Legacy: it only seeds the initial node size when the Activity has no explicit canvas layout yet. The canvas resize controls are the source of truth afterwards, and the creation dialog no longer exposes this field. |
| `icon` | no | Activity template icon: `vacuum-attic`, `vacuum-basement`, `mop`, `squeegee`, `duster` or `car`. Omit when nothing matches. |
| `displayMode` | no | `icon-only` renders just the icon; `icon-and-text` renders icon and name. Omit for the default (`icon-and-text`). |
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

If a required clarification is necessary because the execution sequence cannot be determined, ask a concise clarifying question in plain text instead of returning JSON.

Schema, version 1:
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
  "size": "small" | "medium" | "large" (optional, legacy: seeds the initial node size only),
  "icon": "vacuum-attic" | "vacuum-basement" | "mop" | "squeegee" | "duster" | "car" (optional),
  "displayMode": "icon-only" | "icon-and-text" (optional),
  "exclude": true (optional)
}

Rules:
1. Strict sequencing: the execution order of tasks and travel (Anfahrt) is determined by the user's input sequence or explicit instructions. Never reorder locations or invent a route geographically.
2. Clarification on order: if the order of locations or tasks is essential but cannot be determined from the input, ask a concise clarifying question instead of guessing. Do not manufacture a route, and do not ask unnecessary questions when the input already establishes a reasonable order.
3. Anfahrt: include travel activities with "icon": "car" at the beginning, before the first object, and between consecutive objects as instructed by the user. Do not invent extra travel activities when the assignment does not support them.
4. Placement of Anfahrt: place travel activities outside location groups, at the root level of the "activities" array, in the correct sequence relative to the root groups. Do not place them inside a street, building, or house group.
5. Group hierarchy: use "groups" for streets, locations, or other containers and "children" for nested containers such as houses. Nesting is unlimited, but keep it as shallow as the assignment allows. Put every work instruction into exactly one Activity and attach it to the most appropriate group.
6. Icon selection: set "icon" only when the instruction clearly matches one of the supported templates:
   - "vacuum-attic": vacuuming an attic or an explicitly equivalent roof-space area.
   - "vacuum-basement": vacuuming a basement or an explicitly equivalent cellar.
   - "mop": mopping or floor-cleaning work that clearly matches the template.
   - "squeegee": window cleaning using or clearly associated with a squeegee.
   - "duster": dusting or wiping dust from surfaces.
   - "car": travel activities such as Anfahrt.
   Omit the icon when nothing clearly matches. Do not assign an icon based merely on a vague association.
7. Display mode: the optional "displayMode" property controls whether the Activity shows only its icon or shows its icon and text.
   - "icon-only" means render the icon without a visible Activity name.
   - "icon-and-text" means render the icon together with the Activity name.
   - Set "displayMode": "icon-only" only when the input explicitly requests icon-only display or the task is clearly intended as a compact visual marker.
   - Otherwise omit "displayMode" and allow TimerHub to apply its default.
   - Do not omit the "name" property when using icon-only mode. The name remains the Activity logical identity and must be preserved even when it is not displayed on the canvas.
8. Preserve source information: preserve every address and work instruction exactly as written wherever the schema permits. Never invent addresses, activities, colors, or requirements. If the assignment does not state a value, omit that property instead of guessing.
9. Exclusions: never silently discard an instruction. If an instruction must be represented but intentionally not imported as an active Activity or group, use "exclude": true where supported. Preserve the excluded item original name and relevant information.
10. Import mode: use "mode": "replace" only when the user explicitly requests replacing a previous TimerHub import with the same "name". Otherwise omit "mode" or use the established default "add".
11. Unique names: group and Activity names must be unique among their siblings. If duplicate source names occur, preserve the original wording wherever possible and use the smallest necessary disambiguation without inventing factual details.
12. Output validity: return only a schema-valid object unless a required clarification is necessary. Never include unsupported properties. Do not silently omit required source information because the schema cannot represent it; ask for clarification or use a supported notes/exclusion mechanism.
```

## Security notes

- The JSON document is treated as untrusted input regardless of its source.
- Imported names and notes are only ever rendered as text (`textContent` / escaped HTML), never as markup.
- The import cannot supply internal IDs, database keys, URLs, storage paths or executable content. TimerHub generates all identifiers itself.
- The import cannot modify settings, credentials, time entries or Clockodo sync state; it only creates groups, activities and the local import ledger.
- The import is written in a single IndexedDB transaction; cancellation and failures leave the stored data unchanged.

Client-side validation reduces risk but is not a substitute for the browser's same-origin trust boundary; TimerHub stores assignments locally and does not execute imported content.
