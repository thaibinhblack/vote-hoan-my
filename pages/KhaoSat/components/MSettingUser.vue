<template>
  <div class="m-setting-user">
    <el-drawer
      v-loading="loading"
      :title="title"
      :visible.sync="value"
      class="m-form-dap-an"
      size="50%"
      :before-close="handleClose"
      @close="close"
    >
      <template #header>
        <div class="m-setting-user__header">
          {{ title }}
        </div>
      </template>
      <div class="m-setting-user__content">
        <div class="m-setting-user__table-user">
        <filter-table
          class="table-user__filter"
          v-model="search"
          :fields="fieldsSearch"
          :roles="rolesFields"
          @reset="handleReset"
          @search="handleSearch"
          :title="titleFilter"
        />
        <custom-table
          v-loading="loading"
          class="m-setting-user__data"
          v-model="users"
          :columns="columns"
          :data="data"
          checkbox
          :action="false"
          :selected="selected"
        />
      </div>
      </div>

      <div class="m-setting-user__footer">
        <el-button
          plain
          type="primary"
          @click="onSubmit"
        >
          {{ $t('action.save') }}
        </el-button>

        <el-button
          plain
          type="warning"
          @click="close"
        >
          {{ $t('action.close') }}
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions
} from 'vuex'
import FilterTable from '@/components/Table/FilterTable'
import CustomTable from '@/components/Table/CustomTable'
export default {
  name: 'MSettingUser',

  components: {
    FilterTable,
    CustomTable
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

    id: {
      type: Number,
      default: 0
    }
  },

  data: () => ({
    form: {},
    users: [],
    loading: false,
    search: {},
    rolesFields: {
      reset: true,
      search: true
    },
    selected: []
  }),

  computed: {
    ...mapGetters(['user']),
    ...mapGetters('nhanVien', ['danhSachNhanVien']),
    ...mapGetters(['user']),
    ...mapState('nhanVien', ['columns']),

    data () {
      return this.danhSachNhanVien
    },

    titleFilter () {
      return `Danh sách nhân viên của bệnh viện ${this.user.hospital.name} (${this.users.length})`
    },

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
          key: 'nhan_vien_id',
          field: 'text',
          placeholder: 'Tìm kiếm nhân viên id',
          label: 'Nhân viên ID'
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
    }
  },

  watch: {
    value (data) {
      if (data) {
        this.fetchNhanVienKhaoSat()
        this.initData()
      }
      else this.clearData()
    }

  },

  methods: {
    ...mapActions('NhanVienKhaoSat', ['createNhanVienKhaoSat', 'queryNhanVienKhaoSat']),
    ...mapActions('nhanVien', ['queryNhanVien']),

    close () {
      this.$emit('input', false)
    },

    clearData () {
      this.users = []
      this.selected = []
      this.initData()
    },

    fetchNhanVienKhaoSat () {
      this.loading = true
      this.selected = []
      this.queryNhanVienKhaoSat({
        get_all: true,
        phien_ban_id: this.id
      }).then((res) => {
        this.users = this.danhSachNhanVien.reduce((arr, key) => {
          const check = res.data.find((item) => item.nhan_vien_id === key.nhan_vien_id)

          if (check) arr = [
            ...arr,
            key
          ]
          return arr
        }, [])
        this.selected = [
          ...this.users
        ]
        this.loading = false
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: 'Lỗi! Xin vui lòng liên liên hệ với bộ phận IT để được hỗ trợ!'
        })
        this.loading = false
      })
    },

    onSubmit () {
        const ids = [
          ...this.users.reduce((arr, key) => ([
            ...arr,
            key.tai_khoan_id
          ]), [])
        ]
        const nvids = [
          ...this.users.reduce((arr, key) => ([
            ...arr,
            key.nhan_vien_id
          ]), [])
        ]
        this.createNhanVienKhaoSat({
          tai_khoan_ids: ids,
          hospital_id: this.user.hospital.hospital_id,
          phien_ban_id: this.id,
          nhan_vien_ids: nvids
        }).then((res) => {
          this.$message({
            type: 'success',
            message: 'Cập nhật nhan viên khảo sát thành công'
          })
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: 'Lôi! Xin vui lòng liên hệ với bộ phận IT để được hỗ trợ!'
          })
        })
    },

    initData () {
      this.search = {
        gioi_tinh: -1,
        get_all: true,
        hospital_id: this.user.hospital.hospital_id || null
      }
    },

    handleReset () {
      this.loading = true
      Promise.all([
        this.initData(),
        this.queryNhanVien(this.search).then(() => {
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: this.$t('error.server')
          })
          this.loading = false
        }),
        this.fetchNhanVienKhaoSat()
      ])
      this.loading = false
    },

    handleSearch () {
      this.loading = true

      this.queryNhanVien({
        ...this.search,
        get_all: true
      }).then(() => {
        this.fetchNhanVienKhaoSat()
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

    handleClose () {
      this.close()
    }
  }
}
</script>

<style lang="scss">
  @import './MSettingUser.scss';
</style>