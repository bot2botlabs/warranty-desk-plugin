# Warranty Desk plugin (Agent Plugin)

**Ask "is this still under warranty?" and get the brand's stated term, an expiry date, and a verifiable receipt. If the term isn't known, it says so.**

```bash
curl -s https://warranty.bot2botlabs.com/mcp -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"check_warranty","arguments":{"brand":"Apple","product":"iPhone 15","purchase_date":"2026-01-10"}}}'
```

No key needed for that call: the free tier allows 20 keyless tool calls per day per IP.

US brand and manufacturer warranty lookup by Bot2Bot Labs. It returns the term only when the brand's page states it, plus exclusions, where to claim, and a public receipt.

- MCP: hosted Streamable HTTP at `https://warranty.bot2botlabs.com/mcp` (see `mcp.json`)
- Tools: `check_warranty`, `get_warranty_receipt`
- Skills: `check-warranty`, `verify-warranty-receipt`
- Brands (v0, US): Apple, Samsung, Sony, Google, Microsoft, Dell, HP, Nike

## API key and cost

**Free tier, no key:** up to 20 tool calls per day per IP (resets 00:00 UTC). Keyless calls are never billed. A keyless lookup belongs to no account, so only its public receipt can be read back. Each keyless response includes a `free_tier` object with `used`, `remaining` and `resets_at`. Past the cap, the server returns JSON-RPC error `-32029` with a link to the free-key page.

**More than 20 a day:** get a free `wdk_` key (no card) from https://warranty.bot2botlabs.com/onboard and send `Authorization: Bearer wdk_…`. Only keys issued there are accepted. This package stores no key; add the header in your client's MCP settings. The shared demo key on https://warranty.bot2botlabs.com/docs/demo also works and is never billed.

Terms: https://warranty.bot2botlabs.com/terms · Privacy: https://warranty.bot2botlabs.com/privacy

## Prove it

```bash
node scripts/prove.mjs                                # keyless free tier
WARRANTY_DESK_API_KEY=<your key> node scripts/prove.mjs   # or with your key
```

Node 22+, no dependencies. The script lists the tools and runs one call per skill, keyless unless `WARRANTY_DESK_API_KEY` is set. The key is never printed.

Docs: https://warranty.bot2botlabs.com/llms.txt · demo receipts: https://warranty.bot2botlabs.com/docs/demo

License: MIT

---

## About Bot2Bot Labs

Bot2Bot Labs publishes [dated AI receipts](https://bot2botlabs.com/receipts) — what AI-built software costs to build and run, how long it took, what broke, and what subscription it replaces.

- Site: [bot2botlabs.com](https://bot2botlabs.com)
- For agents: [bot2botlabs.com/agents](https://bot2botlabs.com/agents)
- X: [@bot2botlabs](https://x.com/bot2botlabs)
- Contact: jordan@bot2botlabs.com

Measured. Dated. Reproducible. No paid placement.
