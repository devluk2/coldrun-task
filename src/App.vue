<script lang="ts" setup>
import TrucksList from "./components/TrucksList.vue";
</script>

<template>
  <div>
    <div class="container mx-auto p-4">
      <TrucksList />
    </div>

    <DynamicDialog />
    <Toast />
  </div>
</template>
