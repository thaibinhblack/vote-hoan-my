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
    ...mapState('cauHoi', ['list']),
    ...mapState('phienBanKhaoSat', ['data']),
    ...mapState('dapanCauHoi', ['dapan']),
    ...mapGetters('phanCauHoi', ['LIST_LABEL']),

    stepsCauHoi () {
      return this.$store.state.phanCauHoi.list.reduce((arr, key, idx) => ([
        ...arr,
        [
          {
            title: key.ten_cauhoi,
            description: key.mota_cauhoi,
            label: key.giatri_cauhoi,
            config: {
              border: true,
              title: {
                background: true
              }
            }
          },
          ...this.list.filter((item) => item.phancauhoi_id === key.phan_cauhoi_id).reduce((arr, key) => ([
            ...arr,
            {
              id: key.cauhoi_id,
              stt: key.stt_cauhoi,
              question: {
                number: key.stt_cauhoi,
                title: key.ten_cauhoi,
                answers: [
                  ...this.dapan.filter((item) => item.cauhoi_id === key.cauhoi_id).reduce((arr, da) => ([
                    ...arr,
                    {
                      label: da.ten_dapan,
                      value: da.value_dapan
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
            title: this.data.tieude_khaosat || '',
            description: this.data.mota_khaosat || '',
            config: {
              border: true,
              title: {
                medium: true
              }
            }
          },
          {
            description: 'Bình chọn này nhằm thăm dò ý kiến của bạn về các vấn đề an toàn của người bệnh, sự cố và báo cáo sự cố tại Khoa/Phòng/ Đơn vị và Bệnh viện/Phòng khám của Anh/Chị. Để hoàn thành bình chọn này, Anh/Chị chỉ mất khoảng 10-15 phút. Nếu một câu hỏi không áp dụng đối với Khoa/Phòng/Đơn vị hoặc Bệnh viện/Phòng khám của Anh/Chị hoặc Anh/Chị không biết câu trả lời, vui lòng chọn “Không áp dụng hoặc không biết”.'
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
      this.fetchList(),
      this.fetchKhaoSat(),
      this.fetchListCauhoi(),
      this.fetchDapAn(),
      this.initData()
    ])
  },  

  methods: {
    ...mapActions('phanCauHoi', ['fetchList']),
    ...mapActions('cauHoi', ['fetchListCauhoi']),
    ...mapActions('phienBanKhaoSat', ['fetchKhaoSat']),
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