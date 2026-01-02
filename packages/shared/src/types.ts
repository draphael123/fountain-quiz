export type QuestionFormat = 'multiple-choice' | 'scenario' | 'true-false' | 'fill-blank';
export type QuestionStatus = 'draft' | 'reviewed' | 'published' | 'retired';
export type QuizMode = 'quiz' | 'quick-quiz' | 'practice';

export interface QuizConfig {
  tags?: string[];
  difficulty?: number;
  length?: number;
  mode?: QuizMode;
}

export interface QuestionWithStats extends {
  id: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  tags: string[];
  difficulty: number;
  format: QuestionFormat;
  sourceRef?: string | null;
} {
  timesAnswered?: number;
  timesCorrect?: number;
  averageTimeSpent?: number;
}

