<template>
  <div class="custom-table">
    <el-table
      v-model="selection"
      :data="data"
      ref="multipleTable"
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
      >
        <template slot-scope="{row}">
          <span
            :class="item.class"
            v-if="!item.format"
          >
            {{ row[item.column] }}
          </span>
          <div
            :class="[item.class, formatData(item.format, row[item.column]).class || '']"
            v-else
          >
            {{ formatData(item.format, row[item.column]).label || formatData(item.format, row[item.column]) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-if="action"
        prop="action"
        label="Action"
        width="160"
      >
        <template #header>
          <div>
            
          </div>
        </template>
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
    },

    action: {
      type: Boolean,
      default: true
    },

    selected: {
      type: Array,
      default: () => ([])
    }
  },

  computed: {
    selection: {
      get () {
        return this.value
      },

      set (val) {
        this.$emit('input', val)
      }
    }
  },

  watch: {
    selected (data) {
      this.toggleSelection(data)
    },

    data () {
      console.log('data', this.selected)
      this.toggleSelection(this.selected)
    }
  },

  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        });

        if (rows.length === 0) this.$refs.multipleTable.clearSelection()
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },

    handleSelectionChange (val) {
      this.$emit('input', val)
    },

    onEdit (data) {
      this.$emit('edit', data)
    },

    onDelete (data) {
      this.$emit('delete', data)
    },

    formatData (format, data) {
      let result = data
      switch (format.type) {
        case 'time':
          result = this.$moment(data).format('DD/MM/YYYY hh:mm:ss')
          break
        case 'data':
          const item = format.data.find((item) => item.value === data)
          result = item || { label: '' }
        default:
          break
      }
      return result
    }
  }
}
</script>

<style lang="scss">
@import './CustomTable.scss';
</style>
