// for page navigation & to sort on leftbar

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true; // noLink will create a route segment (section) but cannot be navigated
  items?: EachRoute[];
  tag?: string;
};

export const ROUTES: EachRoute[] = [
  {
    title: "Guides",
    href: "/guides",
    noLink: true,
    items: [
      { title: "Introduction", href: "/introduction" },
      {
        title: "Contribution Guide",
        href: "/contribution-guide",
      },
      {
        title: "Supported Controllers",
        href: "/controllers",
      },
      {
        title: "Warband Guide",
        href: "/warbands",
      },
      {
        title: "5-Star Gem Internal Sockets",
        href: "/internal-gems",
      },
      {
        title: "Reforging Guide",
        href: "/reforging",
      },
      {
        title: "Normal Gems Guide",
        href: "/normal-gems",
      },
      {
        title: "Stats Guide",
        href: "/stats",
      },
      {
        title: "Familiar Setup Guide",
        href: "/familiar-setup",
      },
      {
        title: "Legendary Gems Guide",
        href: "/legendary-gems",
      },
    ],
  },
  {
    title: "Class Builds",
    href: "/class-builds",
    noLink: true,
    items: [
      { title: "Overview", href: "/overview" },
    ],
  },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
