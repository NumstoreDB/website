<script setup lang="ts">
import AppBar from './components/AppBar.vue'
import AppFooter from './components/AppFooter.vue'
import Hero from './components/Hero.vue'
import Quickstart from './components/Quickstart.vue'
import ProductsSection from './components/ProductsSection.vue'
import ContactSection from './components/ContactSection.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-bg text-fg">
    <AppBar />
    <main class="flex-1">
      <Hero />
      <Quickstart />
      <ProductsSection />
      <ContactSection />
    </main>
    <AppFooter />
  </div>
</template>
