<script setup lang="ts">
import type { ClassValue } from 'clsx'
import { cn } from '@/shared/lib/styles/cn'

defineOptions({
  inheritAttrs: false,
})

withDefaults(
  defineProps<{
    type?: string
    autocomplete?: string
    placeholder?: string
  }>(),
  {
    type: 'text',
    autocomplete: undefined,
    placeholder: undefined,
  },
)

const model = defineModel<string>()
const attrs = useAttrs()

const classes = computed(() =>
  cn(
    'h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20',
    attrs.class as ClassValue,
  ),
)
</script>

<template>
  <input
    v-bind="attrs"
    v-model="model"
    :autocomplete="autocomplete"
    :class="classes"
    :placeholder="placeholder"
    :type="type"
  >
</template>
