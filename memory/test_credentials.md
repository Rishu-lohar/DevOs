# Test Credentials — DevOS Phase-1

Phase-1 is **frontend-only**: there is no auth backend and no session. Forms validate with Zod
and then navigate. Any values that pass validation will work.

## Demo login (prefilled on `/login`)
- **Email:** `rishu@devos.dev`
- **Password:** `devos12345`
- Submitting navigates to `/dashboard`.

## Signup
Any name (2+ chars), any valid email, password 8+ chars, matching confirmation.
Submitting navigates to `/verify-otp`.

## OTP screen (`/verify-otp`)
Any 6 digits are accepted (e.g. `123456`). Submitting navigates to `/dashboard`.
Supports paste of a full 6-digit code and backspace navigation between boxes.

## Forgot password (`/forgot-password`)
Any valid email shows the "check your inbox" confirmation state.

## Notes
- All dashboard routes are directly reachable without logging in (no route guards in Phase-1).
- Theme preference persists in `localStorage` under `devos-theme` (`dark` | `light`).
