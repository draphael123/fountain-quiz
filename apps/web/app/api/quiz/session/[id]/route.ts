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
            question: true,
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

    // Get unanswered questions
    const answeredQuestionIds = attempt.attemptItems.map(item => item.questionId)
    
    const unansweredQuestions = await prisma.question.findMany({
      where: {
        id: {
          notIn: answeredQuestionIds,
        },
        status: 'published',
        ...(attempt.tagsFilter.length > 0 && {
          tags: {
            hasSome: attempt.tagsFilter,
          },
        }),
      },
      take: 50,
    })

    return NextResponse.json({
      attempt,
      questions: unansweredQuestions.map(q => ({
        id: q.id,
        prompt: q.prompt,
        choices: q.choices,
        format: q.format,
      })),
    })
  } catch (error) {
    console.error('Error loading quiz session:', error)
    return NextResponse.json(
      { error: 'Failed to load quiz session' },
      { status: 500 }
    )
  }
}

