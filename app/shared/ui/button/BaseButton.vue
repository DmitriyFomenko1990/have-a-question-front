<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import type { ClassValue } from 'clsx'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/shared/lib/styles/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-sm hover:opacity-90',
        secondary: 'border border-border text-foreground hover:bg-muted',
      },
      size: {
        md: 'h-11 px-6',
        lg: 'h-12 px-7',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      variant?: ButtonVariants['variant']
      size?: ButtonVariants['size']
    }
  >(),
  {
    as: 'button',
    variant: 'primary',
    size: 'md',
  },
)

const attrs = useAttrs()

const classes = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), attrs.class as ClassValue),
)
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="classes"
  >
    <slot />
  </Primitive>
</template>
