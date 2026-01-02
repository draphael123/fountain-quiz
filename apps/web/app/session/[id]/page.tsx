'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface Question {
  id: string
  prompt: string
  choices: string[]
  format: string
}

export default function QuizSession() {
  const params = useParams()
  const router = useRouter()
  const attemptId = params.id as string

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Load quiz session
    fetch(`/api/quiz/session/${attemptId}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || [])
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Error loading quiz:', err)
        setIsLoading(false)
      })
  }, [attemptId])

  const handleSubmit = async () => {
    if (!selectedAnswer) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/quiz/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          questionId: questions[currentIndex].id,
          answer: selectedAnswer,
        }),
      })

      if (response.ok) {
        // Mark quiz as complete if this was the last question
        if (currentIndex >= questions.length - 1) {
          // Update attempt to mark as completed
          await fetch(`/api/quiz/complete/${attemptId}`, {
            method: 'POST',
          })
          router.push(`/results/${attemptId}`)
        } else {
          setCurrentIndex(currentIndex + 1)
          setSelectedAnswer('')
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading quiz...</div>
      </main>
    )
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-xl">No questions found</div>
      </main>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-6">{currentQuestion.prompt}</h2>

          {currentQuestion.format === 'multiple-choice' && (
            <div className="space-y-3">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(choice)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedAnswer === choice
                      ? 'bg-blue-50 dark:bg-blue-900 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.format === 'true-false' && (
            <div className="space-y-3">
              <button
                onClick={() => setSelectedAnswer('True')}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedAnswer === 'True'
                    ? 'bg-blue-50 dark:bg-blue-900 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-300'
                }`}
              >
                True
              </button>
              <button
                onClick={() => setSelectedAnswer('False')}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedAnswer === 'False'
                    ? 'bg-blue-50 dark:bg-blue-900 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-300'
                }`}
              >
                False
              </button>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || isSubmitting}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

