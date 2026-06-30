<script setup lang="ts">
import AppBar from './components/AppBar.vue'
import AppFooter from './components/AppFooter.vue'
import Hero from './components/Hero.vue'
import Quickstart from './components/Quickstart.vue'
import VideoSection from './components/VideoSection.vue'
import ProductsSection from './components/ProductsSection.vue'
import WaitlistSection from './components/WaitlistSection.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-bg text-fg">
    <AppBar />
    <main class="flex-1">
      <Hero />
      <Quickstart />
      <VideoSection />
      <ProductsSection />
      <WaitlistSection />
    </main>
    <AppFooter />
  </div>
</template>
