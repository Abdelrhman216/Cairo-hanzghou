import "dotenv/config";
import { getHomeContent } from "./lib/server-store";

async function main() {
  console.log("Calling getHomeContent('en')...");
  const content = await getHomeContent("en");
  console.log("Returned content keys:", Object.keys(content));
  console.log("Settings keys:", Object.keys(content.settings || {}));
  console.log("Company keys:", Object.keys(content.company || {}));
  console.log("Stats count:", content.stats?.length);
  console.log("Testimonials count:", content.testimonials?.length);
  console.log("Shortcuts count:", content.shortcuts?.length);
  console.log("Services count:", content.services?.length);
  console.log("Destinations count:", content.destinations?.length);
  
  console.log("\nSample Statistics:\n", JSON.stringify(content.stats, null, 2));
  console.log("\nSample Shortcuts:\n", JSON.stringify(content.shortcuts, null, 2));
  console.log("\nSample Services:\n", JSON.stringify(content.services, null, 2));
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
