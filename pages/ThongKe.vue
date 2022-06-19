<template>
  <div class="page page-thong-ke">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h3 class="--txt-title page-thong-ke__title">Thống kê nhân viên khảo sát phiên bản: {{ thongke.tieu_de_khao_sat }}</h3>
          <form-phien-ban
            :data="thongke"
            :roles="roles"
            disabled  
          />
        </div>
        <div class="col-12">
          <h3 class="page-thong-ke__title --txt-title mb-0">
            Danh sách nhân viên đã tham gia khảo sát
          </h3>
        </div>
        <div class="col-12">
          <custom-table
            :columns="columnThongKe"
            :data="dataThongKe"
            :roles="{edit: false, delete: false}"
          >
            <template #action="{ data }">
              <div>
                 <button
                  class="page-khao-sat__btn"
                  title="Chi tiết"
                  @click="onNext(data)"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </button>
              </div>
            </template>
          </custom-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterTable from '@/components/Table/FilterTable.vue'
import FormPhienBan from '@/pages/KhaoSat/components/FormPhienBan.vue'
import CustomTable from '@/components/Table/CustomTable'

import {
  mapState,
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'ThongKe',

  middleware: "auth",

  components: {
    FilterTable,
    FormPhienBan,
    CustomTable
  },

  data: () => ({
    roles: {
      save: false,
      preview: true,
      delete: false
    }
  }),

  computed: {
    ...mapState('phienBanKhaoSat', ['thongke', 'columnThongKe']),
    ...mapGetters('phienBanKhaoSat', ['dataThongKe'])
  },

  created () {
    this.initData()
  },

  methods: {
    ...mapActions('phienBanKhaoSat', ['fetchThongKe']),

    initData () {
      if (this.$route.query.id) {
        this.fetchThongKe({
          id: this.$route.query.id
        }).then((res) => {
          console.log('res', res)
        })
      } else {
        this.$router.back()
      }
    },


    onNext (data) {
      if (data.status_khao_sat === 1) {
        this.$message({
          type: 'warning',
          message: `Nhân viên ${data.ten_nhan_vien} chưa hoàn thành khảo sát!`
        })
      }
    }
  }
}
</script>

<style lang="scss">
.page-thong-ke {
  &__title {
    margin-bottom: 15px;
  }
}
</style>