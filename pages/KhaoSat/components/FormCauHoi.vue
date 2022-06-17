<template>
  <div class="form-cau-hoi">
    <el-form
      class="form-cau-hoi__container col-12"
      :model="form"
      :rules="rules"
      :ref="`form-cau-hoi-${this.index}`"
      v-loading="loading"
    >
      <div class="row">
        <el-form-item
          class="col-12 col-md-3 col-xl-2"
          prop="stt_cau_hoi"
          label="STT câu hỏi"
        >
          <el-input
            type="number"
            :min="1"
            :max="100"
            v-model="form.stt_cau_hoi"
            @change="handleChangeSTT"
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-5 col-xl-4"
          prop="ten_cau_hoi"
          :label="language === 'vi'
            ? 'Tên câu hỏi'
            : 'Name Question'
          "
        >
          <el-input
            :placeholder="language === 'vi'
              ? 'Nhập tên câu hỏi'
              : 'Please input name question'
            "
            v-model="form.ten_cau_hoi"
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="thuan_nghich"
          :label="language === 'vi'
            ? 'Câu hỏi Thuận / Nghịch'
            : 'Question Nag / Pos'
          "
        >
          <el-select
            class="form-cau-hoi__select"
            v-model="form.thuan_nghich"
          >
            <el-option
              v-for="({ label, value }, index) in thuanNghich"
              :key="index"
              :value="value"
              :label="label"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="tam_ngung"
          :label="language === 'vi'
            ? 'Trạng thái câu hỏi'
            : 'Status question'
          "
        >
          <el-select
            class="form-cau-hoi__select"
            v-model="form.tam_ngung"
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
          class="col-12 col-md-3 col-xl-2"
          prop="ma_cau_hoi"
          :label="language === 'vi'
            ? 'Mã câu hỏi'
            : 'Key question'
          "
        >
          <el-input
            :placeholder="language === 'vi'
              ? 'Nhập mã câu hỏi'
              : 'Please input key question'
            "
            v-model="form.ma_cau_hoi"
          />
        </el-form-item>
      </div>
    </el-form>

    <div class="col-12 form-cau-hoi__action-container">
        <el-button
          class="form-cau-hoi__btn"
          @click="onSave"
          type="primary"
          plain
        >
        <v-icon>
          mdi-content-save-outline
        </v-icon>
          {{
            language === 'vi' ? 'Lưu lại' : 'Update'
          }}
        </el-button>

        <el-button
          class="form-cau-hoi__btn"
          @click="showAnswer"
          type="primary"
          plain
        >
          <span class="form-cau-hoi__sup">
            {{ total || 0 }}
          </span>
          {{ language === 'vi' ? 'Đáp án' : 'Answers' }}
        </el-button>

        <el-button
          class="form-cau-hoi__btn"
          @click="onRemove"
          type="danger"
          plain
        >
        <v-icon>
          mdi-delete
        </v-icon>
          {{ language === 'vi' ? 'Gỡ bỏ' : 'Remove' }}
        </el-button>
      </div>
    <m-form-dap-an
      :title="title"
      v-model="open"
      :data="dataAnswer"
      :cauhoi="form"
      @submit="total = $event"
      :language="language"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'
import MFormDapAn from './MFormDapAn.vue'

