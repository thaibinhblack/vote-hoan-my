<template>
  <div class="form-cau-hoi">
    <el-form
      class="form-cau-hoi__container col-12"
      :model="form"
      :rules="rules"
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
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-5 col-xl-4"
          prop="ten_cauhoi"
          label="Tên câu hỏi"
        >
          <el-input
            placeholder="Nhập tên câu hỏi"
            v-model="form.ten_cauhoi"
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="thuan_nghich"
          label="Câu hỏi Thuận / Nghịch"
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
          label="Trạng thái câu hỏi"
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
            Lưu lại
          </el-button>

          <el-button
            class="form-cau-hoi__btn"
            @click="showAnswer"
            type="primary"
            plain
          >
            Đáp án
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
            Gỡ bỏ
          </el-button>
        </div>
      </div>
    </el-form>
    <m-form-dap-an
      :title="title"
      v-model="open"
      :data="dataAnswer"
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
    }
  },

  data: () => ({
    rules: {},
    form: {},
    open: false,
    title: '',
    dataAnswer: []
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
    ...mapActions('dapanCauHoi', ['queryDapAn']),

    initData () {
      this.form = {
        ...this.data
      }
    },

    onSave () {},

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
    }
  }
}
</script>

<style lang="scss">
.form-cau-hoi {
  width: 100%;

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
}
</style>