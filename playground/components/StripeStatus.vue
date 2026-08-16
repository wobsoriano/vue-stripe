<script setup lang="ts">
const stripe = useStripe()
</script>

<template>
  <p>useStripe resolved: {{ Boolean(stripe) }}</p>
</template>
