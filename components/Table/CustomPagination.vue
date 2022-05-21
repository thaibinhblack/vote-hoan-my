<template>
  <div
    v-bind="$attrs"
    class="custom-pagination"
  >
    <el-pagination
      :page-size="size"
      layout="total, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'CustomPagination',

  props: {
    size: {
      type: Number,
      default: 50
    },

    total: {
      type: Number,
      default: 0
    }
  },

  methods: {
    handleSizeChange (e) {
      this.$emit('changeSize', e)
    },

    handleCurrentChange (e) {
      this.$emit('changePage', e)
    }
  }
}
</script>

<style lang="scss">
@import './CustomPagination.scss';
</style>
