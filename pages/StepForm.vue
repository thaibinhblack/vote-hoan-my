<template>
  <div
    v-loading="loading"
    class="step-form-khao-sat"
  >
    <div
      class="step-form-khao-sat__container"
    >
      <step-form
        :data="data"
        :phanCauHois="phanCauHois"
        :dapans="dapans"
        @submit="checkNhanVienKhaoSat"
        :check="checkUser"
        :ketqua="ketqua"
      />


      <div
        v-if="checkUser && !preview"
        class="step-form-khao-sat__modal"
      >
        <div
          class="step-form-khao-sat__not-foud"
        >
          <h3 v-if="Object.entries(ketqua).length === 0">
            Tài khoản của bạn chưa được tham gia khảo sát, Xin vui lòng liên hệ với bộ phận IT để được tham gia khảo sát!
          </h3>
          <h3 v-else>Bạn đã hoàn thành khỏa sát</h3>
        </div>
      </div>
    </div>

  </div>
</template>

 <script>
 import {
  mapGetters,
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
    dapans: [],
    loading: false,
    checkUser: false,
    ketqua: []
  }),

  computed: {
    ...mapGetters(['user']),

    preview () {
      return this.$route.query.preview
    }
  },

  created () {
    this.fetchPhienBanKhaoSat()
  },

  methods: {
    ...mapActions('phienBanKhaoSat', ['fetchKhaoSatById']),
    ...mapActions('phanCauHoi', ['fetchPhanCauHoi']),
    ...mapActions('dapanCauHoi', ['queryDapAn']),
    ...mapActions('NhanVienKhaoSat', ['checkPhienBan']),

    checkNhanVienKhaoSat () {
      this.loading = true
      this.checkPhienBan({
        tai_khoan_id: this.user.tai_khoan_id,
        phien_ban_id: this.data.phien_ban_id
      }).then((res) => {
        if (res.data.ket_qua_khao_sat.ket_qua_id === 0) {
          this.checkUser = false
        } else {
          this.checkUser = true
          this.ketqua = [
            ...res.data.ket_qua_khao_sat.ket_qua
          ]
        }

        this.loading = false
      })
      .catch(() => {
        this.$message({
          type: 'warning',
          message: `Tài khoản của bạn chưa được tham gia khảo sát phiên bản này!`
        })
        this.checkUser = false
        this.loading = false
      })
    },

    fetchPhienBanKhaoSat () {
      if (!this.$route.query.id) {
        this.$router.back()
      } else {
        this.loading = true
        this.fetchKhaoSatById({
          id: this.$route.query.id,
          language: this.$i18n.localeProperties.code
        })
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

          this.checkNhanVienKhaoSat()
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
  .page-wrapper {
    height: 100%;
  }
  .step-form-khao-sat {
    position: relative;
    height: 100%;
  
    &__modal {
      position: absolute;
      width: 350px;
      text-align: center;
      top: 50%;
      left: 50%;
      background-color: #fff;
      padding: 25px;
      transform: translate(-50%, -50%);
      border-radius: 10px;
      font-size: 22px;
      border: 1px solid #e2e2e2;
    }

    &__not-foud {
      padding: 50px;
      text-align: center;
      opacity: .8;
    }
  }
 </style>