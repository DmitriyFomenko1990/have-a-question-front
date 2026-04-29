<script setup lang="ts">
import { cn } from '@/shared/lib/styles/cn'

type SegmentedControlOption = {
  label: string
  value: string
}

defineProps<{
  options: SegmentedControlOption[]
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="grid rounded-full bg-muted p-1" :style="{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="cn(
        'rounded-full px-4 py-2 text-sm font-semibold transition',
        model === option.value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
      )"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>
