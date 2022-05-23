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
        prop="tieude_khaosat"
        label="Tiêu đề khảo sát"
      >
        <el-input
          placeholder="Nhập tiêu đề khảo sát"
          v-model="form.tieude_khaosat"
        />
      </el-form-item>

      <el-form-item
        prop="mota_khaosat"
        label="Mô tả khảo sát"
      >
        <el-input
          type="textarea"
          placeholder="Nhập mô tả khảo sát"
          v-model="form.mota_khaosat"
          :rows="4"
        />
      </el-form-item>

      <el-form-item
        prop="url_khaosat"
        label="URL khảo sát"
      >
        <el-input
          placeholder="Nhập url đề khảo sát"
          v-model="form.url_khaosat"
        />
      </el-form-item>

      <el-form-item
        prop="status_khaosat"
        label="Trạng thái"
      >
        <el-select
          v-model="form.status_khaosat"
          class="khao-sat-detail__select"
        >
          <el-option
            v-for="({ label, value }, index) in status"
            :key="index"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div class="khao-sat-detail__footer">
      <el-button
        @click="onSubmit"
        plain
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
      tieude_khaosat: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa nhập tiêu đề'
        }
      ],
      url_khaosat: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa nhập url khảo sát'
        }
      ],
      status_khaosat: [
        {
          required: true,
          trigger: 'change',
          message: 'Bạn chọn trạng thái'
        }
      ]
    },
    form: {},
    size: '40%',
    loading: false
  }),

  computed: {
    ...mapState('phienBanKhaoSat', ['status']),

    isUpdate () {
      return Object.entries(this.data).length > 0
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

    onClose () {
      if (this.isUpdate) {
        if (this.form == this.data) {
          this.close()
        } else {
          this.$confirm('Bạn có muốn lưu lại trước khi thoát?').then(() => {
            this.onSubmit()
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
      if (vm.$store.state.isMobile) vm.size = '100%'
      else vm.size = '40%'

      vm.form = this.isUpdate
      ? {...vm.data}
      : {
        status_khaosat: 1,
        tieude_khaosat: ''
      }

      if (vm.$refs['form-khao-sat']) vm.$refs['form-khao-sat'].clearValidate()
    },

    onUpdate () {
      let vm = this
      vm.$refs['form-khao-sat'].validate(async(valid) => {
        if (valid) {
          vm.updatePhienBan(this.form)
          vm.$message({
            type: 'success',
            message: 'Lưu lại thành công!'
          })
          vm.close()
        }
      })
    },

    onCreate () {
      let vm = this
      vm.$refs['form-khao-sat'].validate(async(valid) => {
        if (valid) {
          vm.createPhienBan(vm.form)
          vm.$message({
            type: 'success',
            message: 'Thêm mới thành công!'
          })
          this.close()
        }
      })
    },

    onSubmit () {
      this.loading = true
      if (this.isUpdate) this.onUpdate()
      else this.onCreate()
      this.loading = false
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
}
</style>