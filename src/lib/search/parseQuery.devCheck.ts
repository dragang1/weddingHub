/**
 * Dev-only sanity checks for parseSearchQuery.
 * Run: npx tsx src/lib/search/parseQuery.devCheck.ts
 * Not imported in production.
 */

import { parseSearchQuery } from "./parseQuery";

const cases: [string, { category: string | null; city: string | null; confidence: string }][] = [
  ["muzika sarajevo", { category: "music", city: "Sarajevo", confidence: "high" }],
  ["salon bl", { category: null, city: "Banja Luka", confidence: "low" }],
  ["sminka sarajevo", { category: "beauty", city: "Sarajevo", confidence: "high" }],
  ["torta zenica", { category: "cakes", city: "Zenica", confidence: "high" }],
  ["fotograf tuzla", { category: "photo_video", city: "Tuzla", confidence: "high" }],
];

function runSanityCheck(): void {
  console.log("Parse sanity checks:\n");
  let ok = 0;
  for (const [query, expected] of cases) {
    const result = parseSearchQuery(query);
    const match =
      result.category === expected.category &&
      result.city === expected.city &&
      result.confidence === expected.confidence;
    if (match) ok++;
    console.log(
      match ? "  OK" : "  FAIL",
      query,
      "->",
      { category: result.category, city: result.city, confidence: result.confidence }
    );
  }
  console.log("\n", ok, "/", cases.length, "passed");
}

runSanityCheck();
