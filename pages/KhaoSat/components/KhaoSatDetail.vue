<template>
  <el-drawer
    :title="title"
    :visible.sync="value"
    class="khao-sat-detail"
    @close="onClose"
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
    form: {}
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

  methods: {
    onClose () {
      this.$emit('input', false)
      this.$emit('close')
    }
  }
}
</script>