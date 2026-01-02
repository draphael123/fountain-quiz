'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Question {
  id: string
  prompt: string
  choices: string[]
  correctAnswer: string
  explanation: string
  tags: string[]
  difficulty: number
  status: string
  format: string
  sourceRef: string | null
}

export default function AdminReview() {
  const { data: session } = useSession()
  const [questions, setQuestions] = useState<Question[]>([])
  const [filter, setFilter] = useState({ status: 'draft', tag: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Question>>({})

  if (!session || (session.user as any)?.role !== 'admin') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Access denied. Admin only.</div>
      </main>
    )
  }

  useEffect(() => {
    loadQuestions()
  }, [filter])

  const loadQuestions = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        status: filter.status,
        ...(filter.tag && { tag: filter.tag }),
      })
      const response = await fetch(`/api/admin/questions?${params}`)
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      })

      if (response.ok) {
        loadQuestions()
      }
    } catch (error) {
      console.error('Error publishing question:', error)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    try {
      const response = await fetch(`/api/admin/questions/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        setEditingId(null)
        setEditForm({})
        loadQuestions()
      }
    } catch (error) {
      console.error('Error saving question:', error)
    }
  }

  const startEdit = (question: Question) => {
    setEditingId(question.id)
    setEditForm(question)
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Review Questions</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and approve questions before publishing
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="draft">Draft</option>
            <option value="reviewed">Reviewed</option>
            <option value="published">Published</option>
            <option value="retired">Retired</option>
          </select>

          <input
            type="text"
            placeholder="Filter by tag..."
            value={filter.tag}
            onChange={(e) => setFilter({ ...filter, tag: e.target.value })}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No questions found
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                {editingId === question.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Prompt
                      </label>
                      <textarea
                        value={editForm.prompt || ''}
                        onChange={(e) =>
                          setEditForm({ ...editForm, prompt: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Explanation
                      </label>
                      <textarea
                        value={editForm.explanation || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            explanation: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null)
                          setEditForm({})
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {question.prompt}
                        </h3>
                        {question.choices.length > 0 && (
                          <ul className="list-disc list-inside mb-2 text-gray-600 dark:text-gray-400">
                            {question.choices.map((choice, i) => (
                              <li key={i}>{choice}</li>
                            ))}
                          </ul>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <strong>Correct:</strong> {question.correctAnswer}
                        </p>
                        <p className="text-sm mb-2">{question.explanation}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {question.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          Format: {question.format} | Difficulty: {question.difficulty} | Source: {question.sourceRef || 'N/A'}
                        </p>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => startEdit(question)}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                        >
                          Edit
                        </button>
                        {question.status !== 'published' && (
                          <button
                            onClick={() => handlePublish(question.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                          >
                            Publish
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

