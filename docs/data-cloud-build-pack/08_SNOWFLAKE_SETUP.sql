-- 08_SNOWFLAKE_SETUP.sql
-- Demo-safe Snowflake setup for optional Data Cloud telemetry + engagement ingest
-- No credentials included.

-- -----------------------------------------------------------------------------
-- 1) Database and schema
-- -----------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS PS5_DEMO;
CREATE SCHEMA IF NOT EXISTS PS5_DEMO.RAW;

-- -----------------------------------------------------------------------------
-- 2) File format and stage placeholders
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FILE FORMAT PS5_DEMO.RAW.CSV_FF
  TYPE = 'CSV'
  SKIP_HEADER = 1
  FIELD_OPTIONALLY_ENCLOSED_BY = '"'
  EMPTY_FIELD_AS_NULL = TRUE
  TRIM_SPACE = TRUE;

-- Replace URL with your secure location if using external stage.
CREATE OR REPLACE STAGE PS5_DEMO.RAW.DEMO_STAGE
  FILE_FORMAT = PS5_DEMO.RAW.CSV_FF;

-- -----------------------------------------------------------------------------
-- 3) Telemetry table
-- -----------------------------------------------------------------------------
CREATE OR REPLACE TABLE PS5_DEMO.RAW.CONTROLLER_TELEMETRY (
  telemetry_event_id            STRING,
  player_id                     STRING,
  psn_handle                    STRING,
  controller_serial             STRING,
  controller_model              STRING,
  signal_timestamp              TIMESTAMP_NTZ,
  right_stick_drift_score       FLOAT,
  left_stick_drift_score        FLOAT,
  disconnect_frequency_score    FLOAT,
  battery_health_pct            NUMBER(5,2),
  session_hours_l7d             NUMBER(10,2),
  session_hours_l30d            NUMBER(10,2),
  cumulative_session_hours      NUMBER(12,2),
  button_events_l7d             NUMBER,
  haptic_events_l7d             NUMBER,
  trigger_events_l7d            NUMBER,
  firmware_version              STRING,
  firmware_latest               STRING,
  update_available              BOOLEAN,
  issue_confidence              STRING,
  raw_signal_source             STRING,
  region                        STRING,
  ingested_at                   TIMESTAMP_NTZ
);

-- -----------------------------------------------------------------------------
-- 4) Engagement table
-- -----------------------------------------------------------------------------
CREATE OR REPLACE TABLE PS5_DEMO.RAW.GAMEPLAY_ENGAGEMENT (
  engagement_id                 STRING,
  player_id                     STRING,
  psn_handle                    STRING,
  period_start                  DATE,
  period_end                    DATE,
  session_count                 NUMBER,
  total_hours_played            NUMBER(10,2),
  avg_session_minutes           NUMBER(10,2),
  longest_session_minutes       NUMBER(10,2),
  titles_played                 NUMBER,
  unique_genres                 NUMBER,
  top_genre                     STRING,
  top_title_category            STRING,
  top_title_id                  STRING,
  trophies_earned               NUMBER,
  trophies_platinum             NUMBER,
  trophies_gold                 NUMBER,
  trophies_silver               NUMBER,
  ps_store_visits               NUMBER,
  ps_store_purchases            NUMBER,
  wishlist_adds                 NUMBER,
  share_events                  NUMBER,
  friend_activity_events        NUMBER,
  ps_plus_content_accessed      NUMBER,
  party_sessions                NUMBER,
  voice_chat_minutes            NUMBER(10,2),
  region                        STRING,
  platform_version              STRING,
  ingested_at                   TIMESTAMP_NTZ
);

-- -----------------------------------------------------------------------------
-- 5) COPY examples
-- -----------------------------------------------------------------------------
-- Upload files to @PS5_DEMO.RAW.DEMO_STAGE before running COPY.
-- Example source filenames:
--   controller_telemetry_events_snowflake.csv
--   gameplay_engagement_snowflake.csv

COPY INTO PS5_DEMO.RAW.CONTROLLER_TELEMETRY
FROM @PS5_DEMO.RAW.DEMO_STAGE/controller_telemetry_events_snowflake.csv
FILE_FORMAT = (FORMAT_NAME = PS5_DEMO.RAW.CSV_FF)
ON_ERROR = 'ABORT_STATEMENT';

COPY INTO PS5_DEMO.RAW.GAMEPLAY_ENGAGEMENT
FROM @PS5_DEMO.RAW.DEMO_STAGE/gameplay_engagement_snowflake.csv
FILE_FORMAT = (FORMAT_NAME = PS5_DEMO.RAW.CSV_FF)
ON_ERROR = 'ABORT_STATEMENT';

-- -----------------------------------------------------------------------------
-- 6) Validation queries
-- -----------------------------------------------------------------------------
SELECT COUNT(*) AS telemetry_rows FROM PS5_DEMO.RAW.CONTROLLER_TELEMETRY;
SELECT COUNT(*) AS engagement_rows FROM PS5_DEMO.RAW.GAMEPLAY_ENGAGEMENT;

SELECT DISTINCT player_id
FROM PS5_DEMO.RAW.CONTROLLER_TELEMETRY
ORDER BY player_id;

SELECT player_id, MAX(right_stick_drift_score) AS max_drift
FROM PS5_DEMO.RAW.CONTROLLER_TELEMETRY
GROUP BY player_id
ORDER BY player_id;

SELECT player_id, SUM(total_hours_played) AS hours_played
FROM PS5_DEMO.RAW.GAMEPLAY_ENGAGEMENT
GROUP BY player_id
ORDER BY hours_played DESC;
