<script setup lang="ts">
defineProps<{
  index: number
  error?: string
  canRemove: boolean
}>()

const emit = defineEmits<{
  remove: []
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
    <BaseInput
      v-model="model"
      :placeholder="$t('questions.create.form.optionPlaceholder', { number: index + 1 })"
    />
    <BaseButton
      class="w-full sm:w-auto"
      :disabled="!canRemove"
      type="button"
      variant="secondary"
      @click="emit('remove')"
    >
      {{ $t('questions.create.form.removeOption') }}
    </BaseButton>
    <span
      v-if="error"
      class="text-xs text-red-500 sm:col-span-2"
    >
      {{ error }}
    </span>
  </div>
</template>
