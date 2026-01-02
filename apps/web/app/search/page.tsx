'use client'

import { useState } from 'react'

interface SearchResult {
  id: string
  prompt: string
  explanation: string
  tags: string[]
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Search Knowledge Base</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find answers to your questions about Fountain workflows and SOPs
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for answers..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </h2>
            {results.map((result) => (
              <div
                key={result.id}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-semibold mb-2">{result.prompt}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {result.explanation}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {query && results.length === 0 && !isSearching && (
          <div className="text-center py-12 text-gray-500">
            No results found. Try a different search term.
          </div>
        )}
      </div>
    </main>
  )
}

