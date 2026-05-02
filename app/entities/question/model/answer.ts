import type { ApiQuestionListItem } from '@/shared/api/types'

type QuestionAnsweredState = {
  hasAnswered: boolean
  optionIds: number[]
  customText: string
}

const parseAnsweredOptionId = (answeredOption: unknown) => {
  if (typeof answeredOption === 'object' && answeredOption && 'id' in answeredOption) {
    const id = Number(answeredOption.id)

    return Number.isFinite(id) ? id : null
  }

  const id = Number(answeredOption)

  return Number.isFinite(id) ? id : null
}

const parseAnsweredOptionIds = (answeredOptions: unknown[]) =>
  answeredOptions.reduce<number[]>((optionIds, answeredOption) => {
    const id = parseAnsweredOptionId(answeredOption)

    if (id !== null) {
      optionIds.push(id)
    }

    return optionIds
  }, [])

const parseAnsweredOptions = (answeredOptions: unknown) => {
  if (Array.isArray(answeredOptions)) {
    return parseAnsweredOptionIds(answeredOptions)
  }

  if (typeof answeredOptions !== 'string') {
    return []
  }

  const trimmedOptions = answeredOptions.trim()

  if (!trimmedOptions) {
    return []
  }

  try {
    const parsedOptions: unknown = JSON.parse(trimmedOptions)

    if (Array.isArray(parsedOptions)) {
      return parseAnsweredOptionIds(parsedOptions)
    }
  } catch {
    return parseAnsweredOptionIds(trimmedOptions.split(','))
  }

  return []
}

export const getQuestionAnsweredState = (question: ApiQuestionListItem): QuestionAnsweredState => ({
  hasAnswered: Boolean(question.has_answered),
  optionIds: parseAnsweredOptions(question.answered_options),
  customText: question.answered_custom_text || '',
})
