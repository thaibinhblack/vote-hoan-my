<template>
  <el-drawer
    :title="title"
    :visible.sync="value"
    class="m-form-dap-an"
    size="50%"
  >
    <form-dap-an
      v-for="(item, index) in form"
      :key="index"
      :data="item"
    />

    <div class="col-12 m-form-dap-an__action-cotnainer">
      <el-button
        type="primary"
        plain
        @click="onCreate"
      >
        Thêm mới
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import FormDapAn from './FormDapAn.vue'

export default {
  name: 'MKhaoSatDetail',

  components: {
    FormDapAn
  },

  props: {
    value: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: ''
    },

    data: {
      type: Array,
      default: () => ([])
    }
  },

  data: () => ({
    rules: {},
    form: []
  }),

  watch: {
    value (data) {
      if (data) {
        this.initData()
      } else {
        // this.$refs['form-khao-sat'].clear()
      }
    }
  },

  methods: {
    initData () {
      this.form = [
        ...this.data
      ]
    },

    onCreate () {
      this.form = [
        ...this.form,
        {}
      ]
    }
  }
}
</script>