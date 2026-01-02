import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@fountain-quiz/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    // Simple text search - in production, consider using full-text search
    const questions = await prisma.question.findMany({
      where: {
        status: 'published',
        OR: [
          {
            prompt: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            explanation: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            tags: {
              has: query.toLowerCase(),
            },
          },
        ],
      },
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      results: questions.map(q => ({
        id: q.id,
        prompt: q.prompt,
        explanation: q.explanation,
        tags: q.tags,
      })),
    })
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    )
  }
}

