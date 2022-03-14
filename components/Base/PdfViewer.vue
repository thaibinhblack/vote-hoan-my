<template>
  <div>
    <div id="style-1" class="scrollbar">
      <div class="force-overflow"/>
    </div>
    <v-dialog
      v-model="localState"
      max-width="1200"
      transition="dialog-bottom-transition"
    >
      <v-toolbar
        class="menu"
        dark
        color="primary"
      >
        <v-toolbar-title>Tài liệu: {{ fileName }}</v-toolbar-title>
        <v-spacer/>
        <v-btn
          icon
          dark
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <div v-if="this.urlPdf">
<!--          <ClientOnly>-->
<!--            <pdf-->
<!--              v-for="i in numPages"-->
<!--              :key="i"-->
<!--              :src="src"-->
<!--              :page="i"-->
<!--            />-->
<!--          </ClientOnly>-->

        </div>
      </v-card-text>
    </v-dialog>
  </div>
</template>

<script>
// import pdf from 'vue-pdf'

export default {
  components: {
    // pdf
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    urlPdf: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loadingVisible: false,
      src: {},
      numPages: undefined
    }
  },
  computed: {
    localState: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value || null)
      }
    }
  },
  created() {
    console.log('Created')
  },
  updated() {
    console.log('updated')
  },
  mounted() {
    this.src = pdf.createLoadingTask(this.urlPdf)
    this.src.promise.then((res) => {
      this.numPages = res.numPages
    })
  },
  methods: {
    close() {
      this.$emit('input', false)
      this.$emit('CloseForm', true)
    }
  }
}
</script>

<style scoped>
.scrollbar {
  background-color: #F5F5F5;
  float: left;
  height: 300px;
  margin-bottom: 25px;
  margin-left: 22px;
  margin-top: 40px;
  width: 65px;
  overflow-y: scroll;
}

.force-overflow {

}

</style>
