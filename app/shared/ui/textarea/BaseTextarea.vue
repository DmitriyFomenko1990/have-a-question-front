<script setup lang="ts">
import type { ClassValue } from 'clsx'
import { cn } from '@/shared/lib/styles/cn'

defineOptions({
  inheritAttrs: false,
})

withDefaults(
  defineProps<{
    placeholder?: string
  }>(),
  {
    placeholder: undefined,
  },
)

const model = defineModel<string>()
const attrs = useAttrs()

const classes = computed(() =>
  cn(
    'min-h-32 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20',
    attrs.class as ClassValue,
  ),
)
</script>

<template>
  <textarea
    v-bind="attrs"
    v-model="model"
    :class="classes"
    :placeholder="placeholder"
  />
</template>
