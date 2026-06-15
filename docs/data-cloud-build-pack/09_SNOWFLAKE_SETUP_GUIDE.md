# 09 Snowflake Setup Guide

## What must exist in Snowflake
- Database and schema for demo raw tables
- Stage for CSV upload
- CSV file format
- Two target tables:
  - `CONTROLLER_TELEMETRY`
  - `GAMEPLAY_ENGAGEMENT`

Use `08_SNOWFLAKE_SETUP.sql` to create these artifacts.

## CSV to Snowflake mapping

| CSV file | Snowflake table | Key |
|---|---|---|
| `controller_telemetry_events_snowflake.csv` | `PS5_DEMO.RAW.CONTROLLER_TELEMETRY` | `telemetry_event_id` |
| `gameplay_engagement_snowflake.csv` | `PS5_DEMO.RAW.GAMEPLAY_ENGAGEMENT` | `engagement_id` |

## What Data Cloud should connect to
- Preferred: Snowflake connector to `PS5_DEMO.RAW` schema
- Expose the two tables above as Data Cloud streams
- Use `player_id` as cross-source join key
- Keep `controller_serial` available for device-level joins

## If Snowflake is not ready
- Continue with CRM streams + file uploads only.
- Use `data/external/gameplay_engagement.csv` as engagement substitute.
- Keep Snowflake as optional architecture extension in presentation.

## How to present Snowflake as architecture story only
Use this short framing:
- "For scale, telemetry and engagement live in Snowflake."
- "Data Cloud ingests and unifies this with Salesforce profile and entitlement context."
- "Today’s demo can run without Snowflake, and Snowflake can be enabled without changing frontend behavior."

## Validation checklist

| Check | Expected |
|---|---|
| Telemetry row count | 41 |
| Engagement row count | 46 |
| Distinct `player_id` | 4 demo players |
| Data Cloud connector test | Successful |
