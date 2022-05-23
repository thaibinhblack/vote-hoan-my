<template>
  <div class="filter-table">
    <div class="container filter-table__container">
      <div class="row filter-table__top">
        <h3 class="filter-table__title">
          <button
            class="filter-table__back"
            v-if="back"
            @click="onBack"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </button>
          {{ title }}
        </h3>

        <div class="filter-table__group-action">
          <el-button
            v-if="roles.create"
            plain
            type="primary"
            @click="onCreate"
          >
            {{ $t('components.FilterTable.create') }}
          </el-button>

           <el-button
            v-if="roles.export"
            plain
            type="success"
            @click="onExport"
          >
            {{ $t('components.FilterTable.export') }}
          </el-button>

          <el-button
            v-if="roles.delete"
            plain
            type="danger"
            @click="onDelete"
          >
            {{ $t('components.FilterTable.delete') }}
          </el-button>
        </div>
      </div>
      <div
        v-if="fields.length > 0"
        class="row filter-table__group-search"
      >
        <div class="col-12 filter-table__action-layout">
          <h4 class="filter-table__title">
            Bộ lọc dữ liệu
          </h4>
          <button
            @click="onShowLayout"
            type="button"
          >
            <v-icon>
              {{ show ? 'mdi-chevron-down': 'mdi-chevron-up' }}
            </v-icon>
          </button>
        </div>
        <div
          :class="{
            'filter-table__item-container': true,
            '--show': show
          }"
        >
          <div
            v-for="(item, index) in fields"
            :key="index"
            :class="[item.class, 'filter-table__item']"
          >
            <div class="filter-table__input-container">
              <el-input
                v-if="item.field === 'text'"
                v-model="data[item.key]"
                :type="item.field || 'text'"
                :placeholder="item.placeholder || item.key"
              />
              <el-select
                v-else
                v-model="data[item.key]"
                :placeholder="item.placeholder || item.key"
                default-first-option
              >
                <el-option
                  v-for="({value, label }, index) in item.list"
                  :key="index"
                  :value="value"
                  :label="label"
                />
              </el-select>
            </div>
          </div>
        </div>

        <el-button
          :class="{
            'filter-table__action filter-table__item --create': true,
            '--show': show
          }"
          type="primary"
          @click="onSearch"
        >
          <v-icon>mdi-search</v-icon>
          {{ $t('components.FilterTable.search') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterTable',

  props: {
    value: {
      type: Object,
      default: () => ({})
    },

    roles: {
      type: Object,
      default: () => ({})
    },

    back: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: ''
    },

    fields: {
      type: Array,
      default: () => ([])
    },

    roles: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    iconLayout: 'mdi-chevron-down',
    show: true
  }),

  computed: {
    data: {
      get () {
        return this.value
      },

      set (value) {
        this.$emit('input', value)
      }
    }
  },

  methods: {
    onCreate () {
      this.$emit('create')
    },

    onSearch () {
      this.$emit('search')
    },

    onDelete () {
      this.$emit('delete')
    },

    onExport () {
      this.$emit('export')
    },

    onBack () {
      this.$emit('back')
    },

    onShowLayout () {
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss">
@import './FilterTable.scss';
</style>
