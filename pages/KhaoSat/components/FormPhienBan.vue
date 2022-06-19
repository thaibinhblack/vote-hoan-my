<template>
  <div class="form-phien-ban">
    <el-form
      v-loading="loading"
      class="form-phien-ban__form-container"
      ref="form-phien-ban"
      :model="form"
      :rules="rules"
    > 
      <div class="row">
        <div class="col-12 form-phien-ban__close">
          <el-button @click="handleClose">
              <v-icon>
              {{ close ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
          </el-button>
        </div>
      </div>
      <div
        v-if="close"
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
              :disabled="disabled"
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
              :disabled="disabled"
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
              :disabled="disabled"
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
              :disabled="disabled"
            />
          </el-form-item>

          <el-form-item
            class="col-12"
            prop="mo_ta_khao_sat"
          >
            <p>
              {{ language === 'vi'
              ? 'Mô tả'
              : 'Description' }}
            </p>
            <vue-editor
              class="form-phien-ban__description"
              v-model="form.mo_ta_khao_sat"
              :disabled="disabled"
            />
          </el-form-item>
        </div>


        <el-form-item
          prop="noi_dung_khao_sat"
        >
          <p>
              {{ language === 'vi'
              ? 'Nội dung'
              : 'Content' }}
            </p>
            <vue-editor
              class="form-phien-ban__description"
              v-model="form.noi_dung_khao_sat"
              :disabled="disabled"
            />
        </el-form-item>
      </div>
      <div class="form-phien-ban__action">
        <el-button
          v-if="roles.save"
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
          v-if="roles.preview"
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
          v-if="roles.delete"
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
import { VueEditor, Quill } from "vue2-editor"

export default {
  name: 'FormPhienBan',

  components: {
      VueEditor,
    Quill
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    },

    data: {
      type: Object,
      default: () => ({})
    },

    language: {
      type: String,
      default: 'vi'
    },

    roles: {
      type: Object,
      default: () => ({
        delete: true,
        preview: true,
        save: true
      })
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
    loading: false,
    close: true
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
    ...mapActions('phienBanKhaoSat', ['updatePhienBan', 'deletePhienBanById']),

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

    onPreview () {
      this.$router.push({
        path: this.localePath('StepForm'),
        query: {
          id: this.form.phien_ban_id
        }
      })
    },

    onDelete () {
      let vm = this
      vm.loading = true
      vm.$confirm(`Bạn có muốn gỡ bỏ ${this.form.tieu_de_khao_sat}?`)
      .then(() => {
        vm.deletePhienBanById(this.form.phien_ban_id)
        .then(() => {
          vm.$message({
            type: 'success',
            message: `Gỡ bỏ phiên bản ${vm.form.tieu_de_khao_sat} thành công!`
          })
          vm.$router.back()
          vm.loading = false
        })
        .catch((err) => {
          vm.$message({
            type: 'warning',
            message: this.$t('error.server')
          })
          vm.loading = false
        })
      })
      .catch((err) => {
        console.log('deletePhienBan', err)
        this.loading = false
      })
    },

    handleClose () {
      this.close = !this.close
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

  &__description {
    display: block;
  }

  .el-date-editor {
    display: block;
    width: 100%;

    .el-input__prefix {
      height: 40px;
      top: 40px
    }
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
</style>