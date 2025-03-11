"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';

// Define types for Pagefind
interface PagefindResult {
  url: string;
  meta: {
    title: string;
  };
  excerpt: string;
}

interface PagefindInstance {
  search: (query: string) => Promise<{
    results: Array<{
      data: () => Promise<PagefindResult>;
    }>;
  }>;
}

declare global {
  interface Window {
    pagefind?: PagefindInstance;
  }
}

export default function PagefindSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Pagefind
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = '/pagefind/pagefind.js';
    script.onload = () => {
      if (window.pagefind) {
        setIsInitialized(true);
        setError(null);
      } else {
        setError('Failed to initialize search');
      }
    };
    script.onerror = () => {
      setError('Failed to load search functionality');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!window.pagefind) return;
    
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const search = await window.pagefind.search(searchQuery);
      const searchResults = await Promise.all(
        search.results.slice(0, 8).map(result => result.data())
      );
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (!isInitialized) return;
    
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isInitialized, performSearch]);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 text-base text-gray-500 border rounded-lg hover:border-gray-400 hover:text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-500 dark:hover:text-gray-300 min-w-[140px]"
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-0 sm:absolute sm:inset-auto sm:right-0 sm:top-full">
          <div className="fixed inset-0 bg-black/20 sm:hidden" onClick={() => setIsOpen(false)} />
          <div className="relative z-50 w-full max-h-[80vh] sm:mt-2 overflow-hidden bg-white border rounded-lg shadow-lg sm:w-screen sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center p-3 border-b dark:border-gray-700">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full px-4 py-2.5 text-base text-gray-900 bg-transparent border-none focus:outline-none dark:text-gray-100"
                autoFocus
                disabled={!isInitialized || !!error}
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {error ? (
                <div className="p-4 text-center text-red-500">
                  <p>{error}</p>
                  <button 
                    className="mt-2 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    onClick={() => window.location.reload()}
                  >
                    Reload Page
                  </button>
                </div>
              ) : !isInitialized ? (
                <div className="flex flex-col items-center justify-center p-4 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <p className="text-sm text-gray-500">Loading search functionality...</p>
                </div>
              ) : isLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <Link
                      key={index}
                      href={result.url}
                      onClick={() => setIsOpen(false)}
                      className="block p-2.5 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {result.meta.title || 'Untitled'}
                      </h3>
                      <p 
                        className="mt-1 text-sm text-gray-600 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: result.excerpt }}
                      />
                    </Link>
                  ))}
                </div>
              ) : query ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}   