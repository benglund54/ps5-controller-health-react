# 10 Data Library and Retrievers

## Purpose
Define unstructured source documents for safe, grounded messaging. This supports future Agentforce response quality without enabling operational execution.

## Recommended source documents

| Document | Purpose | Retriever/search index purpose | Questions it should answer |
|---|---|---|---|
| DualSense Warranty and Replacement Policy | Ground warranty language and eligibility phrasing | Warranty-policy retriever | "Is this in warranty?" "What is preview-only replacement wording?" |
| Controller Firmware Troubleshooting Guide | Ground step-by-step troubleshooting copy | Firmware-guide retriever | "What should we recommend before replacement?" |
| DualSense Edge Stick Module Guide | Ground module-specific path messaging | Edge-module retriever | "When do we use module replacement vs full replacement?" |
| Controller Health Safe Messaging Guide | Guardrail-safe language references | Safety-copy retriever | "How do we phrase recommendation-only outcomes?" |
| Shipping and Delivery FAQ | Ground non-committal logistics language | Delivery-FAQ retriever | "How to describe estimated delivery without operational promises?" |

## Suggested content outlines

### 1) DualSense Warranty and Replacement Policy
- Scope and eligibility terms
- In-warranty vs out-of-warranty examples
- Approved demo-safe wording examples
- Prohibited claims and escalation notes

### 2) Controller Firmware Troubleshooting Guide
- Symptoms and diagnosis framing
- Firmware update first-path
- Retry and monitoring guidance
- Escalation thresholds

### 3) DualSense Edge Stick Module Guide
- Module architecture basics
- Candidate symptom patterns
- Recommended module path language
- Boundaries for when full controller replacement is not advised

### 4) Controller Health Safe Messaging Guide
- Recommendation-only language patterns
- Preview-only disclaimers
- Avoided terms list (shipment, refund, claim, order completed)
- Persona-specific phrasing examples

### 5) Shipping and Delivery FAQ
- Estimated delivery phrasing
- Address confirmation language
- No fulfillment guarantee disclaimer
- Safe alternatives if logistics data is unavailable

## Retriever implementation notes
- Index each document separately to isolate retrieval quality.
- Tag by topic (`warranty`, `firmware`, `module`, `safety`, `delivery`).
- Use recency metadata where policy revisions matter.
- Keep all outputs under server-side policy filter before reaching frontend.

## Guardrails
- These documents are for message grounding only.
- No operational actions should be inferred or executed.
- No claim/order/shipment/refund/coupon/credit/Case writeback instructions.
