# CLAUDE.md - DI Guide Repository Guidelines

## Build/Run Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Development Process
- Blogs: Add MDX files to `/contents/blogs/` with frontmatter
- Documentation: Add MDX files to `/contents/docs/` following folder structure
- Content uses MDX with custom components for notes, code blocks, steppers, etc.

## Code Style Guidelines

### TypeScript
- Strict mode enabled (`strict: true` in tsconfig.json)
- Define explicit types for component props using interfaces
- Use React.forwardRef with proper HTML element types

### Component Structure
- Functional components with React hooks
- Props destructuring with default values
- PascalCase for component names and types
- camelCase for variables, functions, and instances

### Imports
- React/Next.js imports first
- External dependencies next
- Internal components and utilities last (`@/` path imports)

### Formatting
- Double quotes for strings and JSX attributes
- Semicolons at end of statements
- Self-closing tags when appropriate
- Use tailwind utility classes for styling