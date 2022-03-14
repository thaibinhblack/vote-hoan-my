<template>
  <v-container :fluid="!$vuetify.breakpoint.mobile">

    <v-img
      class="logo-hm83"
      src="/img/2021-07-20_16-13-23.png"
      contain
      max-height="500"
      max-width="800"
    />

  </v-container>
</template>
<style scoped>
.logo-hm83 {
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  margin:auto;
}
</style>
<script>


export default {
  middleware: "auth",
  created() {
    this.$store.commit("setTilePage", "Trang chủ")
  },
  data() {
    return {}
  }
};
</script>
