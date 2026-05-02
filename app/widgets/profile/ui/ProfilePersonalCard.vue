<script setup lang="ts">
type ProfileStat = {
  labelKey: string
  value: string
}

defineProps<{
  stats: ProfileStat[]
}>()
</script>

<template>
  <aside class="rounded-3xl border border-border bg-background p-6 shadow-sm">
    <div class="flex items-start gap-4">
      <div class="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
        {{ $t('dashboard.profile.initials') }}
      </div>
      <div>
        <p class="text-sm font-semibold text-muted-foreground">
          {{ $t('dashboard.profile.label') }}
        </p>
        <h2 class="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {{ $t('dashboard.profile.name') }}
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          {{ $t('dashboard.profile.email') }}
        </p>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-3 gap-3">
      <div
        v-for="stat in stats"
        :key="stat.labelKey"
        class="rounded-2xl bg-muted p-4"
      >
        <p class="text-2xl font-semibold text-foreground">
          {{ stat.value }}
        </p>
        <p class="mt-1 text-xs font-medium text-muted-foreground">
          {{ $t(stat.labelKey) }}
        </p>
      </div>
    </div>

    <div class="mt-6 rounded-2xl border border-border p-4">
      <p class="text-sm font-semibold text-foreground">
        {{ $t('dashboard.profile.aboutTitle') }}
      </p>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">
        {{ $t('dashboard.profile.aboutDescription') }}
      </p>
    </div>
  </aside>
</template>
