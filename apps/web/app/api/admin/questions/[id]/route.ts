import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { prisma } from '@fountain-quiz/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()

    const question = await prisma.question.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json({ question })
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    )
  }
}

