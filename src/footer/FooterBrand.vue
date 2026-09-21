<script setup lang="ts">
defineProps<{ name: string; description: string }>()
</script>

<template>
  <div>
    <div class="flex items-center gap-2 font-display text-lg font-bold">
      <img src="/logo.png" class="h-7 w-7" aria-hidden="true" alt="logo" />
      {{ name }}
    </div>
    <p class="mt-4 max-w-md text-sm leading-relaxed text-muted">
      {{ description }}
    </p>
  </div>
</template>
