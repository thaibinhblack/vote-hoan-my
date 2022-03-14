<template>
  <v-app dark>
    <div class='loi'>
      <h1 v-if="error.statusCode === 404">
        {{ pageNotFound }}
      </h1>
      <h1 v-else>
        {{ otherError }}
      </h1>
      <p class="text--center headline">
        {{ error.message }} {{ error.statusCode }}
      </p>
      <NuxtLink to="/">
        Home page
      </NuxtLink>
    </div>

  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
.loi {
  margin: auto;
}

h1 {

}
</style>
