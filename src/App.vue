<script setup>
  import NavBar from '@/components/NavBar.vue';
  import { useRoute, RouterView } from 'vue-router';
  import { computed } from 'vue';

  const $route = useRoute();

  const navbarRoutesReducer = (acc, curr) => acc && curr !== $route.name;

  const navbarVisible = computed(() => {
    const hiddeIn = [];
    return hiddeIn.reduce(navbarRoutesReducer, true);
  });
</script>

<template>
  <main>
    <NavBar v-if="navbarVisible"/>
    <RouterView/>
  </main>
</template>