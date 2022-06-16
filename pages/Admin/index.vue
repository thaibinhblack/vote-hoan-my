<template>
  <v-container>
    <h1>Trang quản trị VoteSafety</h1>
  </v-container>
</template>

<script>
export default {
  layout: "admin",
  middleware: ["auth"],
  name: "index.vue"
}
</script>

<style scoped>

</style>
