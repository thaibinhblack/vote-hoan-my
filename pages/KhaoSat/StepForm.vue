<template>
  <div class="step-form">
    <div class="step-form__container">
      <div class="step-form__banner step-form__item --border" />
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="{
          'step-form__item-box': true,
          '--active': stepActive === index
        }"
      >
        <box-form
          v-for="(item, idx) in step"
          :key="idx"
          :class="['step-form__item --border', `index-${index}`]"
          :id="item.id"
          :data="item"
          v-bind="item"
          v-model="answers[index][idx]"
        />  
      </div>
      <div
        v-if="stepActive === (steps.length)"
        :class="{
          'step-form__item-box': true,
          '--active': stepActive === (steps.length)
        }"
      >
        <box-form
          :class="['step-form__item --border', `index-end`]"
          v-bind="dataEnd"
        />  
      </div>
       <div
        v-if="stepActive === (steps.length + 1)"
        :class="{
          'step-form__item-box': true,
          '--active': stepActive === (steps.length + 1)
        }"
      >
        <box-form
          :class="['step-form__item --border', `index-thank_you`]"
          v-bind="dataThankYou"
        />  
      </div>
      <div class="step-form__footer">
        <button
          v-if="stepActive > 0 && stepActive <= steps.length"
          @click="onBack"
          class="step-form__action"
        >
          Quay lại
        </button>
    
        <button
          @click="onNext"
          v-if="stepActive < steps.length"
          class="step-form__action"
        >
          Tiếp
        </button>

        <button
          @click="onSubmit"
          v-if="stepActive === steps.length && !check"
          class="step-form__action --success"
        >
          Nộp bài
        </button>
      </div>
    </div>

    <div class="step-form__flowing">
      <div
        class="step-form__item-flowing step-form__question-container"
        v-for="(box, index) in stepsCauHoi"
        :key="index"  
      >
        <div
          v-for="(item, idx) in box"
          :key="idx"
          :class="{
            'step-form__flowing-txt step-form__title-flowing': !item.stt,
            'step-form__question-item step-form__flowing-txt': item.stt,
            '--success': answers[index + 1][idx] && answers[index + 1][idx].value,
            '--warning': submit && !answers[index + 1][idx]
          }"
          @click="handleStep(index)"
        >
          <span
            v-if="item.stt"
          >
            {{ item.stt }}
          </span>
          <span v-else>
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BoxForm from './components/BoxForm.vue'
import {mapState, mapActions, mapGetters} from "vuex"

