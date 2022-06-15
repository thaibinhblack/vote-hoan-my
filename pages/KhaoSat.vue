<template>
  <div
    v-loading="loading"
    class="page page-khao-sat"
  >
    <div class="container-fluid">
      <div class="row">
        <div
          class="col-12"
        >
          <filter-table
            v-model="search"
            :fields="fieldsSearch"
            :title="titlePage"
            :back="back"
            @back="onBack"
            :roles="rolesFields"
            @create="onCreate"
            @delete="onDelete"
            @reset="handleReset"
          />
        </div>

        <div
          v-if="Object.entries(query).length === 0"
          class="col-12"
        >
          <div class="page-khao-sat__content">
            <custom-table
              v-model="selection"
              :columns="columns"
              :data="list"
              @edit="handleEdit"
              @delete="handleDelete"
              :checkbox="true"
            >
              <template #action="{ data }">
                <button
                  class="page-khao-sat__btn"
                  title="Group"
                  @click="onUser(data)"
                >
                  <v-icon>mdi-account</v-icon>
                </button>
                <button
                  class="page-khao-sat__btn"
                  title="Preview"
                  @click="onPreview(data)"
                >
                  <v-icon>mdi-eye</v-icon>
                </button>
                <button
                  class="page-khao-sat__btn"
                  title="Chi tiết"
                  @click="onNext(data)"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </button>
              </template>
            </custom-table>

            <custom-pagination
              class="page-khao-sat__pagination"
              v-model="pagination"
              :total="list.length"
              @change="handleChange"
            />
          </div>
        </div>
        <div
          v-else
          class="page-khao-sat__step-form"
        >
          <khao-sat-detail
            :data="data"
          />
        </div>
      </div>
    </div>

    <m-khao-sat-detail
      v-model="open"
      :data="dataEdit"
      :title="title"
    />

    <m-setting-user
      v-model="settingUser"
      :title="titleSettingUser"
      :id="idPhienBan"
      :switch_phien_ban="switch_phien_ban"
    />
  </div>
</template>

<script>
import FilterTable from '@/components/Table/FilterTable.vue'
import CustomTable from '@/components/Table/CustomTable.vue'
import CustomPagination from '@/components/Table/CustomPagination.vue'
import MKhaoSatDetail from './KhaoSat/components/KhaoSatDetail.vue'
import StepForm from './KhaoSat/StepForm.vue'
import KhaoSatDetail from './KhaoSat/detail.vue'
import MSettingUser from './KhaoSat/components/MSettingUser'

