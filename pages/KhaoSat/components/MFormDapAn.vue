<template>
  <el-drawer
    v-loading="loading"
    :title="title"
    :visible.sync="value"
    class="m-form-dap-an"
    size="50%"
    :before-close="handleClose"
    :close-on-press-escape="false"
  >
    <div class="m-form-dap-an__content">
      <form-dap-an
        v-for="(item, index) in form"
        :key="index"
        :data="item"
        v-model="form[index]"
        @remove="handleRemove($event, index)"
      />
    </div>

    <div class="col-12 m-form-dap-an__action-cotnainer">
      <el-button
        v-if="language === 'vi'"
        type="primary"
        plain
        @click="onPlus"
      >
        Thêm mới
      </el-button>

      <el-button
        type="primary"
        plain
        @click="onSubmit"
      >
        Lưu lại
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import FormDapAn from './FormDapAn.vue'
import {
  mapActions
} from 'vuex'

export default {
  name: 'MKhaoSatDetail',

  components: {
    FormDapAn
  },

  props: {
    value: {
      type: Boolean,
      default: false
    },

    language: {
      type: String,
      default: 'vi'
    },

    title: {
      type: String,
      default: ''
    },

    data: {
      type: Array,
      default: () => ([])
    },

    cauhoi: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    rules: {},
    form: [],
    loading: false
  }),

  watch: {
    value (data) {
      if (data) {
        this.initData()
      } else {
        // this.$refs['form-khao-sat'].clear()
      }
    }
  },

  methods: {
    ...mapActions('dapanCauHoi', ['createDapAn', 'updateDapAn', 'queryDapAn', 'deleteDapAn']),

    close () {
      this.$emit('input', false)
    },

    initData () {
      this.loading = true
      this.queryDapAn({
        cau_hoi_id: this.cauhoi.cau_hoi_id
      }).then((res) => {
        this.form = [
          ...res.data
        ]
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

    onPlus () {
      this.form = [
        ...this.form,
        {
          cau_hoi_id: this.cauhoi.cau_hoi_id,
          switch_cau_hoi: this.cauhoi.switch_cau_hoi,
          phien_ban_id: this.cauhoi.phien_ban_id,
          switch_phien_ban: this.cauhoi.switch_phien_ban
        }
      ]
      this.$emit('submit', this.form.length)
    },

      async onSubmit () {
      this.loading = true
      await this.form.forEach(async (item, index) => {
        if(item.dap_an_id) {
          await this.onUpdate(item)
        } else {
          await this.onCreate(item, index)
        }
      })
      this.loading = false
    },

    onCreate (data, index) {
      this.loading = true
      data = {
        ...data,
        stt_dap_an: parseInt(data.stt_dap_an),
        value_dap_an: parseInt(data.value_dap_an)
      }
      this.createDapAn(data).then((res) => {
        this.$message({
          type: 'success',
          message: `Cài đặt đáp án ${data.ten_dap_an} thành công!`
        })
        this.form = [
          ...this.form.reduce((arr, key, idx) => ([
            ...arr,
            {
              ...key,
              dap_an_id: index === idx ? res.data.dap_an_id : key.dap_an_id
            }
          ]), [])
        ]
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
      this.loading = true
      data = {
        ...data,
        stt_dap_an: parseInt(data.stt_dap_an),
        value_dap_an: parseInt(data.value_dap_an)
      }
      this.updateDapAn(data).then(() => {
        this.$message({
          type: 'success',
          message: `Cập nhật đáp án ${data.ten_dap_an} thành công!`
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

    handleClose () {
      this.close()
    },


    handleRemove (data, idx) {
      const dapan = this.form.find((item, index) => index === idx)

      if (dapan) {
        if (dapan.dap_an_id) {
          this.deleteDapAn(dapan.dap_an_id).then((res) => {
            this.form = [
              ...this.form.filter((item, index) => index !== idx)
            ]
            this.$message({
              type: 'success',
              message: `Gỡ bỏ đáp án ${dapan.ten_dap_an} thành công!`
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning',
              message: this.$t('error.server')
            })
          })
        } else {
          this.form = [
            ...this.form.filter((item, index) => index !== idx)
          ]
        }
      }
    }

  }
}
</script>

<style lang="scss">
.m-form-dap-an {
  &__content {
    height: calc(100% - 70px);
    max-height: calc(100% - 60px);
    overflow: hidden scroll;
  }

  &__action {
    border-top: 1px solid #e2e2e2;
    position: absolute;
    background-color: #fff;
    padding: 15px;
    left: 0;
    bottom: 0;
  }

  .el-drawer__body {
    overflow: hidden;
  }
}
</style>