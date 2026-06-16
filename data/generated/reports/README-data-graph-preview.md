# Data Graph Preview JSON Notes

Use this folder to store copied Data Graph Preview JSON payloads from Data Cloud UI for local validation.

## How to copy JSON Preview from Data Cloud
1. Open Data Cloud.
2. Open the Standard Data Graph: `PS5 Controller Health Context`.
3. Run Preview for a player (for example `PLAYER001`).
4. In the preview panel, copy the full JSON response.
5. Save that JSON into this folder as a `.json` file.

## Recommended filenames
- `ps5-controller-health-schema-preview.json`
- `player001-data-graph-record-preview.json`
- `player002-data-graph-record-preview.json`
- `player003-data-graph-record-preview.json`
- `player004-data-graph-record-preview.json`

## Run the local validator
Schema preview:
```bash
node scripts/data-cloud/validate-data-graph-preview.js data/generated/reports/ps5-controller-health-schema-preview.json
```

Record preview:
```bash
node scripts/data-cloud/validate-data-graph-preview.js data/generated/reports/player001-data-graph-record-preview.json
```

## Notes
- Schema preview mode validates graph structure only.
- Record preview mode validates player-specific context values when present.
- The validator supports flexible key and field-name matching.
- Missing `Case` context is treated as WARN, not FAIL.
- Validation fails only if root Individual context is missing or fewer than 4 core context areas are found.