import {
  mapState,
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'KhaoSat',

  components: {
    FilterTable,
    CustomTable,
    CustomPagination,
    MKhaoSatDetail,
    StepForm,
    KhaoSatDetail,
    MSettingUser
  },

  middleware: "auth",

  data: () => ({
    title: 'Phiên bản khảo sát',
    search: {
      status_khaosat: -1
    },
    open: false,
    dataEdit: {},
    title: '',
    titlePage: 'Danh sách phiên bản khảo sát',
    loading: false,
    query: {},
    data: {},
    rolesFields: {
      create: false,
      delete: false
    },
    selection: [],
    settingUser: false,
    titleSettingUser: '',
    idPhienBan: 0,
    switch_phien_ban: 0
  }),

  computed: {
    ...mapState('phienBanKhaoSat', ['fields', 'columns', 'pagination']),
    ...mapGetters(['user']),
    ...mapGetters('phienBanKhaoSat', ['list']),

    fieldsSearch () {
      return Object.entries(this.query).length === 0 ? this.fields : []
    },

    back () {
      return Object.entries(this.query).length > 0
    }
  },

  watch: {
    $route (data) {
      this.query = {
        ...data.query
      }
      this.initData()
    },

    user () {
      this.initNhanVien()
    }
  },

  created () {
    this.initData()
    this.checkDevice()
  },

  methods: {
    ...mapActions('phienBanKhaoSat', ['fetchListKhaoSat', 'deletePhienBan']),
    ...mapActions('phanCauHoi', ['fetchPhanCauHoi']),
    ...mapActions('benhVien', ['fetchListBenhVien']),
    ...mapActions('nhanVien', ['queryNhanVien']),


    initData () {
      this.loading = true
      this.query = {
        ...this.$route.query
      }
      this.rolesFields = {
        create: true,
        delete: true,
        export: true
      }

      Promise.all([
        this.initPhienBanKhaoSat(),
        this.fetchListBenhVien(),
        this.initNhanVien()
      ])
      
      this.loading = false
    },

    initPhienBanKhaoSat (params = {}) {
      this.loading = true
      this.fetchListKhaoSat({
        ...params,
        language: this.$i18n.loadedLanguages[0]
      })
        .then(() =>{
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.$message({
            type: 'warning',
            message: 'Xảy ra lỗi! Liên hệ với bộ phận IT để xử lý!!'
          })
        })
    },

    initNhanVien () {
      if (this.user.hospital) {
        this.queryNhanVien({
          get_all: true,
          hospital_id: this.user.hospital.hospital_id
        })
      }
    },

    handleEdit (data) {
      this.dataEdit = {
        ...data
      }
      this.title = `Cập nhật ${data.tieude_khaosat}`
      this.open = true
    },

    onNext (data) {
      this.loading = true
      this.titlePage = `Thông tin phiên bản: ${data.tieu_de_khao_sat}`
      this.data = {
        ...data
      }
      this.$router.push({
        path: 'KhaoSat',
        query: {
          id: this.data.phien_ban_id
        }
      })
    },

    onBack () {
      this.titlePage = 'Danh sách phiên bản khảo sát'
      this.$router.back()
    },

    onCreate () {
      this.open = true
      this.dataEdit = {}
      this.title = 'Thêm mới phiên bản khảo sát'
    },

    onDelete () {
      if (this.selection.length === 0) {
        this.$notify({
          type: 'warning',
          message: 'Bạn chưa chọn dữ liệu để xóa'
        })
      } else {
        this.$confirm('Bạn có muốn xóa dữ liệu đã được chọn như trên?').then(() => {

        }).catch(() => {
          console.log('cancel')
          this.selection = []
        })
      }
    },

    checkDevice () {
      let width = window.innerWidth

      if (width > 991) this.$store.dispatch('setIsMobile', false)
    else this.$store.dispatch('setIsMobile', true)
    },

    handleDelete (data) {
      if (data.status_khao_sat === 1) {
        this.$confirm(`Bạn muốn tạm ngưng hoạt động phiên bản khảo sát: "${data.tieu_de_khao_sat}?"`)
        .then(() => {
          this.loading = true
          this.deletePhienBan({
            phien_ban_id: data.phien_ban_id
          })
          .then(() => {
            this.$message({
              type: 'success',
              message: 'Cập nhật thành công'
            })
            this.loading = false
          }).catch(() => {
            this.$message({
              type: 'warning',
              message: this.$t('error.server')
            })
            this.loading = false
          })
        })
      }
      else this.$message({
        type: 'warning',
        message: 'Phiên bản khảo sát này đã tạm ngưng hoạt động!'
      })
    },

    onUser (data) {
      if (data.status_khao_sat === 1) {
        this.settingUser = true
        this.titleSettingUser = `Cài đặt người dùng tham gia khảo sát "${data.tieu_de_khao_sat}"`
        this.idPhienBan = data.phien_ban_id
        this.switch_phien_ban = data.switch_phien_ban
      } else {
        this.$message({
          type: 'warning',
          message: 'Phiên bản khảo sát này đã tạm ngưng hoạt động!'
        })
      }
    },

    onPreview () {},

    handleReset () {
      this.initData()
    },

    handleChange (data) {
      const params = {
        top: this.pagination.per_page,
        page: this.pagination.current_page,
        ...data
      }
      this.initPhienBanKhaoSat(params)
    }
  }
}
</script>

<style lang="scss">
@import '@/pages/KhaoSat/style.scss';
</style>