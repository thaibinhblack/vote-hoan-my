<template>
  <v-container
    :fluid="!$vuetify.breakpoint.mobile"
    class="page-main"
  >
    <step-form />
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
import StepForm from './KhaoSat/StepForm.vue'

export default {
  components: {
    StepForm
  },

  middleware: "auth",
  created() {
    this.$store.commit("setTilePage", "Trang chủ")
  },
  data() {
    return {}
  }
};
</script>

<style lang="scss">
  .page-main {
    padding: 0;
  }
</style>
