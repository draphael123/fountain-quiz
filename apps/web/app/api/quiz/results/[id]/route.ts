import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@fountain-quiz/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: params.id },
      include: {
        attemptItems: {
          include: {
            question: {
              select: {
                prompt: true,
                explanation: true,
              },
            },
          },
          orderBy: {
            answeredAt: 'asc',
          },
        },
      },
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Quiz attempt not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        score: attempt.score,
        mode: attempt.mode,
        completedAt: attempt.completedAt,
      },
      items: attempt.attemptItems.map(item => ({
        id: item.id,
        question: {
          prompt: item.question.prompt,
          explanation: item.question.explanation,
        },
        userAnswer: item.userAnswer,
        correct: item.correct,
      })),
    })
  } catch (error) {
    console.error('Error loading results:', error)
    return NextResponse.json(
      { error: 'Failed to load results' },
      { status: 500 }
    )
  }
}

