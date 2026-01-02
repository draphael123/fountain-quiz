'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function QuizSetup() {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<number>(3)
  const [length, setLength] = useState<number>(10)
  const [mode, setMode] = useState<'quiz' | 'practice'>('quiz')

  const availableTags = [
    'labs',
    'labcorp-link',
    'lab-scheduling',
    'orders-billing',
    'refills',
    'pharmacies',
    'shipping',
    'pharmacy-tph',
    'pharmacy-curexa',
    'pharmacy-belmar',
    'routing',
    'escalations',
    'leads',
    'unsubscribe',
    'hrt-faqs',
    'glp-faqs',
  ]

  const toggleTag = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const startQuiz = async () => {
    const response = await fetch('/api/quiz/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tags: tags.length > 0 ? tags : undefined,
        difficulty,
        length,
        mode,
      }),
    })

    if (response.ok) {
      const { attemptId } = await response.json()
      router.push(`/session/${attemptId}`)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Quiz Setup</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your quiz experience
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Topics (optional - leave empty for all topics)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    tags.includes(tag)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Difficulty: {difficulty}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Very Easy</span>
              <span>Very Hard</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Questions: {length}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="quiz"
                  checked={mode === 'quiz'}
                  onChange={(e) => setMode(e.target.value as 'quiz')}
                  className="mr-2"
                />
                Quiz (scored)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="practice"
                  checked={mode === 'practice'}
                  onChange={(e) => setMode(e.target.value as 'practice')}
                  className="mr-2"
                />
                Practice (no score)
              </label>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </main>
  )
}

