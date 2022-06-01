<template>
  <div class="custom-table">
    <el-table
      v-model="value"
      :data="data"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="checkbox"
        type="selection"
        align="center"
        width="50"
      />

      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.column"
        :label="item.label"
        :width="item.width"
        :align="item.align"
      />

      <el-table-column
        prop="action"
        label="Action"
        min-width="120"
      >
        <template slot-scope="{row}">
          <button
            class="custom-table__btn-action"
            @click="onEdit(row)"
            :title="$t('components.CustomTable.edit')"
          >
            <v-icon>
              mdi-pen
            </v-icon>
          </button>

          <button
            class="custom-table__btn-action"
            @click="onDelete(row)"
            :title="$t('components.CustomTable.delete')"
          >
            <v-icon>
              mdi-delete
            </v-icon>
          </button>

         <slot name="action" :data="row" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CustomTable',

  props: {
    value: {
      type: Array,
      default: () => ([])
    },

    data: {
      type: Array,
      default: () => ([])
    },

    columns: {
      type: Array,
      default: () => ([])
    },

    checkbox: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleSelectionChange (val) {
      this.$emit('input', val)
    },

    onEdit (data) {
      this.$emit('edit', data)
    },

    onDelete (data) {
      this.$emit('delete', data)
    } 
  }
}
</script>

<style lang="scss">
@import './CustomTable.scss';
</style>
