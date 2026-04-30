<script setup lang="ts">
defineProps<{
  value: string
  name: string
  label: string
  disabled?: boolean
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <label
    class="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4 text-sm font-semibold text-foreground transition hover:bg-muted/60"
    :class="model === value ? 'bg-muted ring-2 ring-primary/20' : 'bg-background'"
  >
    <input
      v-model="model"
      class="size-4 accent-primary"
      :disabled="disabled"
      :name="name"
      type="radio"
      :value="value"
    >
    <span>{{ label }}</span>
  </label>
</template>
