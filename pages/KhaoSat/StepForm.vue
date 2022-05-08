<template>
  <div class="step-form">
    <div class="step-form__container">
      <div class="step-form__banner step-form__item --border" />
      <box-form
        v-for="(item, index) in boxs"
        :key="index"
        class="step-form__item --border"
        v-bind="item"
        v-model="answer[index]"
      />  
      <div class="step-form__footer">
        <button
          v-if="stepActive > 0"
          @click="onBack"
          class="step-form__action"
        >
          Quay lại
        </button>
    
        <button
          @click="onNext"
          class="step-form__action"
        >
          Tiếp
        </button>
      </div>
    </div>

    <div class="step-form__flowing">
      <div
        class="step-form__item-flowing"
        v-for="({ label, id}, index) in LIST_LABEL"
        :key="index"  
      >
        <div class="step-form__title-flowing step-form__flowing-txt">
          {{ label }}
        </div>
        <div class="step-form__question-container">
          <div
            v-for="({ stt_cauhoi }, index) in listCauHoiByID(id)"
            :key="index"
            class="step-form__question-item step-form__flowing-txt"
          >
            {{ stt_cauhoi }}
          </div>
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

  name: 'StepForm',

  data: () => ({
    stepActive: 0,
    answer: [],
    answers: []
  }),

  computed: {
    ...mapState('cauHoi', ['list']),
    ...mapState('phienBanKhaoSat', ['data']),
    ...mapState('dapanCauHoi', ['dapan']),
    ...mapGetters('phanCauHoi', ['LIST_LABEL']),

    stepsCauHoi () {
      return this.$store.state.phanCauHoi.list.reduce((arr, key) => ([
        ...arr,
        [
          {
            title: key.ten_cauhoi,
            description: key.mota_cauhoi,
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
      return [
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
    },

    boxs() {
      return this.steps[this.stepActive] 
    }
  },

  watch: {
    stepActive (newData, oldData) {
      this.answer = this.answers[newData] || []
      console.log('watch', this.answer, this.answers)
    }
  },

  created () {
    Promise.all([
      this.fetchList(),
      this.fetchKhaoSat(),
      this.fetchListCauhoi(),
      this.fetchDapAn()
    ])
  },  

  methods: {
    ...mapActions('phanCauHoi', ['fetchList']),
    ...mapActions('cauHoi', ['fetchListCauhoi']),
    ...mapActions('phienBanKhaoSat', ['fetchKhaoSat']),
    ...mapActions('dapanCauHoi', ['fetchDapAn']),

    onNext () {
      this.updateAnswers()
      this.stepActive += 1
    },

    onBack () {
      this.updateAnswers()
      this.stepActive = this.stepActive === 0 ? 0 : (this.stepActive - 1)
    },

    updateAnswers () {
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
    }
  }
}
</script>

<style lang="scss">
  .step-form {
    background-color: rgba(234, 239, 233, 1);
    height: 100%;

    &__container {
      width: 33.68%;
      margin: auto;
    }

    &__banner {
      width: 100%;
      padding-top: 25%;
      background-image: url('@/assets/images/demo-step-form.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    &__item {
      margin: 12px 0;

      &.\--border {
        border: 1px solid #dadce0;
        border-radius: 8px;
      }
    }

    &__action {
      margin: 12px 0;
      padding: 9.5px 24px;
      background: #fff;
      color: rgb(87, 129, 76);
      font-size: 14px;
    }

    &__flowing {
      top: 150px;
      right: 150px;
      position: fixed;
      background: #fff;
      z-index: 999;
      width: 250px;
    }

    &__flowing-txt {
      padding: 5px;
    }

    &__title-flowing {
      display: block;
      width: 100%;
      background: #e2e2e2;
      padding-left: 25px;
    }

    &__question-container {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      border: 1px solid #e2e2e2;
    }

    &__question-item {
      border: 1px solid #e2e2e2;
      text-align: center;
      width: 20%;
      cursor: pointer;
      border-left: none;

      &.\--success {
        background-color: #0090a1;
        border-color: #0090a1;
        color: #fff;
      }
    }
  }
</style>