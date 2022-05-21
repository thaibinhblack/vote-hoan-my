<template>
  <div
    v-loading="loading"
    class="page page-khao-sat"
  >
    <div class="container">
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
          />
        </div>

        <div
          v-if="Object.entries(query).length === 0"
          class="col-12 page-khao-sat__content"
        >
          <custom-table
            v-model="selection"
            :columns="columns"
            :data="list"
            @edit="handleEdit"
            :checkbox="true"
          >
            <template #action="{ data }">
              <button
                @click="onNext(data)"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </button>
            </template>
          </custom-table>

          <custom-pagination
            class="page-khao-sat__pagination"
            :total="list.length"
          />
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
  </div>
</template>

<script>
import FilterTable from '@/components/Table/FilterTable.vue'
import CustomTable from '@/components/Table/CustomTable.vue'
import CustomPagination from '@/components/Table/CustomPagination.vue'
import MKhaoSatDetail from './KhaoSat/components/KhaoSatDetail.vue'
import StepForm from './KhaoSat/StepForm.vue'
import KhaoSatDetail from './KhaoSat/detail.vue'
import {
  mapState,
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
    KhaoSatDetail
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
    selection: []
  }),

  computed: {
    ...mapState('phienBanKhaoSat', ['list', 'fields', 'columns']),

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
    } 
  },

  created () {
    this.initData()
  },

  methods: {
    ...mapActions('phienBanKhaoSat', ['fetchListKhaoSat', 'fetchKhaoSat']),
    ...mapActions('phanCauHoi', ['fetchList']),

    initData () {
      this.loading = true
      this.query = {
        ...this.$route.query
      }
      if (this.query.id) {
        this.rolesFields = {
          create: false,
          delete: false
        }
        this.fetchKhaoSat({phienban_id: this.query.id})
        .then((res) =>{
          this.data = {
            ...res
          }
        })
        .catch((err) => {
          this.onBack()
        })
      } else {
        this.rolesFields = {
          create: true,
          delete: true
        }
        this.fetchListKhaoSat()
      }
      
      this.loading = false
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
      this.titlePage = `Thông tin phiên bản: ${data.tieude_khaosat}`
      this.data = {
        ...data
      }
      this.fetchList().then((res) => {
        this.listPhanCauHoi = [
          ...res
        ]
        this.loading = false
        this.$router.push(`khao-sat?id=${data.phienban_id}`)
      }).catch((err) => {
        this.loading = false
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
    }
  }
}
</script>

<style lang="scss">
.page-khao-sat {
  min-height: calc(100vh - 48px);
  background-color: #e2e2e2;

  &__pagination {
    padding: 15px 0;
  }

  &__step-form {
    width: 100%;
  }
}
</style>