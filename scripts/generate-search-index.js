import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function parseMdx(rawMdx) {
  const frontmatterRegex = /---\n([\s\S]*?)\n---/;
  const match = rawMdx.match(frontmatterRegex);
  if (!match) return null;

  const frontmatterStr = match[1];
  const content = rawMdx.replace(frontmatterRegex, '').trim();
  
  // Basic YAML parsing (for simple key-value pairs)
  const frontmatter = {};
  frontmatterStr.split('\n').forEach(line => {
    const [key, ...values] = line.split(':');
    if (key && values.length) {
      frontmatter[key.trim()] = values.join(':').trim();
    }
  });

  return { frontmatter, content };
}

async function generateSearchIndex() {
  console.log("🔍 Generating search index...");
  const searchIndex = [];
  let id = 1;

  try {
    // Index docs
    const docsDir = join(projectRoot, 'contents/docs');
    await indexDocsRecursively(docsDir, '', searchIndex, id);
    
    // Index blogs
    const blogsDir = join(projectRoot, 'contents/blogs');
    await indexBlogs(blogsDir, searchIndex, id);

    // Write the search index to a JSON file
    const outputPath = join(projectRoot, 'public/search-index.json');
    await fs.writeFile(outputPath, JSON.stringify(searchIndex, null, 2));
    
    console.log("\n✅ Search index generated successfully!");
    console.log(`📊 Stats:
• Total documents indexed: ${searchIndex.length}
• Index file: public/search-index.json
`);

  } catch (error) {
    console.error("❌ Error generating search index:", error);
    process.exit(1);
  }
}

async function indexDocsRecursively(currentPath, urlPath, searchIndex, id) {
  const entries = await fs.readdir(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(currentPath, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively process subdirectories
      await indexDocsRecursively(
        fullPath,
        urlPath ? `${urlPath}/${entry.name}` : entry.name,
        searchIndex,
        id
      );
    } else if (entry.name === 'index.mdx') {
      // Process MDX file
      const content = await fs.readFile(fullPath, 'utf-8');
      const parsed = await parseMdx(content);
      if (!parsed) continue;

      const { frontmatter, content: mdxContent } = parsed;
      
      searchIndex.push({
        id: String(id++),
        url: `/docs/${urlPath}`,
        title: frontmatter.title || 'Untitled',
        content: mdxContent
      });
    }
  }
}

async function indexBlogs(blogsDir, searchIndex, id) {
  const entries = await fs.readdir(blogsDir);

  for (const entry of entries) {
    if (!entry.endsWith('.mdx')) continue;
    
    const fullPath = join(blogsDir, entry);
    const content = await fs.readFile(fullPath, 'utf-8');
    const parsed = await parseMdx(content);
    if (!parsed) continue;

    const { frontmatter, content: mdxContent } = parsed;
    const slug = entry.replace('.mdx', '');
    
    searchIndex.push({
      id: String(id++),
      url: `/blog/${slug}`,
      title: frontmatter.title || 'Untitled',
      content: mdxContent
    });
  }
}

generateSearchIndex(); 