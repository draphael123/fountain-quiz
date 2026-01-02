import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@fountain-quiz/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: params.id },
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Quiz attempt not found' },
        { status: 404 }
      )
    }

    await prisma.quizAttempt.update({
      where: { id: params.id },
      data: {
        completedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing quiz:', error)
    return NextResponse.json(
      { error: 'Failed to complete quiz' },
      { status: 500 }
    )
  }
}

