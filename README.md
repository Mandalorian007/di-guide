# Diablo Immortal Guide

A comprehensive guide and resource hub for Diablo Immortal players, built with Next.js and MDX.

## About

The Diablo Immortal Guide is a community-driven resource designed to help players navigate the world of Sanctuary on mobile and PC. Our goal is to provide up-to-date, accurate information on:

- Character builds and class guides
- Legendary items and set bonuses
- Dungeon and raid strategies
- PvP tactics and battleground tips
- Farming routes and efficiency guides
- Event calendars and rewards
- Game mechanics and hidden systems

## Features

- **Class Guides**: Detailed guides for all classes with recommended builds
- **Interactive Maps**: Explore Sanctuary with annotated maps and points of interest
- **Progression Guides**: Optimized paths for leveling and Paragon progression
- **Gear Calculator**: Plan your stats and compare different equipment options
- **Event Tracker**: Stay updated with current and upcoming events
- **Blog Section**: Latest news, patch notes, and meta analysis
- **Responsive Design**: Optimal viewing on both mobile and desktop
- **Fast Search**: Client-side search functionality for quickly finding content

## For Developers

### Getting Started

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd di-guide
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

### Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Content Structure

- **Blog posts**: Add MDX files to `/contents/blogs/` with proper frontmatter
- **Documentation**: Add MDX files to `/contents/docs/` following the folder structure
- **Images**: Store in `/public/` directory

### Contributing

Contributions are welcome! Please check our contribution guidelines before submitting PRs.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-guide`)
3. Commit your changes (`git commit -m 'Add amazing guide'`)
4. Push to the branch (`git push origin feature/amazing-guide`)
5. **IMPORTANT**: Always run `pnpm lint` before submitting your PR
6. Open a Pull Request

## Deployment

This site is deployed on [Vercel](https://vercel.com). All accepted pull requests to the main branch are automatically deployed to production.

**Note**: Since merged PRs automatically go live, please ensure your contributions are thoroughly tested and linted before submission.

## License

This project is licensed under the MIT License - see the LICENSE file for details.