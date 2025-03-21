"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, XCircle } from 'lucide-react';
import Link from 'next/link';
import FlexSearch from 'flexsearch';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
}

interface SearchDocument {
  id: string;
  title: string;
  content: string;
  url: string;
}

// Workaround for FlexSearch types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlexSearchDocumentType = any;

export default function FlexSearchComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchIndex = useRef<FlexSearchDocumentType>(null);

  useEffect(() => {
    // Initialize FlexSearch index
    searchIndex.current = new FlexSearch.Document({
      document: {
        id: 'id',
        index: [
          {
            field: 'title',
            tokenize: 'full',
            optimize: true,
            resolution: 9
          },
          {
            field: 'content',
            tokenize: 'full',
            optimize: true,
            resolution: 9
          }
        ],
        store: ['title', 'content', 'url']
      }
    });

    // Load and index the content
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/search-index.json');
        const data = await response.json();
        
        console.log('Loading search index documents:', data);
        
        // Add documents to the index with explicit field indexing
        data.forEach((doc: SearchDocument, index: number) => {
          const docId = String(index + 1);
          searchIndex.current?.add({
            id: docId,
            title: doc.title,
            content: doc.content,
            url: doc.url
          });
        });
        
        console.log('Search index initialized with', data.length, 'documents');
      } catch (error) {
        console.error('Failed to load search index:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchIndex.current || !searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      // Normalize the search query
      const normalizedQuery = searchQuery.toLowerCase().trim();
      console.log('Search query:', normalizedQuery);

      // Search in both title and content with different configurations
      const results = await Promise.all([
        searchIndex.current.search({
          query: normalizedQuery,
          field: 'title',
          limit: 15,
          suggest: true
        }),
        searchIndex.current.search({
          query: normalizedQuery,
          field: 'content',
          limit: 15,
          suggest: true
        })
      ]);

      console.log('Raw search results:', results);

      // Process and deduplicate results
      const processResults = (searchResults: unknown[]) => {
        if (!Array.isArray(searchResults)) return [];
        
        return searchResults.flatMap(result => {
          if (!result || typeof result !== 'object') return [];
          
          // Handle the FlexSearch result format
          if ('result' in result) {
            const searchResult = result as { result: Array<{ doc: SearchDocument; id: string }> };
            return searchResult.result.map(doc => ({
              id: doc.id,
              title: doc.doc?.title || 'Untitled',
              content: doc.doc?.content || '',
              url: doc.doc?.url || '#'
            }));
          }
          return [];
        });
      };

      // Combine and process all results
      const allResults = results.flatMap(r => processResults([r]));

      // Only proceed with deduplication if we have results
      if (allResults.length === 0) {
        setResults([]);
        return;
      }

      // Deduplicate by URL instead of ID to better handle multiple matches
      const uniqueResults = Array.from(
        new Map(allResults.map(item => [item.url, item])).values()
      ).slice(0, 20);

      console.log('Processed results:', uniqueResults);
      setResults(uniqueResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 text-base text-gray-500 border rounded-lg hover:border-gray-400 hover:text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-500 dark:hover:text-gray-300 min-w-[140px]"
        disabled={isLoading}
      >
        <Search className="w-5 h-5" />
        <span>{isLoading ? 'Loading...' : 'Search'}</span>
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
                onChange={(e) => {
                  setQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="Search documentation..."
                className="w-full px-4 py-2.5 text-base text-gray-900 bg-transparent border-none focus:outline-none dark:text-gray-100"
                autoFocus
                disabled={isLoading}
              />
              {query && (
                <button 
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                  }} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Loading search index...
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      className="block p-2.5 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {result.title || 'Untitled'}
                      </h3>
                      {result.content && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {result.content.length > 150 
                            ? `${result.content.substring(0, 150)}...` 
                            : result.content}
                        </p>
                      )}
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