# Cursor Handoff: Add User Profile Slot

## 1) Current goal
Finish visual fidelity for the PS5-style profile picker so `Add User` renders as a true profile slot circle and matches the reference behavior/scale, while preserving working carousel navigation.

## 2) Current problem
`Add User` has been inconsistent across states: it has sometimes appeared as a small icon/text treatment instead of a full circular avatar slot. The latest pass moved it onto the shared avatar-shell sizing system, but this still needs visual confirmation in both side and center states.

## 3) Files inspected
- `src/components/ProfilePicker.jsx`
- `src/styles/ps5-console.css`
- `src/components/LiveClock.jsx`

## 4) Files modified
- `src/components/ProfilePicker.jsx`
- `src/styles/ps5-console.css`
- `docs/cursor-handoff-add-user-profile-slot.md` (this handoff)

## 5) Relevant component/CSS structure
- Component: `src/components/ProfilePicker.jsx`
  - Carousel item types: `addUser` + persona items
  - Slot rendering uses `left`, `center`, `right` classes
  - Add User now uses:
    - `ps5-profile-option ps5-add-user-btn`
    - `ps5-avatar-shell`
    - `add-user-disk`
    - `add-user-plus`
    - `ps5-profile-name add-user-label`
  - Persona item uses:
    - `ps5-avatar-shell`
    - `ps5-avatar-ring`
    - `ps5-avatar-face`
- CSS: `src/styles/ps5-console.css`
  - Shared sizing variables:
    - `--profile-avatar-size-side`
    - `--profile-avatar-size-center`
  - Shared shell sizing:
    - `.ps5-avatar-shell`
    - `.ps5-profile-slot.center .ps5-avatar-shell`
  - Add User visual classes:
    - `.ps5-add-user-btn`
    - `.ps5-add-user-disk`
    - `.ps5-add-user-btn .add-user-plus`
    - `.ps5-profile-slot.center .ps5-add-user-btn .add-user-plus`
    - `.add-user-label`

## 6) Exact visual behavior required
- Add User must be a real circular avatar-slot item, not a small icon-only element.
- Non-selected (side slot):
  - same shell size as other non-selected avatars
  - gray translucent circular disk
  - centered plus sign
  - `Add User` label below disk
- Selected (center slot):
  - same shell size as selected avatar slot
  - larger centered plus
  - label remains below disk
  - optional soft glow, no harsh border
- No carousel logic changes.

## 7) What has already been tried
- Multiple visual tuning passes on picker typography, spacing, glow, hints, and background overlays.
- Add User transitioned from custom ad-hoc sizing to shared avatar-shell sizing.
- Increased Add User opacity/visibility and adjusted plus scaling.
- Added selected-profile controller indicator and cleaned picker metadata display.
- Reverted one intermediate pass when requested, then re-applied targeted adjustments.

## 8) What still needs verification
- Visual confirmation in runtime:
  1. Initial state: Add User left appears as full translucent circle, not tiny square/icon.
  2. ArrowLeft to center Add User: disk scales to selected shell size, label stays below.
  3. ArrowRight back to Sarah: Add User returns to side-shell size and remains circular/visible.
- Confirm no clipping, square collapse, or unintended inheritance from slot scaling.

## 9) Known risks
- Combined transforms on slot + button can visually compress Add User if inner elements don’t inherit shell sizing cleanly.
- Background overlays/haze can reduce perceived Add User contrast, making disk look “missing.”
- Side-slot dimming (`opacity/filter`) can make Add User appear too faint versus expectation.

## 10) Guardrails and boundaries
- Frontend-only visual refinement.
- Do not change carousel behavior or selectedIndex logic.
- Do not refactor unrelated components.
- Do not modify home screen behavior.
- Do not add dependencies.
- Do not add backend/Salesforce/Data Cloud/Agentforce/API/auth work.
- Do not add Case/Recovery Action/data model changes.
- Do not commit.
