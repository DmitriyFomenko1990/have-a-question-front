<script setup lang="ts">
const props = defineProps<{
  value: string
  label: string
  disabled?: boolean
}>()

const model = defineModel<string[]>({ required: true })

const isChecked = computed(() => model.value.includes(props.value))
</script>

<template>
  <label
    class="flex items-center gap-3 rounded-2xl border border-border p-4 text-sm font-semibold text-foreground transition"
    :class="[
      isChecked ? 'bg-muted ring-2 ring-primary/20' : 'bg-background',
      disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-muted/60',
    ]"
  >
    <input
      v-model="model"
      class="size-4 rounded accent-primary"
      :disabled="disabled"
      type="checkbox"
      :value="value"
    >
    <span>{{ label }}</span>
  </label>
</template>
