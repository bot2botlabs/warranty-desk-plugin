---
name: verify-warranty-receipt
description: Fetch a public Warranty Desk receipt (wdr_… ID or /r/ URL) to show which brand page, quote, and date a warranty answer came from. Use when the user or another agent asks "where did that warranty answer come from", "prove it", or shares a wdr_ receipt.
---

# Verify a warranty receipt

Tool: `get_warranty_receipt` on the `warranty-desk` MCP server.

## Data shape

`{ receipt: { id (wdr_…), product: "warranty-desk", kind: "warranty_lookup", format, format_version, issued_at, content_hash, lookup{…same as check_warranty…}, quoted_claim, quote, evidence[{url, fetched_at, retrieval, content_hash}], attestation, public_url, measurement } }`

## Steps

1. Take the ID from `receipt.id` in a previous `check_warranty` result, or from the `/r/<id>` part of a receipt URL.
2. Call `get_warranty_receipt` with `{ "id": "wdr_…" }`.
3. Show `quoted_claim`, `quote`, each `evidence[].url` with `fetched_at`, and `issued_at`.
4. Tell the user what it proves: Warranty Desk issued this answer at that time from that page, and `content_hash` lets anyone detect changes. It doesn't prove the brand will approve a claim.

Receipts are public and write-once. The human page is `https://warranty.bot2botlabs.com/r/<id>` and the raw JSON is `/api/v1/receipts/<id>`. Fetching a receipt is free but still needs the API key on MCP.
