<template>
  <div
    v-bind="$attrs"
    class="custom-pagination"
  >
    <el-pagination
      :page-size="size"
      layout="total, sizes, prev, pager, next"
      :total="total"
      :page-sizes="sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'CustomPagination',

  props: {
    value: {
      type: Object,
      default: () => ({})
    },

    size: {
      type: Number,
      default: 50
    },

    total: {
      type: Number,
      default: 0
    },

    sizes: {
      type: Array,
      default: () => ([50, 100, 150, 200, 500])
    }
  },

  methods: {
    handleSizeChange (e) {
      this.$emit('change', {
        top: e
      })
    },

    handleCurrentChange (e) {
      this.$emit('change', {
        page: e
      })
    }
  }
}
</script>

<style lang="scss">
@import './CustomPagination.scss';
</style>
