export const QUESTION_TAGS = {
  LABS: 'labs',
  LABCORP_LINK: 'labcorp-link',
  LAB_SCHEDULING: 'lab-scheduling',
  ORDERS_BILLING: 'orders-billing',
  REFILLS: 'refills',
  PHARMACIES: 'pharmacies',
  SHIPPING: 'shipping',
  PHARMACY_TPH: 'pharmacy-tph',
  PHARMACY_CUREXA: 'pharmacy-curexa',
  PHARMACY_BELMAR: 'pharmacy-belmar',
  ROUTING: 'routing',
  ESCALATIONS: 'escalations',
  LEADS: 'leads',
  UNSUBSCRIBE: 'unsubscribe',
  HRT_FAQS: 'hrt-faqs',
  GLP_FAQS: 'glp-faqs',
} as const;

export const QUESTION_FORMATS = {
  MULTIPLE_CHOICE: 'multiple-choice',
  SCENARIO: 'scenario',
  TRUE_FALSE: 'true-false',
  FILL_BLANK: 'fill-blank',
} as const;

export const DIFFICULTY_LEVELS = {
  VERY_EASY: 1,
  EASY: 2,
  MEDIUM: 3,
  HARD: 4,
  VERY_HARD: 5,
} as const;

