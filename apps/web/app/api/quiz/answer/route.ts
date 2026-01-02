import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@fountain-quiz/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { attemptId, questionId, answer } = body

    // Get question and attempt
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        attemptItems: true,
      },
    })

    if (!question || !attempt) {
      return NextResponse.json(
        { error: 'Question or attempt not found' },
        { status: 404 }
      )
    }

    // Check if answer is correct
    const isCorrect = answer.trim() === question.correctAnswer.trim()

    // Create attempt item
    await prisma.attemptItem.create({
      data: {
        attemptId,
        questionId,
        userAnswer: answer,
        correct: isCorrect,
      },
    })

    // Update attempt score
    const totalAnswered = attempt.attemptItems.length + 1
    const correctCount = attempt.attemptItems.filter(item => item.correct).length + (isCorrect ? 1 : 0)
    const newScore = (correctCount / totalAnswered) * 100

    // Get total questions for this attempt (you may want to store this in the attempt)
    // For now, we'll check completion when score is calculated
    const updateData: any = {
      score: newScore,
    }

    // Note: In a real implementation, you'd track total questions in the attempt
    // For now, completion is handled client-side when all questions are answered

    await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: updateData,
    })

    return NextResponse.json({
      correct: isCorrect,
      explanation: question.explanation,
    })
  } catch (error) {
    console.error('Error submitting answer:', error)
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    )
  }
}

