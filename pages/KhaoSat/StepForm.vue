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
          v-if="stepActive === steps.length"
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
import notify from "devextreme/ui/notify";

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
              id: key_cau_hois.cau_hoi_id,
              stt: key_cau_hois.stt_cau_hoi,
              question: {
                number: key_cau_hois.stt_cau_hoi,
                title: key_cau_hois.ten_cau_hoi,
                answers: [
                  ...this.dapans.filter((item) => item.cau_hoi_id === key_cau_hois.cau_hoi_id)
                  .reduce((arr, key) => ([
                    ...arr,
                    {
                      label: key.ten_dap_an,
                      value: key.dap_an_id
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
        notify({
          message: 'Chưa hoàn thành hết câu hỏi',
          top: true
        }, 'warning', 3000)
      } else {
        this.stepActive = (this.steps.length + 1)
        this.send = true
      }
    }
  }
}
</script>

<style lang="scss">
  @import './StepForm.scss';
</style>