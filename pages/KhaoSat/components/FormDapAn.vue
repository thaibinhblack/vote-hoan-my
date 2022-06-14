<template>
  <div class="form-dap-an">
    <el-form
      v-loading="loading"
      class="form-dap-an__container"
    >
      <div class="row">
        <div class="col-12 form-dap-an__action">
          <el-button
            class="form-dap-an__btn-action"
            small
            type="danger"
            plain
            @click="onRemove"
            title="Gỡ bỏ"
          >
            <v-icon>
              mdi-minus
            </v-icon>
          </el-button>
        </div>
        <el-form-item
          class="col-12 col-md-3 col-xl-2"
          prop="stt_dap_an"
          label="STT"
        >
          <el-input
            v-model="form.stt_dap_an"
            type="number"
            :min="1"
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="value_dap_an"
          label="Giá trị đáp án"
        >
          <el-input
            v-model="form.value_dap_an"
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="type_value_dap_an"
          label="Loại giá trị"
        >
          <el-select
            v-model="form.type_value_dap_an"
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
        prop="ten_dap_an"
        label="Tên đáp án"
      >
        <el-input
          type="textarea"
          v-model="form.ten_dap_an"
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
    value: {
      type: Object,
      default: () => ({})
    },

    data: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    form: {},
    loading: false
  }),

  computed: {
    ...mapState('dapanCauHoi', ['types']),
  },

  watch: {
    form: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },

  created () {
    this.initData()
  },

  methods: {
    initData () {
      this.form = {
        ...this.value
      }
    },

    onRemove () {
      this.loading = true
      this.$confirm(`Bạn có muốn gỡ bỏ đáp án ${this.form.ten_dap_an}?`)
      .then(() => {
        this.loading = false
        this.$emit('remove', this.form)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
  .form-dap-an {
    padding: 15px;
    border-bottom: 1px solid #e2e2e2;

    &__select {
      display: block;
      width: 100%;
    }

    &__action {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    &__btn-action {
      &.el-button {
        padding: 3px !important;
      }
    }
  }
</style>