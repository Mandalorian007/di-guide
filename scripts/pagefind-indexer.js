import * as pagefind from "pagefind";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function buildSearchIndex() {
  console.log("🔍 Building search index...");

  try {
    const { index } = await pagefind.createIndex({
      rootSelector: "[data-pagefind-body]",
      excludeSelectors: [
        "nav",
        "header",
        "footer",
        ".sidebar",
        "[data-pagefind-ignore]"
      ]
    });

    const stats = await index.addDirectory({
      path: join(projectRoot, ".next/server/app"),
      glob: "**/*.html"
    });

    await index.writeFiles({
      outputPath: join(projectRoot, "public/pagefind")
    });
    
    console.log("\n✅ Search index built successfully!");
    console.log(`📊 Stats:
• Pages indexed: ${stats.page_count}
`);

  } catch (error) {
    console.error("❌ Error building search index:", error);
    process.exit(1);
  }
}

buildSearchIndex();
