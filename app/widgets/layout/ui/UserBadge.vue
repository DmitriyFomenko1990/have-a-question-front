<script setup lang="ts">
const props = defineProps<{
  username: string
}>()

const userInitial = computed(() => props.username.slice(0, 1).toUpperCase())
</script>

<template>
  <div class="flex items-center gap-3 rounded-full border border-border bg-muted/60 py-1 pl-1 pr-4">
    <div
      class="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
      :aria-label="$t('layout.header.userAvatar', { username })"
    >
      {{ userInitial }}
    </div>
    <span class="text-sm font-semibold text-foreground">
      {{ username }}
    </span>
  </div>
</template>
