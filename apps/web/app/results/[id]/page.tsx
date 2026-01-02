'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Result {
  attempt: {
    id: string
    score: number
    mode: string
    completedAt: string | null
  }
  items: Array<{
    id: string
    question: {
      prompt: string
      explanation: string
    }
    userAnswer: string
    correct: boolean
  }>
}

export default function Results() {
  const params = useParams()
  const attemptId = params.id as string
  const [result, setResult] = useState<Result | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/quiz/results/${attemptId}`)
      .then(res => res.json())
      .then(data => {
        setResult(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Error loading results:', err)
        setIsLoading(false)
      })
  }, [attemptId])

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading results...</div>
      </main>
    )
  }

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Results not found</div>
      </main>
    )
  }

  const scorePercentage = Math.round(result.attempt.score)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Quiz Results</h1>
          <div className="text-6xl font-bold text-blue-500 mb-2">
            {scorePercentage}%
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            You got {result.items.filter(item => item.correct).length} out of {result.items.length} questions correct
          </p>
        </div>

        <div className="space-y-4">
          {result.items.map((item, index) => (
            <div
              key={item.id}
              className={`p-6 rounded-lg border ${
                item.correct
                  ? 'bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700'
                  : 'bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold">Question {index + 1}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    item.correct
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {item.correct ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <p className="mb-2">{item.question.prompt}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Your answer: <strong>{item.userAnswer}</strong>
              </p>
              <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium mb-1">Explanation:</p>
                <p className="text-sm">{item.question.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/quiz"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Take Another Quiz
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  )
}

