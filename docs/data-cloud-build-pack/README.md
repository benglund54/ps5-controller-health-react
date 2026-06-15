# Data Cloud Build Pack: PS5 Controller Health Demo

This build pack converts planning into manual execution steps for rapid Data Cloud setup.

## Files in this pack
- `01_BUILD_ORDER.md`
- `02_CRM_DATA_STREAM_MAPPING.md`
- `03_FILE_UPLOAD_STREAM_MAPPING.md`
- `04_DMO_AND_RELATIONSHIP_MODEL.md`
- `05_IDENTITY_RESOLUTION_PLAN.md`
- `06_SEGMENTS_AND_INSIGHTS.md`
- `07_DATA_GRAPH_SPEC.md`
- `08_SNOWFLAKE_SETUP.sql`
- `09_SNOWFLAKE_SETUP_GUIDE.md`
- `10_DATA_LIBRARY_AND_RETRIEVERS.md`
- `11_VALIDATION_SCRIPT_AND_CHECKS.md`

## What to do first
1. Run `01_BUILD_ORDER.md`
2. Configure CRM streams using `02_CRM_DATA_STREAM_MAPPING.md`
3. Configure file streams using `03_FILE_UPLOAD_STREAM_MAPPING.md`
4. Configure identity and relationships (`05`, `04`)
5. Validate persona outcomes (`11`)

## What can be skipped
- Snowflake setup (`08`, `09`) can be skipped if out of scope.
- Data Library and retrievers (`10`) can be deferred if message grounding is not part of the current demo.

## What is required for demo
- CRM streams in place
- Required file streams in place
- 4 unified demo profiles
- Core relationships active
- Persona outcomes verifiable for Sarah, Marcus, Nina, and Alex
- Clear fallback plan if Data Cloud setup is incomplete

## What is optional
- Snowflake high-volume telemetry and engagement path
- Retriever-backed grounding documents

## Fastest path to show value
1. CRM streams
2. Required file streams
3. Identity resolution
4. Core segments
5. Data Graph (basic)
6. Persona validation and demo go/no-go decision

## Guardrail reminder
- Recommendation-only and preview-only messaging
- No operational writeback claims
- No frontend Salesforce/Data Cloud credentials