export default {
  components: {
    BoxForm
  },

  props: {
    data: {
      type: Object,
      default: () => ({})
    },

    phanCauHois: {
      type: Array,
      default: () => ({})
    },

    dapans: {
      type: Array,
      default: () => ([])
    },

    check: {
      type: Boolean,
      default: false
    },

    ketqua: {
      type: Array,
      default: () => ([])
    }
  },

  name: 'StepForm',

  data: () => ({
    stepActive: 0,
    answers: [],
    submit: false,
    send: false,
    dataEnd: {
      title: 'XIN CHÂN THÀNH CẢM ƠN',
      description: 'Xin chân thành cảm ơn Anh/Chị đã tham gia khảo sát, chúng tôi luôn sẵn sàng ghi nhận mọi ý kiến đóng góp của Anh/Chị. ',
      config: {
        title: {
          background: true,
        },
        description: {
          small: true
        }
      }
    }
  }),

  computed: {
    ...mapState('dapanCauHoi', ['dapan']),
    ...mapGetters(['user']),

    stepsCauHoi () {
      return this.phanCauHois.reduce((arr, key, idx) => ([
        ...arr,
        [
          {
            title: key.ten_phan_cau_hoi,
            description: key.mo_ta_phan_cau_hoi,
            label: key.gia_tri_phan_cau_hoi,
            config: {
              border: true,
              title: {
                background: true
              }
            }
          },
          ...key.cau_hois.reduce((arr, key_cau_hois) => ([
            ...arr,
            {
              cau_hoi_id: key_cau_hois.cau_hoi_id,
              stt: key_cau_hois.stt_cau_hoi,
              stt_cau_hoi: key_cau_hois.stt_cau_hoi,
              ten_cau_hoi: key_cau_hois.ten_cau_hoi,
              switch_cau_hoi: key_cau_hois.switch_cau_hoi,
              phien_ban_id: key.phien_ban_id,
              phan_cau_hoi_id: key.phan_cau_hoi_id,
              switch_phan_cau_hoi: key.switch_phan_cau_hoi,
              ten_phan_cau_hoi: key.ten_phan_cau_hoi,
              gia_tri_phan_cau_hoi: key.gia_tri_phan_cau_hoi,
              language: key.language,
              question: {
                number: key_cau_hois.stt_cau_hoi,
                title: key_cau_hois.ten_cau_hoi,
                answers: [
                  ...this.dapans.filter((item) => item.cau_hoi_id === key_cau_hois.cau_hoi_id)
                  .reduce((arr, key_dapan) => ([
                    ...arr,
                    {
                      switch_dap_an: key_dapan.switch_dap_an,
                      label: key_dapan.ten_dap_an,
                      value: key_dapan.dap_an_id,
                      value_dap_an: key_dapan.value_dap_an
                    }
                  ]), [])
                ]
              }
            }
          ]), [])
        ]
      ]), [])
    },

    steps () {
      const data =  [
        [
          {
            title: this.data.tieu_de_khao_sat || '',
            description: this.data.mo_ta_khao_sat || '',
            config: {
              border: true,
              title: {
                medium: true
              }
            }
          },
          {
            description: this.data.noi_dung_khao_sat
          },
        ],
        ...this.stepsCauHoi
      ]
      for(let i = 0; i < data.length; i++) {
        this.answers = [
          ...this.answers,
          []
        ]
      }
      return data
    },

    dataThankYou () {
      return {
        title: this.data.tieude_khaosat || '',
        description: 'Câu trả lời của bạn đã được ghi lại.',
        config: {
          border: true,
          title: {
            medium: true,
          }
        }
      }
    },

    boxs() {
      return this.steps[this.stepActive] 
    }
  },

  watch: {
    ketqua (data) {

      data.forEach((item, index) => {
        if (!this.answers[index + 1]) this.answers = [
          ...this.answers,
          []
        ]
        this.answers = [  
          ...this.answers.reduce((arr, key, idx) => {
            if ((index + 1) !== idx)  arr = [
              ...arr,
             [
              ...key
             ]
            ]
            else {
              arr = [ 
                ...arr,
                [
                  [],
                  ...item.cau_hois.reduce((arr, key) => ([
                    ...arr,
                    {
                      ...key,
                      label: key.ket_qua.ten_cau_hoi,
                      value: key.ket_qua.dap_an_id
                    }
                  ]), [])
                ]
              ]
            }
            return arr
          }, [])
        ]
      })
    },

    answers (data) {
      console.log('answers', data)
    }
  },

  created () {
    Promise.all([
      this.fetchListCauhoi(),
      this.fetchDapAn(),
      this.initData()
    ])
  },  

  methods: {
    ...mapActions('phanCauHoi', ['fetchPhanCauHoi']),
    ...mapActions('cauHoi', ['fetchListCauhoi']),
    ...mapActions('phienBanKhaoSat', ['fetchKhaoSatById']),
    ...mapActions('dapanCauHoi', ['fetchDapAn']),
    ...mapActions('ketQua', ['saveKetQua']),

    initData () {
      this.stepActive = 0
      this.submit = false
      this.send = false
    },

    onNext () {
      const max = this.steps.length
      this.stepActive = this.stepActive === max ? this.stepActive : (this.stepActive + 1)
    },

    onBack () {
      this.stepActive = this.stepActive === 0 ? 0 : (this.stepActive - 1)
    },

    updateAnswers () {
      console.log('update ', this.answer)
       this.answers = this.answers[this.stepActive]
      ? [
        ...this.answers.reduce((arr, key, index) => (
          [
            ...arr,
            index === this.stepActive ? this.answer : key
            
          ]
        ), [])
      ]
      : [
        ...this.answers,
        [
          ...this.answer
        ]
      ]
    },

    listCauHoiByID (id) {
      return this.list.filter((item) => item.phancauhoi_id === id)
    },

    handleSelected (id) {
      let tmp
      for (let index = 0; index < this.answers.length; index++) {
        const element = this.answers[index];
        tmp = element.find((item) => item.id === id)
        if(tmp) break
      }
      if (tmp) return true
      else {
        const check = this.answer.find((item) => item.id === id)
        return check ? true : false
      }
    },

    handleStep (index) {
      if (!this.send) this.stepActive = index + 1
    },

    onSubmit () {
      this.submit = true
      let answers = [
        ...this.answers
      ]
      let check = false

      this.stepsCauHoi.reduce((arr, key, index) => {
        for (let i = 1; i < key.length; i++) {
         check = answers[index + 1][i] ? check : true
        }

        arr = [
          ...arr,
          key
        ]
        return arr
      }, [])
      

      if (check) {
        this.$message({
          message: 'Chưa hoàn thành hết câu hỏi',
          type: 'warning'
        })
      } else {
        this.stepActive = (this.steps.length + 1)
        this.send = true
        const ketqua = answers.reduce((arr, key) => {
          if (key && key.length > 0) {
            arr = [
              ...arr,
              [
                ...key.filter((item) => item !== null)
              ]
            ]
          } else arr = [...arr]
          return arr
        }, [])
        
        const data = [
          ...this.phanCauHois.reduce((arr, key, index) => ([
            ...arr,
            {
              phan_cau_hoi_id: key.phan_cau_hoi_id,
              gia_tri_phan_cau_hoi: key.gia_tri_phan_cau_hoi,
              ten_phan_cau_hoi: key.ten_phan_cau_hoi,
              cau_hois: [
                ...key.cau_hois.filter((item) => item.phan_cau_hoi_id === key.phan_cau_hoi_id)
                .reduce((arr, cauhoi) => (
                  [
                    ...arr,
                    {
                      cau_hoi_id: cauhoi.cau_hoi_id,
                      ten_cau_hoi: cauhoi.ten_cau_hoi,
                      ket_qua: {
                        ...this.FilterKetQua(cauhoi.cau_hoi_id, index)
                      }
                    }
                  ]
                ), [])
              ]
            }
          ]), [])
        ]

        if (this.check) {
          this.$message({
            message: 'Bạn đã hoàn thành khảo sát không thể tiếp tục thao tác này!',
            type: 'warning'
          })
          return
        }

        this.$confirm("Bạn có muốn lưu lại kết quả?")
        .then(() => {
          this.saveKetQua({
            tai_khoan_id: this.user.tai_khoan_id,
            nhan_vien_id: this.user.nhan_vien_id,
            phien_ban_id: this.data.phien_ban_id,
            ket_qua: data,
            switch_phien_ban: this.data.switch_phien_ban,
            language: this.$i18n.localeProperties.code  
          }).then((res) => {
            this.$message({
              type: 'success',
              message: 'Cảm ơn bạn đã tham gia cuộc khảo sát này!'
            })
            this.$emit('submit')
          })  
          
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: 'Xin vui lòng kiểm tra lại kết quả!'
          })
          this.stepActive = 0
        })
      }
    },

    FilterKetQua (cau_hoi_id, index) {
      const ketqua = this.answers[index + 1].find((item) => item && item.cau_hoi_id === cau_hoi_id)
      if (ketqua) return {
        dap_an_id: ketqua.value,
        ten_dap_an: ketqua.label,
        value_dap_an: ketqua.value_dap_an,
        value_other: ketqua.value_other
      }
      return {}
    }
  }
}
</script>

<style lang="scss">
  @import './StepForm.scss';
</style>