<template>
  <div>
    <v-progress-linear
      :value="localState"
      height="25"
      dark
    >
      <template v-slot:default="{ value }">
        <strong>{{ Math.ceil(value) }}%</strong>
      </template>
    </v-progress-linear>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
  },
  computed: {
    localState: {
      get() {
        return this.value;
      },
      set(localState) {
        this.$emit("input", localState);
      },

    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped>

</style>
