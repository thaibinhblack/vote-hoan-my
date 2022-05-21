<template>
  <div class="form-dap-an">
    <el-form class="form-dap-an__container">
      <div class="row">
        <el-form-item
          class="col-12 col-md-3 col-xl-2"
          prop="stt_dapan"
          label="STT"
        >
          <el-input
            v-model="form.stt_dapan"
            type="number"
            :min="1"
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="value_dapan"
          label="Giá trị đáp án"
        >
          <el-input
            v-model="form.value_dapan"
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="value_dapan"
          label="Loại giá trị"
        >
          <el-select
            v-model="form.type_value_dapan"
            class="form-dap-an__select"
          >
            <el-option
              v-for="({ label, value }, index) in types"
              :key="index"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item
        prop="ten_dapan"
        label="Tên đáp án"
      >
        <el-input
          type="textarea"
          v-model="form.ten_dapan"
          :rows="3"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'

export default {
  name: 'FormDapAn',
  
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    form: {}
  }),

  computed: {
    ...mapState('dapanCauHoi', ['types']),
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
    initData () {
      this.form = {
        ...this.data
      }
    }
  }
}
</script>

<style lang="scss">
  .form-dap-an {
    padding: 15px;

    &__select {
      display: block;
      width: 100%;
    }
  }
</style>