<script setup lang="ts">
defineProps<{
  label: string
  error?: string
}>()
</script>

<template>
  <label class="block">
    <span class="text-sm font-medium text-foreground">{{ label }}</span>
    <div class="mt-2">
      <slot />
    </div>
    <span v-if="error" class="mt-2 block min-h-5 text-xs text-red-500">{{ error }}</span>
  </label>
</template>
