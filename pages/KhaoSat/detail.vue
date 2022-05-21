<template>
  <div class="detail-khao-sat">
    <div class="detail-khao-sat__container">
      <div class="col-12">
        <h3 class="detail-khao-sat__title"> Thông tin: </h3>
        <el-form
          class="detail-khao-sat__form-container"
          :model="form"
          :rules="rules"
        >
          <div
            class="detail-khao-sat__item"
          >
            <div class="row">
              <el-form-item
                class="col-12 col-md-4 col-xl-3"
                prop="tieude_khaosat"
                label="Tiêu đề"
              >
                <el-input
                  v-model="form.tieude_khaosat"
                  placeholder="Nhập tiêu đề khảo sát"
                />
              </el-form-item>

              <el-form-item
                class="col-12 col-md-4 col-xl-3"
                prop="status_khaosat"
                label="Trạng thái"
              >
                <el-select
                  class="detail-khao-sat__select"
                  v-model="form.status_khaosat"
                >
                  <el-option
                    v-for="({ label, value }, index) in status"
                    :key="index"
                    :value="value"
                    :label="label"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                class="col-12 col-md-4 col-xl-3"
                prop="url_khaosat"
                label="URL"
              >
                <el-input
                  v-model="form.url_khaosat"
                  placeholder="Nhập url khao sát"
                />
              </el-form-item>
            </div>

            <el-form-item
              label="Mô tả"
            >
              <el-input
                v-model="form.mota_khaosat"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="col-12">
        <h3 class="detail-khao-sat__title">
          Phần câu hỏi:
        </h3>

        <form-phan-cau-hoi
          v-for="(item, index) in dataPhanCauHoi"
          :key="index"
          :data="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'
import FormPhanCauHoi from './components/FormPhanCauHoi.vue'

export default {
  name: 'DetailKhaoSat',

  components: {
    FormPhanCauHoi
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
    dataPhanCauHoi: []
  }),

  computed: {
    ...mapState('phienBanKhaoSat', ['status'])
  },

  created () {
    this.initData()
  },

  methods: {
    ...mapActions('phanCauHoi', ['fetchList']),

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

    &__form-container {
      padding: 15px;
      background-color: #fff;
      border: 1px solid #e2e2e2;
      border-radius: 5px;
      box-shadow: -1px 3px 5px #e2e2e2;
    }
  }
</style>