<script setup lang="ts">
import type { ApiQuestionChoiceType, ApiQuestionOption } from '@/shared/api/types'

const props = defineProps<{
  choiceType?: ApiQuestionChoiceType
  name: string
  options: ApiQuestionOption[]
  disabled?: boolean
}>()

const model = defineModel<number[]>({ required: true })

const isMultipleChoice = computed(() => props.choiceType === 'multiple')
const selectedSingleOptionId = computed({
  get: () => model.value[0]?.toString() || '',
  set: (value: string) => {
    model.value = value ? [Number(value)] : []
  },
})
const selectedMultipleOptionIds = computed({
  get: () => model.value.map(String),
  set: (values: string[]) => {
    model.value = values.map(Number)
  },
})
</script>

<template>
  <div class="mt-5">
    <div
      v-if="options.length > 0"
      class="grid gap-3"
    >
      <template
        v-if="isMultipleChoice"
      >
        <BaseCheckboxCard
          v-for="option in options"
          :key="option.id"
          v-model="selectedMultipleOptionIds"
          :disabled="disabled"
          :label="option.text"
          :value="String(option.id)"
        />
      </template>

      <template v-else>
        <BaseRadioCard
          v-for="option in options"
          :key="option.id"
          v-model="selectedSingleOptionId"
          :disabled="disabled"
          :label="option.text"
          :name="name"
          :value="String(option.id)"
        />
      </template>
    </div>

    <p
      v-else
      class="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground"
    >
      {{ $t('questions.card.noOptions') }}
    </p>
  </div>
</template>
