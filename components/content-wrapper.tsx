"use client";

import React from "react";

interface ContentWrapperProps {
  children: React.ReactNode;
  contentType: "docs" | "blog";
  title: string;
  description: string;
  className?: string;
  classList?: string[]; // For class-based content like Barbarian, Crusader, etc.
}

/**
 * Wrapper component for content that adds data attributes for Pagefind indexing
 */
export default function ContentWrapper({
  children,
  contentType,
  title,
  description,
  className = "",
  classList = [],
}: ContentWrapperProps) {
  return (
    <article 
      className={className}
      // These data attributes are used by Pagefind for indexing
      data-pagefind-body
      data-content-type={contentType}
      data-class={classList.join(",")}
      data-pagefind-meta-title={title}
      data-pagefind-meta-description={description}
    >
      {/* Only render this h1 for screen readers and Pagefind indexing */}
      <h1 className="sr-only" data-pagefind-weight="10">{title}</h1>
      {children}
    </article>
  );
} 