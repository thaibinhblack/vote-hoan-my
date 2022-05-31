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
          <div class="col-12">
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
              @remove="onRemove"
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

  watch: {
    data (data) {
      this.form = {
        ...data
      }

      this.initData()
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

  created () {
    this.initData()
  },

  methods: {
    ...mapActions('phanCauHoi', ['fetchList']),
    ...mapActions('phienBanKhaoSat', ['handleDelete']),

    initData () {
      this.loading = true
      this.fetchList({ phienban_id: this.data.phienban_id })
      .then((res) => {
        this.dataPhanCauHoi = [
          ...res
        ]
        this.loading = false
      })
      this.loading = false
    },

    onRemove (data) {
      this.dataPhanCauHoi = [
        ...this.dataPhanCauHoi.filter((item) => item.phan_cauhoi_id !== data.phan_cauhoi_id)
      ]
    },

    onDelete (data) {
      this.handleDelete(data)
      .then((res) => {
        this.$router.back()
      })
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
  }
</style>