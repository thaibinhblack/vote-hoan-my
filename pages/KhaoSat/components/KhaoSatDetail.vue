<template>
  <el-drawer
    :title="title"
    :visible.sync="value"
    class="khao-sat-detail"
    :size="size"
    @close="close"
    :before-close="onClose"
    v-loading="loading"
  >
    <el-form
      class="khao-sat-detail__form"
      :model="form"
      :rules="rules"
      ref="form-khao-sat"
    >
      <el-form-item
        prop="tieu_de_khao_sat"
        label="Tiêu đề khảo sát"
      >
        <el-input
          placeholder="Nhập tiêu đề khảo sát"
          v-model="form.tieu_de_khao_sat"
          :disabled="isDisabled"
        />
      </el-form-item>

      <el-form-item
        prop="mo_ta_khao_sat"
        label="Mô tả khảo sát"
      >
        <el-input
          type="textarea"
          placeholder="Nhập mô tả khảo sát"
          v-model="form.mo_ta_khao_sat"
          :rows="4"
          :disabled="isDisabled"
        />
      </el-form-item>

      <el-form-item
        prop="noi_dung_khao_sat"
        label="Nội dung khảo sát"
      >
        <el-input
          type="textarea"
          v-model="form.noi_dung_khao_sat"
          placeholder="Nhập nội dung khảo sát"
          :rows="4"
          :disabled="isDisabled"
        />
      </el-form-item>

      <div class="row">
        <div class="col-sm-6">
          <el-form-item
            prop="time_end"
            label="Thời gian kết thúc"
          >
            <el-date-picker
              v-model="form.time_end"
              type="datetime"
              placeholder="Select date and time"
              :disabled="isDisabled"
            />
          </el-form-item>
        </div>
        <div class="col-sm-6">
          <el-form-item
            prop="status_khao_sat"
            label="Trạng thái"
          >
            <el-select
              v-model="form.status_khao_sat"
              class="khao-sat-detail__select"
              :disabled="isDisabled"
            >
              <el-option
                v-for="({ label, value }, index) in status"
                :key="index"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>

      <el-form-item
        prop="url_khao_sat"
        label="URL khảo sát"
      >
        <el-input
          placeholder="Nhập url đề khảo sát"
          v-model="form.url_khao_sat"
          :disabled="isDisabled"
        />
      </el-form-item>
    </el-form>

    <div class="khao-sat-detail__footer">
      <el-button
        @click="onSubmit"
        plain
        :disabled="isDisabled"
        type="primary"
      >
        <v-icon>
          mdi-content-save-outline
        </v-icon>
        Lưu lại
      </el-button>


      <el-button
        @click="onClose"
        plain
        type="danger"
      >
        <v-icon>
          mdi-close
        </v-icon>
        Đóng lại
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'

export default {
  name: 'MKhaoSatDetail',

  props: {
    value: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: ''
    },

    data: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    rules: {
      tieu_de_khao_sat: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa nhập tiêu đề'
        }
      ],
      url_khao_sat: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa nhập url khảo sát'
        }
      ],
      status_khao_sat: [
        {
          required: true,
          trigger: 'change',
          message: 'Bạn chọn trạng thái'
        }
      ],
      mo_ta_khao_sat: [
        {
          required: true,
          trigger: 'change',
          message: 'Bạn chưa nhập mô tả khảo sát'
        }
      ],
      noi_dung_khao_sat: [
        {
          required: true,
          trigger: 'change',
          message: 'Bạn chưa nhập nội dung khảo sát'
        }
      ],
      time_end: [
        {
          required: true,
          trigger: 'change',
          message: 'Bạn chưa nhập thời gian kết thúc khảo sát'
        }
      ],
    },
    form: {},
    size: '40%',
    loading: false,
    save: false
  }),

  computed: {
    ...mapState('phienBanKhaoSat', ['status']),

    isUpdate () {
      return Object.entries(this.data).length > 0
    },

    isDisabled () {
      return this.isUpdate === true && this.data.status_khao_sat !== 1
    }
  },

  watch: {
    value (data) {
      if (data) {
        this.initData()
      } else {
        this.$refs['form-khao-sat'].clearValidate()
      }
    }
  },

  created () {
    this.initData()
  },

  methods: {
    ...mapActions('phienBanKhaoSat', ['updatePhienBan', 'createPhienBan']),

    checkChange () {
      let change = false
      Object.entries(this.form).forEach((item) => {
        if (this.form[item[0]] !== this.data[item[0]]) {
          change = true
        }
      })
      return change
    },

    onClose () {
      if (this.isUpdate) {
        const check = this.checkChange()
        if (!check || this.save === true) {
          this.close()
        } else {
          this.$confirm('Bạn có muốn lưu lại trước khi thoát?').then(() => {
            this.onSubmit()
            this.close()
          }).catch(() => {
            this.close()
          })
        }
      } else {
        this.close()
      }
    },

    close () {
      this.$emit('input', false)
      this.$emit('close')
    },

    initData () {
      let vm = this
      vm.save = false
      if (vm.$store.state.isMobile) vm.size = '100%'
      else vm.size = '40%'

      vm.form = this.isUpdate
      ? {...vm.data}
      : {
        status_khao_sat: 1,
        tieude_khaosat: ''
      }

      if (vm.$refs['form-khao-sat']) vm.$refs['form-khao-sat'].clearValidate()
    },

    onUpdate () {
      let vm = this
      vm.loading = true
      vm.$refs['form-khao-sat'].validate(async(valid) => {
        if (valid) {
          vm.updatePhienBan(this.form).then((res) => {
            vm.loading = false
            vm.$message({
              type: 'success',
              message: `Cập nhật ${this.form.tieu_de_khao_sat} thành công!`
            })
            vm.save = true
          }).catch(() => {
            vm.$message({
              type: 'warning',
              message: vm.$t('error.server')
            })
            vm.loading = false
          })
        }
      })
    },

    onCreate () {
      let vm = this
      vm.$refs['form-khao-sat'].validate(async(valid) => {
        if (valid) {
          vm.createPhienBan(vm.form).then((res) => {
            vm.$message({
              type: 'success',
              message: 'Thêm mới thành công!'
            })
            this.close()
          })
        }
      })
    },

    onSubmit () {
      if (this.isDisabled) {
        this.$message({
          type: 'warning',
          message: 'Phiên bản khảo sát đã tạm ngưng hoạt động!'
        })
      } else {
        this.loading = true
        if (this.isUpdate) this.onUpdate()
        else this.onCreate()
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
.khao-sat-detail {
  &__form {
    height: calc(100vh - 150px);
    padding: 15px;
  }

  &__select {
    display: block;
    widows: 100%;
  }

  &__footer {
    padding: 0 15px;
  }

  .el-drawer__header {
    margin-bottom: 0;
    padding-bottom: 20px;
    border-bottom: 1px solid #e2e2e2;
    background-color: #e3e3e3;
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