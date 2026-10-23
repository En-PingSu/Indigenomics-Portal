// Tests the supplier-website URL rules: only http(s) links are stored or rendered.
// Run: npx tsx scripts/test-safe-url.ts
import { normalizeWebsite, safeHttpUrl } from "../src/lib/url";

let fail = 0;
function check(name: string, ok: boolean) {
  console.log(`${ok ? "✅" : "❌"} ${name}`);
  if (!ok) fail++;
}

check("https URL kept", normalizeWebsite("https://eagle-river.ca/about") === "https://eagle-river.ca/about");
check("http URL kept", normalizeWebsite("http://eagle-river.ca") === "http://eagle-river.ca/");
check("bare domain gets https://", normalizeWebsite("eagle-river.ca") === "https://eagle-river.ca/");
check("empty stays empty", normalizeWebsite("  ") === "");
check("javascript: rejected", normalizeWebsite("javascript:alert(1)") === "");
check("JaVaScRiPt: with whitespace rejected", normalizeWebsite(" JaVaScRiPt:alert(1)") === "");
check("data: rejected", normalizeWebsite("data:text/html,<script>alert(1)</script>") === "");
check("vbscript: rejected", normalizeWebsite("vbscript:msgbox(1)") === "");
check("garbage rejected", normalizeWebsite("not a url at all") === "");

check("render: https link allowed", safeHttpUrl("https://eagle-river.ca/") === "https://eagle-river.ca/");
check("render: stored javascript: link dropped", safeHttpUrl("javascript:alert(1)") === undefined);
check("render: missing value", safeHttpUrl(undefined) === undefined);

if (fail) {
  console.error(`\n${fail} check(s) failed`);
  process.exit(1);
}
console.log("\nall checks passed");
