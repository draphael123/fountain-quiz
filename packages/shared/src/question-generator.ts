/**
 * Question generation utilities
 * This module provides functions to generate questions from document content
 */

export interface DocumentChunk {
  heading: string
  content: string
  level: number
  sourceRef: string
}

export interface GeneratedQuestion {
  prompt: string
  choices: string[]
  correctAnswer: string
  explanation: string
  tags: string[]
  difficulty: number
  format: 'multiple-choice' | 'scenario' | 'true-false' | 'fill-blank'
  sourceRef: string
}

/**
 * Extract tags from content based on keywords
 */
export function extractTags(content: string, heading: string): string[] {
  const tags: string[] = []
  const lowerContent = content.toLowerCase()
  const lowerHeading = heading.toLowerCase()

  // Lab-related tags
  if (lowerContent.includes('labcorp') || lowerHeading.includes('labcorp')) {
    tags.push('labcorp-link')
  }
  if (lowerContent.includes('lab') || lowerHeading.includes('lab')) {
    tags.push('labs')
  }
  if (lowerContent.includes('scheduling') || lowerHeading.includes('scheduling')) {
    tags.push('lab-scheduling')
  }

  // Pharmacy tags
  if (lowerContent.includes('curexa')) {
    tags.push('pharmacy-curexa')
  }
  if (lowerContent.includes('tph') || lowerContent.includes('therapeutic')) {
    tags.push('pharmacy-tph')
  }
  if (lowerContent.includes('belmar')) {
    tags.push('pharmacy-belmar')
  }
  if (lowerContent.includes('pharmacy') || lowerContent.includes('pharmacies')) {
    tags.push('pharmacies')
  }
  if (lowerContent.includes('shipping') || lowerContent.includes('ship')) {
    tags.push('shipping')
  }

  // Billing/Orders
  if (lowerContent.includes('refill') || lowerContent.includes('refills')) {
    tags.push('refills')
  }
  if (lowerContent.includes('billing') || lowerContent.includes('order')) {
    tags.push('orders-billing')
  }

  // Routing
  if (lowerContent.includes('routing') || lowerContent.includes('assign')) {
    tags.push('routing')
  }
  if (lowerContent.includes('escalat') || lowerContent.includes('escalation')) {
    tags.push('escalations')
  }

  // Other tags
  if (lowerContent.includes('lead') || lowerHeading.includes('lead')) {
    tags.push('leads')
  }
  if (lowerContent.includes('unsubscribe') || lowerContent.includes('stop') || lowerContent.includes('cancel')) {
    tags.push('unsubscribe')
  }
  if (lowerContent.includes('hrt') || lowerHeading.includes('hrt')) {
    tags.push('hrt-faqs')
  }
  if (lowerContent.includes('glp') || lowerContent.includes('semaglutide') || lowerContent.includes('ozempic')) {
    tags.push('glp-faqs')
  }

  return [...new Set(tags)] // Remove duplicates
}

/**
 * Estimate difficulty based on content complexity
 */
export function estimateDifficulty(content: string): number {
  const sentences = content.split(/[.!?]+/).length
  const words = content.split(/\s+/).length
  const hasNumbers = /\d+/.test(content)
  const hasComplexTerms = /(preliminary|final|requirement|constraint|escalation)/i.test(content)

  let difficulty = 2 // Base difficulty

  if (words > 50) difficulty += 1
  if (hasNumbers) difficulty += 0.5
  if (hasComplexTerms) difficulty += 1
  if (sentences > 5) difficulty += 0.5

  return Math.min(5, Math.max(1, Math.round(difficulty)))
}

/**
 * Generate multiple choice question from a fact
 */
export function generateMCQ(
  fact: string,
  context: string,
  tags: string[],
  sourceRef: string
): GeneratedQuestion {
  const difficulty = estimateDifficulty(fact + ' ' + context)

  // Simple pattern matching to extract key information
  // In production, use AI (OpenAI) for better generation
  const prompt = `Which of the following is true about ${fact.split('.')[0]}?`

  // Generate plausible wrong answers (simplified - use AI in production)
  const choices = [
    fact.split('.')[0] + ' (correct)',
    'Opposite of the fact',
    'Related but incorrect detail',
    'Another incorrect option',
  ]

  return {
    prompt,
    choices,
    correctAnswer: fact.split('.')[0],
    explanation: context || fact,
    tags,
    difficulty,
    format: 'multiple-choice',
    sourceRef,
  }
}

/**
 * Generate scenario question
 */
export function generateScenario(
  fact: string,
  context: string,
  tags: string[],
  sourceRef: string
): GeneratedQuestion {
  const difficulty = estimateDifficulty(fact + ' ' + context)

  return {
    prompt: `Scenario: ${context}\n\nWhat is the best next step?`,
    choices: [
      fact.split('.')[0],
      'Alternative action 1',
      'Alternative action 2',
      'Alternative action 3',
    ],
    correctAnswer: fact.split('.')[0],
    explanation: context || fact,
    tags,
    difficulty,
    format: 'scenario',
    sourceRef,
  }
}

/**
 * Generate true/false question
 */
export function generateTrueFalse(
  fact: string,
  context: string,
  tags: string[],
  sourceRef: string
): GeneratedQuestion {
  const difficulty = estimateDifficulty(fact)

  // Determine if fact is positive (true) or negative (false)
  const isPositive = !/(not|no|never|cannot|shouldn't|don't)/i.test(fact)

  return {
    prompt: fact,
    choices: [],
    correctAnswer: isPositive ? 'True' : 'False',
    explanation: context || fact,
    tags,
    difficulty,
    format: 'true-false',
    sourceRef,
  }
}

/**
 * Generate fill-in-the-blank question
 */
export function generateFillBlank(
  fact: string,
  context: string,
  tags: string[],
  sourceRef: string
): GeneratedQuestion {
  const difficulty = estimateDifficulty(fact)

  // Extract key term (simplified)
  const keyTerms = fact.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g) || []
  const keyTerm = keyTerms[0] || 'answer'

  const prompt = fact.replace(keyTerm, '____')

  return {
    prompt,
    choices: [],
    correctAnswer: keyTerm,
    explanation: context || fact,
    tags,
    difficulty,
    format: 'fill-blank',
    sourceRef,
  }
}

/**
 * Generate all question variants from a document chunk
 */
export function generateQuestionsFromChunk(chunk: DocumentChunk): GeneratedQuestion[] {
  const tags = extractTags(chunk.content, chunk.heading)
  const facts = chunk.content.split(/[.!?]+/).filter(f => f.trim().length > 20)

  const questions: GeneratedQuestion[] = []

  facts.forEach((fact, index) => {
    if (fact.trim().length < 20) return

    // Generate different question types
    questions.push(generateMCQ(fact, chunk.content, tags, chunk.sourceRef))
    
    if (index % 3 === 0) {
      questions.push(generateScenario(fact, chunk.content, tags, chunk.sourceRef))
    }
    
    if (index % 4 === 0) {
      questions.push(generateTrueFalse(fact, chunk.content, tags, chunk.sourceRef))
    }
    
    if (index % 5 === 0) {
      questions.push(generateFillBlank(fact, chunk.content, tags, chunk.sourceRef))
    }
  })

  return questions
}

