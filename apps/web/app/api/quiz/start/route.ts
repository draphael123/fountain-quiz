import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@fountain-quiz/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { tags, difficulty, length = 10, mode = 'quiz' } = body

    // Get user from session or use default
    const userId = session?.user ? (session.user as any).id : 'default-user-id'

    // Build query filters
    const where: any = {
      status: 'published',
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      }
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    // Get questions with some randomization
    const allQuestions = await prisma.question.findMany({
      where,
    })

    if (allQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found matching your criteria' },
        { status: 404 }
      )
    }

    // Shuffle and take requested number
    const shuffled = allQuestions.sort(() => 0.5 - Math.random())
    const questions = shuffled.slice(0, Math.min(length, shuffled.length))

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        mode,
        tagsFilter: tags || [],
        score: 0,
      },
    })

    return NextResponse.json({
      attemptId: attempt.id,
      questions: questions.map(q => ({
        id: q.id,
        prompt: q.prompt,
        choices: q.choices,
        format: q.format,
      })),
    })
  } catch (error) {
    console.error('Error starting quiz:', error)
    return NextResponse.json(
      { error: 'Failed to start quiz' },
      { status: 500 }
    )
  }
}
