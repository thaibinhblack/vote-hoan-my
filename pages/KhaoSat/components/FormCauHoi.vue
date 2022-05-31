<template>
  <div class="form-cau-hoi">
    <el-form
      class="form-cau-hoi__container col-12"
      :model="form"
      :rules="rules"
      v-loading="loading"
    >
      <div class="row">
        <el-form-item
          class="col-12 col-md-3 col-xl-2"
          prop="stt_cauhoi"
          label="STT câu hỏi"
        >
          <el-input
            type="number"
            :min="1"
            :max="100"
            v-model="form.stt_cauhoi"
            @change="handleChangeSTT"
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-5 col-xl-4"
          prop="ten_cauhoi"
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
            v-model="form.ten_cauhoi"
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
          prop="tamngung"
          :label="language === 'vi'
            ? 'Trạng thái câu hỏi'
            : 'Status question'
          "
        >
          <el-select
            class="form-cau-hoi__select"
            v-model="form.tamngung"
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
          prop="ma_cauhoi"
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
            v-model="form.ma_cauhoi"
          />
        </el-form-item>
      </div>
      <div class="row">
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
      </div>
    </el-form>
    <m-form-dap-an
      :title="title"
      v-model="open"
      :data="dataAnswer"
      @submit="total = $event"
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

    cauhoi: {
      type: Object,
      default: () => ({})
    },

    language: {
      type: String,
      default: 'vi'
    }
  },

  data: () => ({
    rules: {},
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
    },

    id (data) {
      console.log('data', data)
    }
  },

  created () {
    this.initData()
  },

  methods: {
    ...mapActions('dapanCauHoi', ['queryDapAn', 'totalDapAn']),
    ...mapActions('cauHoi', ['updateCauHoi']),

    initData () {
      this.loading = true
      this.form = {
        ...this.data
      }
      this.totalDapAn(this.form.cauhoi_id)
      .then((res) => {
        this.total = res
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    onSave () {
      this.loading = true
      this.updateCauHoi(this.form)
      .then((res) => {
        this.$message({
          type: 'success',
          message: 'Cập nhật thành công'
        })
        setTimeout(() => {
          this.loading = false
        }, 1000);
      })
    },

    onRemove () {},

    showAnswer () {
      this.queryDapAn({
        cauhoi_id: this.data.cauhoi_id
      }).then((res) => {
        this.dataAnswer = [
          ...res
        ]
        this.title = `Đáp án câu hỏi ${this.data.ten_cauhoi}`
        this.open = true
      })
    },

    handleChangeSTT () {
      this.form = {
        ...this.form,
        ma_cauhoi: `${this.cauhoi.giatri_cauhoi}.${this.form.stt_cauhoi}`
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