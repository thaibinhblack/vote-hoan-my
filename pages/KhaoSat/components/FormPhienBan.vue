<template>
  <div class="form-phien-ban">
    <el-form
      v-loading="loading"
      class="form-phien-ban__form-container"
      ref="form-phien-ban"
      :model="form"
      :rules="rules"
    >
      <div
        class="form-phien-ban__item"
      >
        <div class="row">
          <el-form-item
            class="col-12 col-md-4 col-xl-3"
            prop="tieu_de_khao_sat"
            :label="language === 'vi'
              ? 'Tiêu đề'
              : 'Title'
            "
          >
            <el-input
              v-model="form.tieu_de_khao_sat"
              :placeholder="language === 'vi'
                ? 'Nhập tiêu đề khảo sát'
                : 'Please input title'
              "
            />
          </el-form-item>

          <el-form-item
            class="col-12 col-md-4 col-xl-3"
            prop="status_khao_sat"
            :label="language === 'vi'
              ? 'Trạng thái'
              : 'Status'
            "
          >
            <el-select
              class="form-phien-ban__select"
              v-model="form.status_khao_sat"
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
            prop="url_khao_sat"
            label="URL"
          >
            <el-input
              v-model="form.url_khao_sat"
              :placeholder="language === 'vi'
                ? 'Nhập url khao sát'
                : 'Please input url vote'
              "
            />
          </el-form-item>

          <el-form-item
            class="col-sm-12 col-md-4 col-xl-3"
            prop="time_end"
            label="Thời gian kết thúc"
          >
            <el-date-picker
              v-model="form.time_end"
              type="datetime"
              placeholder="Select date and time"
            />
          </el-form-item>
        </div>

        <el-form-item
          prop="mo_ta_khao_sat"
          :label="language === 'vi'
            ? 'Mô tả'
            : 'Description'
          "
        >
          <el-input
            v-model="form.mo_ta_khao_sat"
            type="textarea"
            :rows="3"
          />
        </el-form-item>

        <el-form-item
          prop="noi_dung_khao_sat"
          :label="language === 'vi'
            ? 'Nội dung'
            : 'Content'
          "
        >
          <el-input
            v-model="form.noi_dung_khao_sat"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </div>
      <div class="form-phien-ban__action">
        <el-button
          plain
          type="primary"
          @click="onSubmit"
        >
          <v-icon>
            mdi-content-save-outline
          </v-icon>
          {{ language === 'vi' ? 'Lưu lại' : 'Update' }}
        </el-button>

        <el-button
          plain
          type="success"
          @click="onPreview"
        >
          <v-icon>
            mdi-eye
          </v-icon>
          Preview
        </el-button>

        <el-button
          plain
          type="danger"
          @click="onDelete"
        >
          <v-icon>
            mdi-delete
          </v-icon>
          {{ language === 'vi' ? 'Gỡ bỏ' : 'Remove' }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'

export default {
  name: 'FormPhienBan',

  props: {
    data: {
      type: Object,
      default: () => ({})
    },

    language: {
      type: String,
      default: 'vi'
    }
  },

  data: () => ({
    form: {},
    rules: {
      tieu_de_khao_sat: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa nhập tiêu đề khảo sát'
        }
      ],
      url_khao_sat: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa URL khảo sát'
        }
      ],
      status_khao_sat: [
        {
          required: true,
          trigger: 'change',
          message: 'Bạn chưa chọn trạng thái'
        }
      ]
    },
    loading: false
  }),

  computed: {
    ...mapState('phienBanKhaoSat', ['status']),

    isUpdate () {
      return Object.entries(this.data).length > 0
    }
  },

  watch: {
    data () {
      this.initData()
    }
  },

  methods: {
    ...mapActions('phienBanKhaoSat', ['updatePhienBan']),

    initData () {
      if (this.isUpdate) this.form = {
        ...this.data
      }
      else this.form = {}
    },

    async onSubmit () {
      this.loading = true
      await this.updatePhienBan(this.form).then(() => {
        this.$message({
          type: 'success',
          message: `Cập nhật thông tin phiên bản ${this.form.tieu_de_khao_sat} thành công!`
        })
        this.loading = false
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: this.$t('error.server')
        })
        this.loading = false
      })
    },

    onPreview () {},

    onDelete () {
      this.$confirm(`Bạn có muốn gỡ bỏ ${this.form.tieude_khaosat}?`)
      .then(() => {
        this.$emit('remove', this.form)
      })
    }
  }
}
</script>

<style lang="scss">
.form-phien-ban {
  &__form-container {
    padding: 15px;
    background-color: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    box-shadow: -1px 3px 5px #e2e2e2;
  }

  &__select {
    display: block;
    width: 100%;
  }

  .el-date-editor {
    display: block;
    width: 100%;

    .el-input__prefix {
      height: 40px;
      top: 40px
    }
  }
}
</style>