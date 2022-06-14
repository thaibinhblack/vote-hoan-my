<template>
  <div
    v-loading="loading"
    class="step-form-khao-sat"
  >
    <step-form
      v-if="data.status_khao_sat === 1"
      :data="data"
      :phanCauHois="phanCauHois"
      :dapans="dapans"
    />

    <div
      v-else
      class="step-form-khao-sat__modal"
    >
      Phiên bản khảo sát đã ngưng hoạt động
    </div>
  </div>
</template>

 <script>
 import {
  mapActions
 } from 'vuex'

 import StepForm from '@/pages/KhaoSat/StepForm.vue'

 export default {
  name: 'StepFormKhaoSat',

  components: {
    StepForm
  },

  middleware: "auth",

  data: () => ({
    data: {},
    phanCauHois: [],
    dapans: []
  }),

  created () {
    this.fetchPhienBanKhaoSat()
  },

  methods: {
    ...mapActions('phienBanKhaoSat', ['fetchKhaoSatById']),
    ...mapActions('phanCauHoi', ['fetchPhanCauHoi']),
    ...mapActions('dapanCauHoi', ['queryDapAn']),

    fetchPhienBanKhaoSat () {
      if (!this.$route.query.id) {
        this.$router.back()
      } else {
        this.loading = true
        this.fetchKhaoSatById(this.$route.query.id)
        .then((res) => {
          this.data = {
            ...res
          }
          this.fetchPhanCauHoi({
            phien_ban_id: res.phien_ban_id
          }).then((res) => {
            this.phanCauHois = [
              ...res.data
            ]
          })

          this.queryDapAn({
            phien_ban_id: res.phien_ban_id
          }).then((res) => {
            this.dapans = [
              ...res.data
            ]
          })
          this.loading = false
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: this.$t('error.server')
          })
          this.loading = false
          this.$router.back()
        })
      }
    }
  }
 }
 </script>

 <style lang="scss">
  .step-form-khao-sat {
    position: relative;
  
    &__modal {
      position: absolute;
      width: 350px;
      text-align: center;
      top: 50%;
      left: 50%;
      background-color: #fff;
      padding: 100px 50px;
      transform: translate(-50%, -50%);
      border-radius: 10px;
      font-size: 22px;
      border: 1px solid #e2e2e2;
    }
  }
 </style>