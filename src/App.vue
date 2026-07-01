<script setup lang="ts">
import AppBar from './sections/AppBar.vue'
import AppFooter from './sections/AppFooter.vue'
import HeroSection from './sections/HeroSection.vue'
import Quickstart from './sections/Quickstart.vue'
import VideoSection from './sections/VideoSection.vue'
import ProductsSection from './sections/ProductsSection.vue'
import CustomSection from './sections/CustomSection.vue'
import WaitlistSection from './sections/WaitlistSection.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-bg text-fg">
    <AppBar />
    <main class="flex-1">
      <HeroSection />
      <Quickstart />
      <VideoSection />
      <ProductsSection />
      <CustomSection />
      <WaitlistSection />
    </main>
    <AppFooter />
  </div>
</template>
