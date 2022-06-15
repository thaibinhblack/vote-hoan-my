<template>
  <div class="detail-khao-sat">
    <el-tabs
      class="detail-khao-sat__tab"
      v-model="tabActive"
    >
      <el-tab-pane
        label="Tiếng việt"
        id="vi"
        name="vi"
      >
        <div class="detail-khao-sat__container">
          <div class="col-12 detail-khao-sat__info">
            <h3 class="detail-khao-sat__title"> Thông tin: </h3>
            <form-phien-ban
              :data="form"
              @remove="onDelete"
            />
          </div>

          <div class="col-12">
            <h3 class="detail-khao-sat__title">
              Phần câu hỏi:
            </h3>
            <form-phan-cau-hoi
              v-for="(item, index) in dataPhanCauHoi"
              :key="index"
              :data="item"
              :phienban="form"
              @remove="onRemove($event, index)"
            />
          </div>
        </div>
      </el-tab-pane>
       <el-tab-pane
        label="English"
        id="en"
        name="en"
      >
        <div class="detail-khao-sat__container">
          <div class="col-12">
            <h3 class="detail-khao-sat__title"> Info: </h3>
            <form-phien-ban
              :data="form"
              @remove="onDelete"
              language="en"
            />
          </div>

          <div class="col-12">
            <h3 class="detail-khao-sat__title">
              Questions:
            </h3>

            <form-phan-cau-hoi
              v-for="(item, index) in dataPhanCauHoi"
              :key="index"
              :data="item"
              language="en"
              @remove="onRemove"
            />

          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="detail-khao-sat__footer">
      <el-button
        type="primary"
        plain
        @click="addPhanCauHoi"
      >
        Thêm mới
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  mapActions
} from 'vuex'
import FormPhanCauHoi from './components/FormPhanCauHoi.vue'
import FormPhienBan from './components/FormPhienBan.vue'

export default {
  name: 'DetailKhaoSat',

  components: {
    FormPhanCauHoi,
    FormPhienBan
  },

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    form: {},
    rules: {
      tieude_khaosat: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa nhập tiêu đề khảo sát'
        }
      ]
    },
    dataPhanCauHoi: [],
    tabActive: 'vi'
  }),

  watch: {
    tabActive() {
      this.initData(this.form.switch_phien_ban)
    },

    '$route' () {
      this.initData(this.$route.query.id)
    }
  },

  created () {
    this.initData(this.$route.query.id)
  },

  methods: {
    ...mapActions('phanCauHoi', ['fetchPhanCauHoi']),
    ...mapActions('phienBanKhaoSat', ['handleDelete', 'fetchKhaoSatById']),

    initData (id) {
      this.loading = true
      this.fetchKhaoSatById(id)
      .then((res) => {
        this.form = {
          ...res
        }
        this.tabActive = this.form.language
        this.getPhanCauHoi()
      }).catch((err) => {
        console.log('fetchKhaoSatById', err)
        this.$message({
          type: 'warning',
          message: 'Phiên bản không tồn tại, hoặc đã tạm ngưng hoạt động!'
        })
        this.$router.back()
      })
      
    },

    onRemove (data, idx) {
      this.dataPhanCauHoi = [
        ...this.dataPhanCauHoi.filter((item, index) => index !== idx)
      ]
    },

    onDelete (data) {
      this.handleDelete(data)
      .then((res) => {
        this.$router.back()
      })
    },

    getPhanCauHoi () {
      this.fetchPhanCauHoi({
        phien_ban_id: this.form.phien_ban_id,
        language: this.form.language
      }).then((res) => {
        this.dataPhanCauHoi = [
          ...res.data
        ]
      }).catch((err) => {
        console.log('fetchPhanCauHoi', err)
        this.$message({
          type: 'warning',
          message: this.$t('error.server')
        })
      })
    },

    addPhanCauHoi () {
      this.dataPhanCauHoi = [
        ...this.dataPhanCauHoi,
        {
          language: this.tabActive,
          phien_ban_id: this.form.phien_ban_id,
          status_phan_cau_hoi: 1
        }
      ]
    }
  }

}
</script>

<style lang="scss">
  .detail-khao-sat {
    &__title {
      padding: 15px 0;
    }

    &__select {
      display: block;
      width: 100%;
    }

    .el-input__suffix {
      height: 40px;
      top: unset;
      bottom: 0;
    }

    &__tab {
      padding: 0 15px;
    }

    &__footer {
      padding: 15px;
    }

    &__info {
      padding: 15px 0;
    }
  }
</style>