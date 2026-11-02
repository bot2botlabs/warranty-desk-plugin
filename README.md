# Warranty Desk plugin (Agent Plugin)

**Ask "is this still under warranty?" and get the brand's stated term, an expiry date, and a verifiable receipt. If the term isn't known, it says so.**

```bash
curl -s https://warranty.bot2botlabs.com/mcp -H 'content-type: application/json' \
  -H 'Authorization: Bearer wdk_…' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"check_warranty","arguments":{"brand":"Apple","product":"iPhone 15","purchase_date":"2026-01-10"}}}'
```

US brand and manufacturer warranty lookup by Bot2Bot Labs. It returns the term only when the brand's page states it, plus exclusions, where to claim, and a public receipt.

- MCP: hosted Streamable HTTP at `https://warranty.bot2botlabs.com/mcp` (see `mcp.json`)
- Tools: `check_warranty`, `get_warranty_receipt`
- Skills: `check-warranty`, `verify-warranty-receipt`
- Brands (v0, US): Apple, Samsung, Sony, Google, Microsoft, Dell, HP, Nike

## API key

`initialize` and `tools/list` work without a key. **Tool calls need a free `wdk_` key** from https://warranty.bot2botlabs.com/onboard, sent as `Authorization: Bearer wdk_…`. This package doesn't store a key; add the header in your client's MCP settings.

Try it first with the shared demo key on https://warranty.bot2botlabs.com/docs/demo (never billed). Terms: https://warranty.bot2botlabs.com/terms · Privacy: https://warranty.bot2botlabs.com/privacy

## Prove it

```bash
WARRANTY_DESK_API_KEY=<your key> node scripts/prove.mjs
```

Node 22+, no dependencies. The script lists the tools, shows that an unkeyed call is refused, and then runs one call per skill. The key is never printed.

Docs: https://warranty.bot2botlabs.com/llms.txt · demo receipts: https://warranty.bot2botlabs.com/docs/demo

License: MIT
