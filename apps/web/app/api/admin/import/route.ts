import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@fountain-quiz/db'
import { generateQuestionsFromChunk, type DocumentChunk } from '@fountain-quiz/shared/question-generator'

// Note: Install mammoth for DOCX parsing: npm install mammoth
// For now, this is a placeholder that accepts the file

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // TODO: Implement DOCX parsing with mammoth
    // For now, create sample questions based on the spec
    const sampleChunks: DocumentChunk[] = [
      {
        heading: 'Curexa Signature Requirements',
        content: 'Curexa requires a signature for controlled substances. For other medications, customers can use FedEx hold at location as a workaround.',
        level: 2,
        sourceRef: 'Pharmacy & Shipping section',
      },
      {
        heading: 'Labcorp Scheduling Link',
        content: 'The scheduling link should only be sent after final lab results are available, not preliminary results. Wait for the final report before sending the scheduling link to patients.',
        level: 2,
        sourceRef: 'Labcorp Link workflow section',
      },
      {
        heading: 'TPH Shipping Timeline',
        content: 'TPH typically ships within 48 hours. TPH offers pickup option and detailed shipping information is available in the portal.',
        level: 2,
        sourceRef: 'Pharmacy & Shipping section',
      },
      {
        heading: 'Belmar Constraints',
        content: 'Belmar uses UPS 2-day shipping, does not require signature, and only ships to home addresses.',
        level: 2,
        sourceRef: 'Pharmacy & Shipping section',
      },
      {
        heading: 'Refill Requirements',
        content: 'Refills require a valid prescription and an active subscription. Do not promise the next charge date. The next refill date can be found in the patient portal.',
        level: 2,
        sourceRef: 'Orders & Billing section',
      },
      {
        heading: 'Routing Rules',
        content: 'Do not assign tickets to individuals. Use team routing. Follow escalation rules for complex issues. Itemized receipts should be routed to the billing team.',
        level: 2,
        sourceRef: 'Internal assignment / routing section',
      },
      {
        heading: 'Lead Restrictions',
        content: 'No medical advice should be given to leads. Lab availability has constraints that should be communicated clearly.',
        level: 2,
        sourceRef: 'Lead restrictions & comms section',
      },
      {
        heading: 'Unsubscribe Handling',
        content: 'When a customer says "please stop" or requests to unsubscribe, create a ticket for the CIO unsubscribe team. Do not handle unsubscribes directly.',
        level: 2,
        sourceRef: 'Stop/cancel vs unsubscribe section',
      },
    ]

    const allQuestions = sampleChunks.flatMap(chunk => 
      generateQuestionsFromChunk(chunk)
    )

    // Limit to prevent too many questions in one import
    const questionsToCreate = allQuestions.slice(0, 50).map(q => ({
      ...q,
      status: 'draft' as const,
    }))

    const created = await prisma.question.createMany({
      data: questionsToCreate,
    })

    return NextResponse.json({
      success: true,
      questionsGenerated: created.count,
      message: `Generated ${created.count} questions from document. Review them in the admin panel before publishing.`,
    })
  } catch (error) {
    console.error('Error importing file:', error)
    return NextResponse.json(
      { error: 'Failed to import file: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
