<script setup lang="ts">
import AppFooter from '@/widgets/layout/ui/AppFooter.vue'
import AppHeader from '@/widgets/layout/ui/AppHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
