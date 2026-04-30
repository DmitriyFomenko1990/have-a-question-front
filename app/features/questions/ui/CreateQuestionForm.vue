<script setup lang="ts">
import type { ZodIssue } from 'zod'
import { createQuestionSchema, type CreateQuestionFormValues } from '@/features/questions/model/validation'
import QuestionOptionsField from '@/features/questions/ui/QuestionOptionsField.vue'
import { questionsApi } from '@/shared/api/questions/questions.api'
import type { ApiQuestionCreatePayload } from '@/shared/api/types'

type CreateQuestionFormErrors = Partial<Record<keyof CreateQuestionFormValues, string>>

const emit = defineEmits<{
  success: []
}>()

const { t } = useI18n()

const form = reactive<CreateQuestionFormValues>({
  title: '',
  description: '',
  choice_type: 'single',
  allow_custom_answer: false,
  options: [
    {
      text: '',
    },
    {
      text: '',
    },
  ],
})

const errors = ref<CreateQuestionFormErrors>({})
const optionErrors = ref<Record<number, string>>({})
const submitError = ref<string | null>(null)
const isSubmitting = ref(false)

const choiceTypeOptions = computed(() => [
  {
    label: t('questions.create.form.choiceTypeSingle'),
    value: 'single',
  },
  {
    label: t('questions.create.form.choiceTypeMultiple'),
    value: 'multiple',
  },
])

const clearErrors = () => {
  errors.value = {}
  optionErrors.value = {}
  submitError.value = null
}

const applyValidationErrors = (issues: ZodIssue[]) => {
  const nextErrors: CreateQuestionFormErrors = {}
  const nextOptionErrors: Record<number, string> = {}

  issues.forEach((issue) => {
    const [field, index] = issue.path

    if (field === 'options' && typeof index === 'number') {
      nextOptionErrors[index] = issue.message

      return
    }

    if (typeof field === 'string') {
      nextErrors[field as keyof CreateQuestionFormValues] = issue.message
    }
  })

  errors.value = nextErrors
  optionErrors.value = nextOptionErrors
}

const onSubmit = async () => {
  clearErrors()

  const result = createQuestionSchema(t).safeParse(form)

  if (!result.success) {
    applyValidationErrors(result.error.issues)

    return
  }

  const payload: ApiQuestionCreatePayload = {
    title: result.data.title,
    choice_type: result.data.choice_type,
    allow_custom_answer: result.data.allow_custom_answer,
    options: result.data.options,
  }

  if (result.data.description) {
    payload.description = result.data.description
  }

  isSubmitting.value = true

  try {
    await questionsApi.create(payload)
    emit('success')
  } catch {
    submitError.value = t('questions.create.errors.submit')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form
    class="space-y-6"
    @submit.prevent="onSubmit"
  >
    <BaseField
      :error="errors.title"
      :label="$t('questions.create.form.titleLabel')"
    >
      <BaseInput
        v-model="form.title"
        :placeholder="$t('questions.create.form.titlePlaceholder')"
      />
    </BaseField>

    <BaseField
      :error="errors.description"
      :label="$t('questions.create.form.descriptionLabel')"
    >
      <BaseTextarea
        v-model="form.description"
        :placeholder="$t('questions.create.form.descriptionPlaceholder')"
      />
    </BaseField>

    <BaseField
      :error="errors.choice_type"
      :label="$t('questions.create.form.choiceTypeLabel')"
    >
      <div class="grid gap-3 sm:grid-cols-2">
        <BaseRadioCard
          v-for="option in choiceTypeOptions"
          :key="option.value"
          v-model="form.choice_type"
          :label="option.label"
          name="choice_type"
          :value="option.value"
        />
      </div>
    </BaseField>

    <QuestionOptionsField
      v-model="form.options"
      :error="errors.options"
      :option-errors="optionErrors"
    />

    <label class="flex items-start gap-3 rounded-3xl border border-border p-4 text-sm text-foreground">
      <input
        v-model="form.allow_custom_answer"
        class="mt-1 size-4 accent-primary"
        type="checkbox"
      >
      <span>
        <span class="block font-semibold">{{ $t('questions.create.form.allowCustomAnswerLabel') }}</span>
        <span class="mt-1 block leading-6 text-muted-foreground">
          {{ $t('questions.create.form.allowCustomAnswerDescription') }}
        </span>
      </span>
    </label>

    <BaseFormError v-if="submitError">
      {{ submitError }}
    </BaseFormError>

    <BaseButton
      class="w-full"
      :disabled="isSubmitting"
      size="lg"
      type="submit"
    >
      {{ isSubmitting ? $t('questions.create.form.pendingSubmit') : $t('questions.create.form.submit') }}
    </BaseButton>
  </form>
</template>
