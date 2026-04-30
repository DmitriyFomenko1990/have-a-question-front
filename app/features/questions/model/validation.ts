import { z } from 'zod'

type Translate = (key: string) => string

export const createQuestionSchema = (t: Translate) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, t('questions.create.validation.titleRequired'))
      .max(255, t('questions.create.validation.titleMax')),
    description: z.string().trim(),
    choice_type: z.enum(['single', 'multiple'], {
      required_error: t('questions.create.validation.choiceTypeRequired'),
    }),
    allow_custom_answer: z.boolean(),
    options: z
      .array(
        z.object({
          text: z
            .string()
            .trim()
            .min(1, t('questions.create.validation.optionRequired'))
            .max(255, t('questions.create.validation.optionMax')),
        }),
      )
      .min(2, t('questions.create.validation.optionsMin')),
  })

export type CreateQuestionFormValues = z.infer<ReturnType<typeof createQuestionSchema>>
