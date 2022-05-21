<template>
  <el-drawer
    :title="title"
    :visible.sync="value"
    class="khao-sat-detail"
    :size="size"
    @close="onClose"
    :before-close="onClose"
  >
    <el-form
      class="khao-sat-detail__form"
      :rules="rules"
      ref="form-khao-sat"
    >

    </el-form>
  </el-drawer>
</template>

<script>
export default {
  name: 'MKhaoSatDetail',

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
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    rules: {},
    form: {},
    size: '40%'
  }),

  watch: {
    value (data) {
      if (data) {
        this.form = Object.entries(this.data).length > 0
        ? {
          ...this.data
        }
        : {}
      } else {
        // this.$refs['form-khao-sat'].clear()
      }
    }
  },

  created () {
    this.initData()
  },

  methods: {
    onClose () {
      this.$emit('input', false)
      this.$emit('close')
    },

    initData () {
      if (this.$store.state.isMobile) this.size = '100%'
      else this.size = '40%'
    }
  }
}
</script>