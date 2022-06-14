<template>
  <div class="table-user">
    <filter-table
      class="table-user__filter"
      v-model="search"
      :fields="fieldsSearch"
      :roles="rolesFields"
      @reset="handleReset"
      @search="handleSearch"
    />
    <custom-table
      v-loading="loading"
      class="table-user__data"
      v-model="selection"
      :columns="columns"
      :data="list"
      checkbox
      :action="false"
    />
  </div>
</template>

<script>
import CustomTable from '@/components/Table/CustomTable.vue'
import FilterTable from '@/components/Table/FilterTable.vue'
import {
  mapState,
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'TableUser',

  components: {
    CustomTable,
    FilterTable
  },

  props: {
    value: {
      type: Array,
      default: () => ([])
    },

    id: {
      type: Number,
      default: null
    },

    data: {
      type: Array,
      default: () => ([])
    }
  },

  data: () => ({
    rolesFields: {
      search: true
    },
    search: {
      gioi_tinh: -1,
      get_all: true,
      hospital_id: null
    },
    loading: false
  }),

  computed: {
    ...mapGetters(['user']),
    ...mapState('nhanVien', ['columns']),

    list () {
      return this.data
    },

    fieldsSearch () {
      return [
        {
          key: 'tai_khoan_id',
          field: 'text',
          placeholder: 'Tìm kiếm theo tài khoản id',
          label: 'Tài khoản ID'
        },
        {
          key: 'ten_nhan_vien',
          field: 'text',
          placeholder: 'Tìm kiếm theo tên nhân viên',
          label: 'Tên nhân viên'
        },
        {
          key: 'gioi_tinh',
          field: 'select',
          placeholder: 'Giới tính',
          list: [
            {
              label: 'Tất cả',
              value: -1
            },
            {
              label: 'Nam',
              value: 1
            },
            {
              label: 'Nữ',
              value: 0
            }
        ]
    }
  ]
    },

    selection: {
      get () {
        return this.value
      },

      set (val) {
        this.$emit('input', val)
      }
    }
  },

  created () {
    this.initData()
  },

  methods: {
    ...mapActions('nhanVien', ['queryNhanVien']),

    initData () {
      this.search = {
        gioi_tinh: -1,
        get_all: true,
        hospital_id: this.user.hospital.hospital_id || null
      }
    },

    handleReset () {
      this.loading = true
      this.initData()
      this.queryNhanVien(this.search).then(() => {
        this.loading = false
      })
      .catch(() => {
        this.$message({
          type: 'warning',
          message: this.$t('error.server')
        })
        this.loading = false
      })
    },

    handleSearch () {
      this.loading = true
      this.queryNhanVien({
        ...this.search
      }).then(() => {
        this.loading = false
      })
      .catch(() => {
        this.$message({
          type: 'warning',
          message: this.$t('error.server')
        })
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.table-user {
  &__filter {
    padding-bottom: 15px;
  }

  &__data {
    padding-top: 15px;
    border-radius: 5px;
  }
}
</style>