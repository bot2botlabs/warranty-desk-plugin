---
name: check-warranty
description: Check whether a product is still under its brand's standard US manufacturer warranty, how long the term runs, what it excludes, and where to claim, quoted from the brand's own page. Use when the user asks "is my iPhone/Pixel/PS5/Xbox still under warranty", "how long is the <brand> warranty", or "where do I file a warranty claim". Not for store return windows.
---

# Check a manufacturer warranty

Tool: `check_warranty` on the `warranty-desk` MCP server.

## Data shape

`{ lookup: { id (wdl_…), brand, product, category, purchase_date, as_of, coverage: { months | null, basis (purchase_date | manufacture_date | null), confidence (high | medium | unknown), summary, quote | null, source_url }, estimated_expiry | null, status (likely_covered | likely_expired | unknown), status_reason, exclusions[], evidence[], claim_url, coverage_check_url, official_url }, receipt: { id (wdr_…), public_url, … }, meter }`

## Steps

1. Get the brand. Also ask for the product, category, and purchase date if the user has them. Never guess a purchase date.
2. Call `check_warranty` with `{ "brand": "<Brand>", "product": "<free text>", "category": "<phone|tv|laptop|…>", "purchase_date": "YYYY-MM-DD", "as_of": "<today>" }`.
3. If `coverage.months` is a number, give the term, `estimated_expiry`, and `status` with `status_reason`. Quote `coverage.quote` word for word.
4. If `coverage.months` is `null` or `confidence` is `unknown`, say the brand's public page doesn't state a general term. Point the user to `coverage_check_url` (check by serial or model) and `claim_url`. Don't fill in a typical number.
5. List the `exclusions` that matter for the user's situation (accident, liquid, modifications).
6. End with `receipt.public_url` so the user can see the source.

## Examples

- `{ brand: "Apple", product: "iPhone 15", purchase_date: "2026-01-10", as_of: "2026-11-02" }` → 12 months from purchase, expires 2027-01-10, `likely_covered`.
- `{ brand: "Samsung", category: "tv", purchase_date: "2025-12-01" }` → `months: null`, `confidence: unknown`, check by model.

## Scope

- v0 covers US brands Apple, Samsung, Sony, Google, Microsoft, Dell, HP, and Nike (`GET https://warranty.bot2botlabs.com/api/v1/brands`).
- Store return windows are a different tool (Deadline Desk). "Likely covered" is not a promise that a claim will be approved.
- Tool calls need a free `wdk_` API key from https://warranty.bot2botlabs.com/onboard. Each lookup mints a public receipt, so never put names, emails, or serial numbers in `product`.
