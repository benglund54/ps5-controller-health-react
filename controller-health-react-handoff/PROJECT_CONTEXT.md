# Project Context

## Source project summary

The current repo is a PS5-style demo with:
- high-fidelity PlayStation-like visual shell in `ps5-controller-health-demo.html`
- profile/persona selection UX
- controller-friendly interactions (keyboard/gamepad parity patterns)
- resilient API fallback behavior (`csv`, `salesforce`, `agentforce` modes)
- deterministic mock/CSV-backed response shaping

The current business story is Pronto delivery recovery. That business domain should not be carried over literally.

## Why this handoff exists

You want a **new clean React project** for a **Controller Health proactive recommendation** use case while preserving the strongest reusable assets:
- PS5 UI look/feel patterns
- layout and motion style
- interaction model
- deterministic response contract patterns
- mock data + fallback architecture style

## Reuse strategy

- Reuse visual and interaction patterns directly.
- Reuse API/response contract design patterns conceptually.
- Replace domain data/entities with controller-health entities.
- Keep server-side integration boundaries strict from day one.

## Non-goals

- No migration of old Pronto code paths.
- No in-place refactor of the existing app.
- No writing to Salesforce or operational systems.

