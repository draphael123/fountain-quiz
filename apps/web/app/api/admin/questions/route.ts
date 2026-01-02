import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@fountain-quiz/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'draft'
    const tag = searchParams.get('tag')

    const where: any = {
      status,
    }

    if (tag) {
      where.tags = {
        has: tag,
      }
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

