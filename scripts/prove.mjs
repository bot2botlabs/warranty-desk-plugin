// Zero-dep proof harness (Node 22+). Reads this plugin's mcp.json, speaks
// Streamable HTTP JSON-RPC to the configured server, lists tools, and runs one
// core call per skill. Tool calls on this server need an API key: pass your own
// free key (from https://warranty.bot2botlabs.com/onboard) in the WARRANTY_DESK_API_KEY environment variable. The key is
// sent only as a request header and is never printed or written to disk.
import { readFileSync } from "node:fs";
const cfg = JSON.parse(readFileSync(new URL("../mcp.json", import.meta.url)));
const url = cfg.mcpServers["warranty-desk"].url;
const key = process.env.WARRANTY_DESK_API_KEY;
let id = 0, session;
async function rpc(method, params, withKey = true) {
  const headers = { "content-type": "application/json", accept: "application/json, text/event-stream" };
  if (session) headers["mcp-session-id"] = session;
  if (withKey && key) headers.authorization = `Bearer ${key}`;
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }) });
  session = res.headers.get("mcp-session-id") ?? session;
  const text = await res.text();
  const data = text.includes("data:") ? text.split("\n").filter(l => l.startsWith("data:")).map(l => l.slice(5)).pop() : text;
  return { status: res.status, body: JSON.parse(data) };
}
function payloadOf(r) {
  const res = r.body.result;
  if (!res) return r.body.error;
  if (res.structuredContent) return res.structuredContent;
  try { return JSON.parse(res.content?.[0]?.text); } catch { return res.content?.[0]?.text; }
}
const steps = [];
const init = await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "warranty-desk-plugin-proof", version: "0.1.0" } }, false);
steps.push({ step: "initialize (no key)", http: init.status, pass: init.status === 200 && !!init.body.result, server: init.body.result?.serverInfo, protocol: init.body.result?.protocolVersion });
const tl = await rpc("tools/list", {}, false);
steps.push({ step: "tools/list (no key)", http: tl.status, pass: !!tl.body.result?.tools, tools: tl.body.result?.tools?.map(t => t.name) });
const unkeyed = await rpc("tools/call", { name: "check_warranty", arguments: { brand: "Apple" } }, false);
steps.push({ step: "tools/call without key (expected to fail)", http: unkeyed.status, result: payloadOf(unkeyed) });
if (!key) { console.error("Set WARRANTY_DESK_API_KEY to run keyed tool calls."); }
else {
  const ctx = {};
  for (const [skill, tool, argsFn, pick] of [
  ["check-warranty", "check_warranty", () => ({ brand: "Apple", product: "iPhone 15", category: "phone", purchase_date: "2026-01-10", as_of: "2026-11-02" }), (p, c) => { c.rid = p?.receipt?.id ?? p?.receipt?.receipt_id ?? (p?.receipt?.public_url || "").split("/r/")[1]; }],
  ["check-warranty (unknown-term brand)", "check_warranty", () => ({ brand: "Samsung", category: "tv", purchase_date: "2025-12-01", as_of: "2026-11-02" })],
  ["verify-warranty-receipt", "get_warranty_receipt", (c) => ({ id: c.rid })],
]) {
    const args = argsFn(ctx);
    const r = await rpc("tools/call", { name: tool, arguments: args });
    const payload = payloadOf(r);
    const pass = r.status === 200 && !r.body.error && !r.body.result?.isError;
    if (pass && pick) pick(payload, ctx);
    steps.push({ step: `${skill}: ${tool}`, args, http: r.status, pass, payload });
  }
}
console.log(JSON.stringify({ url, ran_at: new Date().toISOString(), key_used: key ? "set (value not recorded)" : "none", steps }, null, 2));