export default {
  name: 'FormCauHoi',

  components: {
    MFormDapAn
  },

  props: {
    data: {
      type: Object,
      default: () => ({})
    },

    id: {
      type: [Number, String],
      default: null
    },

    phienban: {
      type: Object,
      default: () => ({})
    },

    phancauhoi: {
      type: Object,
      default: () => ({})
    },

    language: {
      type: String,
      default: 'vi'
    },

    index: {
      type: Number,
      default: 0
    }
  },

  data: () => ({
    rules: {
      stt_cau_hoi: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa nhập STT câu hỏi'
        }
      ],
      ten_cau_hoi: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa nhập tên câu hỏi'
        }
      ],
      ma_cau_hoi: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa nhập mã câu hỏi'
        }
      ],
      thuan_nghich: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa chọn câu hỏi Thuận / Nghịch'
        }
      ],
    },
    form: {},
    open: false,
    title: '',
    dataAnswer: [],
    total: 0,
    loading: false
  }),

  computed: {
    ...mapState('cauHoi', ['thuanNghich', 'status'])
  },

  watch: {
    data () {
      this.initData()
    }
  },

  created () {
    this.initData()
  },

  methods: {
    ...mapActions('cauHoi', ['updateCauHoi', 'createCauHoi', 'deleteCauHoi']),

    initData () {
      this.loading = true
      this.form = {
        ...this.data,
        switch_phien_ban: this.phienban.switch_phien_ban,
        phien_ban_id: this.phienban.phien_ban_id
      }
      this.total = this.data.dap_ans ? this.data.dap_ans.length : 0
      this.loading = false
    },

    onSave () {
      let vm = this
      vm.loading = true
      vm.form = {
        ...vm.form,
        phan_cau_hoi_id: vm.phancauhoi.phan_cau_hoi_id,
        switch_phan_cau_hoi: vm.phancauhoi.switch_phan_cau_hoi,
        stt_cau_hoi: parseInt(vm.form.stt_cau_hoi),
        phien_ban_id: vm.phienban.phien_ban_id,
        switch_phien_ban: vm.phienban.switch_phien_ban
      }
      vm.$refs[`form-cau-hoi-${vm.index}`].validate(async (valid) => {
        if (valid) {
          if (vm.form.cau_hoi_id) {
            vm.onUpdate(this.form)
          } else vm.onCreate(this.form)
        }
      })
      vm.loading = false
    },

    onCreate (data) {
      this.createCauHoi(data)
      .then((res) => {
        this.$message({
          type: 'success',
          message: 'Thêm câu hỏi thành công'
        })
        this.form = {
          ...this.form,
          cau_hoi_id: res.data.cau_hoi_id,
          switch_cau_hoi: res.data.switch_cau_hoi
        }
        this.loading = false
      })
      .catch(() => {
        this.$message({
          type: 'warning',
          message: this.$t('error.server')
        })
        this.loading = false
      })
    },

    onUpdate (data) {
      this.updateCauHoi(data)
      .then(() => {
        this.$message({
          type: 'success',
          message: 'Cập nhật thành công'
        })
        this.loading = false
      })
      .catch(() => {
        this.$message({
          type: 'warning',
          message: this.$t('error.server')
        })
        this.loading = false
      })
    },

    onRemove () {
      let data = {
        ...this.form
      }
      this.loading = true
      if (data.cau_hoi_id) {
        this.$confirm(`Bạn có muốn gỡ bỏ câu hỏi: ${data.ten_cau_hoi}?`)
        .then(() => {
          this.deleteCauHoi(data.cau_hoi_id).then(() => {
            this.$message({
              type: 'success',
              message: 'Gỡ câu hỏi thành công'
            })
            this.loading = false
            this.$emit('reset')
          }).catch((err) => {
            console.log('deleteCauHoi', err)
            this.$message({
              type: 'warning',
              message: this.$t('error.server')
            })
            this.loading = false
          })
        })
        .catch(() => {
          this.loading = false
        })
      } else this.$message({
        type: 'warning',
        message:' Câu hỏi vẫn chưa được lưu vào Database!!'
      })
      this.loading = false
    },

    showAnswer () {
      if (this.form.cau_hoi_id) {
        this.title = `Đáp án câu hỏi ${this.form.ten_cau_hoi}`
        this.open = true
      } else {
        this.$message({
          type: 'warning',
          message: `Bạn chưa lưu lại câu hỏi ${this.form.ten_cau_hoi || ''}!`
        })
      }
    },

    handleChangeSTT () {
      this.form = {
        ...this.form,
        ma_cau_hoi: `${this.phancauhoi.gia_tri_phan_cau_hoi}.${this.form.stt_cau_hoi}`
      }
    }
  }
}
</script>

<style lang="scss">
.form-cau-hoi {
  width: 100%;
  padding: 20px 0;
  border-top: 1px solid #e2e2e2;

  &__select {
    display: block;
    width: 100%;
  }

  &__btn {
    i {
      font-size: 15px !important;
      margin-right: 5px;
    }
  }

  &__action-container {
    display: flex;
    align-items: center;
    padding: 15px;
  }
  
  .el-form-item {
    margin-bottom: 0;
  }

  &__sup {
    position: absolute;
    top: -10px;
    left: -5px;
    width: 20px;
    height: 20px;
    text-align: center;
    border: 1px solid #e2e2e2;
    border-radius: 50%;
    line-height: 20px;
    background-color: #fff;
    color: #333;
  }

  .el-button {
    position: relative;
  }
}
</style>