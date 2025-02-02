<template>
  <main class="bg-slate-100 text-xs">
    <NavbarCard />
    <HeroCard1 />
    <AboutCard />
    <WhyCard />
    <FeatureCard />
    <PriceCard />
    <HeroCard2 />
    <FooterCard />
  </main>
</template>

<script setup>
import NavbarCard from '@/components/Landing/widgets/NavbarCard.vue'
import HeroCard1 from '@/components/Landing/widgets/HeroCard1.vue'
import AboutCard from '@/components/Landing/widgets/AboutCard.vue'
import WhyCard from '@/components/Landing/widgets/WhyCard.vue'
import FeatureCard from '@/components/Landing/widgets/FeatureServiceCard.vue'
import HeroCard2 from '@/components/Landing/widgets/HeroCard2.vue'
import PriceCard from '@/components/Landing/widgets/PriceCard.vue'
import FooterCard from '@/components/Landing/widgets/FooterCard.vue'
</script>

<style scoped>
</style>
