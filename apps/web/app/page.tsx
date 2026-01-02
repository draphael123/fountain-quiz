import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Fountain Quiz</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Learn & retain SOP/workflow knowledge through quizzes and scenario practice
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Link
            href="/quiz"
            className="p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Start Quiz</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Take a quiz to test your knowledge on Fountain workflows and SOPs
            </p>
          </Link>

          <Link
            href="/search"
            className="p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Search Knowledge</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Quickly find answers to your questions
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}

