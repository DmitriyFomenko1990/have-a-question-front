<script setup lang="ts">
import QuestionOptionInput from '@/features/questions/ui/QuestionOptionInput.vue'

type QuestionOptionFormValue = {
  text: string
}

defineProps<{
  optionErrors: Record<number, string>
  error?: string
}>()

const options = defineModel<QuestionOptionFormValue[]>({ required: true })

const canRemoveOption = computed(() => options.value.length > 2)

const addOption = () => {
  options.value.push({
    text: '',
  })
}

const removeOption = (index: number) => {
  if (!canRemoveOption.value) {
    return
  }

  options.value.splice(index, 1)
}
</script>

<template>
  <div class="rounded-3xl border border-border p-4 sm:p-5">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-base font-semibold text-foreground">
          {{ $t('questions.create.form.optionsTitle') }}
        </h2>
        <p class="mt-1 text-sm leading-6 text-muted-foreground">
          {{ $t('questions.create.form.optionsDescription') }}
        </p>
      </div>
      <BaseButton
        class="w-full sm:w-auto"
        type="button"
        variant="secondary"
        @click="addOption"
      >
        {{ $t('questions.create.form.addOption') }}
      </BaseButton>
    </div>

    <div class="mt-5 space-y-3">
      <QuestionOptionInput
        v-for="(option, index) in options"
        :key="index"
        v-model="option.text"
        :can-remove="canRemoveOption"
        :error="optionErrors[index]"
        :index="index"
        @remove="removeOption(index)"
      />
    </div>

    <p
      v-if="error"
      class="mt-3 text-xs text-red-500"
    >
      {{ error }}
    </p>
  </div>
</template>
