"use client";

import { ROUTES } from "@/lib/routes-config";
import SubLink from "./sublink";
import { usePathname } from "next/navigation";

export default function DocsMenu({ isSheet = false }) {
  const pathname = usePathname();
  // Remove the condition that prevents the menu from showing
  // when not on a docs page
  
  return (
    <div className="flex flex-col gap-3.5 mt-5 pr-2 pb-6 sm:text-base text-[14.5px]">
      {ROUTES.map((item, index) => {
        const modifiedItems = {
          ...item,
          href: `/docs${item.href}`,
          level: 0,
          isSheet,
          // Pass the current path to help with expand/collapse logic
          currentPath: pathname,
        };
        return <SubLink key={item.title + index} {...modifiedItems} />;
      })}
    </div>
  );
}
