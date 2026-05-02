<script setup lang="ts">
import { getQuestionAnsweredState } from '@/entities/question/model/answer'
import QuestionOptionsSelect from '@/entities/question/ui/QuestionOptionsSelect.vue'
import { questionsApi } from '@/shared/api/questions/questions.api'
import type { ApiQuestionListItem, ApiQuestionRespondPayload } from '@/shared/api/types'

const props = defineProps<{
  question: ApiQuestionListItem
}>()

const { t } = useI18n()
const answeredState = getQuestionAnsweredState(props.question)
const selectedOptionIds = ref<number[]>(answeredState.optionIds)
const customAnswerText = ref(answeredState.customText)
const validationError = ref<string | null>(null)
const submitError = ref<string | null>(null)
const isSubmitted = ref(false)
const isSubmitting = ref(false)

const hasAnswered = computed(() => answeredState.hasAnswered || isSubmitted.value)
const hasCustomAnswerText = computed(() => customAnswerText.value.trim().length > 0)

const clearMessages = () => {
  validationError.value = null
  submitError.value = null
  isSubmitted.value = false
}

const onSubmit = async () => {
  clearMessages()

  if (selectedOptionIds.value.length === 0 && !hasCustomAnswerText.value) {
    validationError.value = props.question.allow_custom_answer
      ? t('questions.card.validation.selectOptionOrCustomAnswer')
      : t('questions.card.validation.selectOption')

    return
  }

  const payload: ApiQuestionRespondPayload = {
    option_ids: selectedOptionIds.value,
  }

  if (hasCustomAnswerText.value) {
    payload.custom_answer_text = customAnswerText.value.trim()
  }

  isSubmitting.value = true

  try {
    await questionsApi.respond(props.question.id, payload)
    isSubmitted.value = true
  } catch {
    submitError.value = t('questions.card.errors.submit')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form
    class="mt-5"
    @submit.prevent="onSubmit"
  >
    <QuestionOptionsSelect
      v-model="selectedOptionIds"
      :choice-type="question.choice_type"
      :disabled="hasAnswered"
      :name="`question-${question.id}`"
      :options="question.options"
    />

    <BaseField
      v-if="question.allow_custom_answer"
      class="mt-4"
      :label="$t('questions.card.customAnswerLabel')"
    >
      <BaseInput
        v-model="customAnswerText"
        :disabled="hasAnswered"
        :placeholder="$t('questions.card.customAnswerPlaceholder')"
      />
    </BaseField>

    <p
      v-if="answeredState.hasAnswered"
      class="mt-4 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
    >
      {{ $t('questions.card.answered') }}
    </p>

    <p
      v-if="validationError"
      class="mt-3 text-xs text-red-500"
    >
      {{ validationError }}
    </p>

    <BaseFormError v-if="submitError" class="mt-4">
      {{ submitError }}
    </BaseFormError>

    <p
      v-if="isSubmitted"
      class="mt-4 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
    >
      {{ $t('questions.card.success') }}
    </p>

    <BaseButton
      v-if="!hasAnswered"
      class="mt-4 w-full sm:w-auto"
      :disabled="isSubmitting"
      type="submit"
    >
      {{ isSubmitting ? $t('questions.card.pendingSubmit') : $t('questions.card.submit') }}
    </BaseButton>
  </form>
</template>
