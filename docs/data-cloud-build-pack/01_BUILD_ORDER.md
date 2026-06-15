# 01 Build Order

## Exact execution order

| Order | Stage | Required | Owner | Exit criteria |
|---|---|---|---|---|
| 1 | Confirm Data Space and access | Yes | Data Cloud owner | Correct org, data space, and permissions confirmed |
| 2 | CRM streams | Yes | Salesforce/Core owner | 7 CRM streams created and run successfully |
| 3 | File upload streams | Yes | Data Cloud owner | 4 required file streams created and run successfully |
| 4 | Optional Snowflake streams | Optional | Data Cloud owner | Snowflake connected and datasets queryable, or marked out of scope |
| 5 | DMO mapping | Yes | Data Cloud owner | Required DMOs mapped with key fields |
| 6 | Identity resolution | Yes | Data Cloud owner | 4 unified demo profiles produced |
| 7 | Relationships | Yes | Data Cloud owner | All required joins active |
| 8 | Calculated insights and segments | Yes | Data Cloud owner | 5 demo segments built and validated |
| 9 | Data Graph | Yes | Data Cloud owner | Controller Health Context graph returns expected fields |
| 10 | Data Library and retrievers | Optional for now | Agent/Knowledge owner | Documents indexed or marked architecture-only |
| 11 | Validation and persona checks | Yes | Validation owner | Persona outcomes align with expected demo stories |
| 12 | Demo readiness decision | Yes | Demo lead | Live-ready or fallback-ready decision recorded |

## Fast-path recommendation
If time is limited, run this minimum path:
1. CRM streams
2. File streams
3. Identity resolution
4. Relationships
5. Core segments
6. Validation

Skip Snowflake and Data Library for live demo only if fallback messaging is ready.

## Stage gates and fallback

| Stage | Stop condition | Immediate fallback |
|---|---|---|
| CRM streams | Connector or ingestion failure | Run demo in middleware mock mode |
| File streams | Mapping or parsing failure | Use CRM-only context and present telemetry as planned extension |
| Identity resolution | Unified profile count not equal to 4 | Use demo player IDs directly without Data Cloud claims |
| Segments | Segment logic not stable | Present segment logic as design intent only |
| Data Graph | Graph response missing required nodes | Use middleware Salesforce mode and architecture story |

## Build scope guardrails
- No operational orders, claims, refunds, shipments, credits, coupons, or Case writeback.
- No frontend credentials for Salesforce or Data Cloud.
- Recommendation-only and preview-only messaging in all demo paths.
