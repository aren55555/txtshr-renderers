# `decision` renderer

Presents a question with two or more named options. The viewer picks one and
clicks "Confirm `<option>`", which reports the choice back to a server you
control.

This document describes the **integration contract** — what the system
minting the token and the system receiving the answer need to implement.
The renderer itself (`src/decision.ts`) only displays the question/options
and performs the redirect described below; it does not verify signatures or
record anything.

## Token format

The decrypted txtshr text must be a JWT (`header.payload.signature`). The
renderer decodes the **payload only** — it does not verify the signature.
The payload must be a JSON object with:

| Claim       | Type                  | Required | Description                                  |
|-------------|-----------------------|----------|-----------------------------------------------|
| `kind`      | `"decision"`          | yes      | Discriminator — must be exactly `"decision"`. |
| `question`  | `string`              | yes      | The prompt shown to the user.                 |
| `options`   | `string[]` (length ≥ 2) | yes   | Named choices, rendered as buttons.           |
| `submitUrl` | `string` (http/https) | yes      | Where the answer is reported (see below).     |
| `exp`       | `number` (unix seconds)| no      | If present and in the past, the renderer shows "This decision has expired." instead of the picker. |

Example payload:

```json
{
  "kind": "decision",
  "question": "Where should we eat tonight?",
  "options": ["Pizza Place", "Sushi Bar", "Taco Truck"],
  "submitUrl": "https://api.example.com/decisions/abc123",
  "exp": 1750000000
}
```

The JWT must be **signed** by the system that mints it (any algorithm) — the
signature is what `submitUrl` uses to trust `options` and `submitUrl` itself
when the answer comes back. Recommend including a unique identifier (e.g. a
`jti` claim, or bake an id into the `submitUrl` path) so the receiving side
can correlate the answer with a stored decision record.

## What happens on confirm

When the user clicks "Confirm `<option>`", the renderer performs a same-tab
navigation to:

```
${submitUrl}#token=<original JWT>&answer=<selected option>
```

`token` and `answer` are passed in the URL **fragment** (`#...`), which
browsers never send to a server. This sidesteps CORS/CSP entirely (it's a
navigation, not `fetch`) and keeps the JWT and answer out of server access
logs during the redirect itself.

## What `submitUrl` must implement

Because the fragment is never transmitted, `submitUrl` must serve an **HTML
page with client-side JS** (not a bare API endpoint) that:

1. Reads `location.hash` via `URLSearchParams` to extract `token` and `answer`.
2. Makes a same-origin request to its own backend with those two values
   (no CORS issue — same origin as the page itself).

That backend must then:

1. **Verify the JWT signature** using the key it originally signed with.
   This is the only place verification happens — the renderer never checks it.
2. Check `exp` hasn't passed and `kind === "decision"`.
3. Check `answer` is one of the signed `options` (reject otherwise — a
   tampered client could submit anything).
4. Record the decision (ideally idempotently, keyed by the unique id
   mentioned above, so repeated/duplicate submissions don't double-record).
5. Respond with a confirmation UI (success, already-resolved, or error).

## Local testing

`src/decision.ts` and the shared redirect helper (`src/lib/respond.ts`) can
be exercised without any of the above by:

1. Hand-building an **unsigned** JWT (`header.payload.sig` with any
   base64url-encoded payload — the renderer doesn't check the signature).
2. Serving `dist/decision.js` and a stub "echo" page (one that just decodes
   `location.hash` and displays `token`/`answer`) from a local static server.
3. Using that stub page as `submitUrl` in the token.

This validates the renderer's UI and the redirect shape end-to-end, but does
**not** exercise signature verification — that only exists once the real
`submitUrl` backend is built per the contract above.
