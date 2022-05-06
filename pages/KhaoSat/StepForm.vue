<template>
  <div class="step-form">
    <div class="step-form__container">
      <div class="step-form__banner step-form__item --border" />
      <box-form
        v-for="(item, index) in boxs"
        :key="index"
        class="step-form__item --border"
        v-bind="item"
        v-model="steps[stepActive][index].answer"
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
  </div>
</template>

<script>
import BoxForm from './components/BoxForm.vue'

export default {
  components: {
    BoxForm
  },

  name: 'StepForm',

  data: () => ({
    steps: [
      [
        {
          title: 'BÌNH CHỌN VÌ AN TOÀN  - VOTE FOR SAFETY (Phiên bản 2) - HMSG',
          description: 'Bản dịch được sự cho phép của Tổ chức AHRQ tại Mỹ (the United States Agency for Healthcare Research and Quality',
          config: {
            border: true,
            title: {
              medium: true
            }
          }
        },
        {
          description: 'Bình chọn này nhằm thăm dò ý kiến của bạn về các vấn đề an toàn của người bệnh, sự cố và báo cáo sự cố tại Khoa/Phòng/ Đơn vị và Bệnh viện/Phòng khám của Anh/Chị. Để hoàn thành bình chọn này, Anh/Chị chỉ mất khoảng 10-15 phút. Nếu một câu hỏi không áp dụng đối với Khoa/Phòng/Đơn vị hoặc Bệnh viện/Phòng khám của Anh/Chị hoặc Anh/Chị không biết câu trả lời, vui lòng chọn “Không áp dụng hoặc không biết”.',
          config: {
            description: {
              heading: true
            }
          }
        },
        {
          title: 'Định nghĩa',
          description: '<li>“An toàn người bệnh”: được định nghĩa là sự phòng ngừa và tránh khỏi những tổn thương cho người bệnh do quá trình chăm sóc sức khỏe gây ra.</li><li>“Sự cố an toàn người bệnh” được định nghĩa là bất kỳ loại lỗi liên quan đến chăm sóc sức khỏe, nhầm lẫn hoặc sự cố, bất kể điều đó có gây hại hay không.</li>',
          config: {
            description: {
              small: true
            }
          }
        }
      ],
      [
        {
          title: 'VỊ TRÍ CÔNG VIỆC CỦA ANH/CHỊ',
          description: 'Lưu ý: Con số đứng trước mỗi chức danh trong câu trả lời bên dưới được hiểu là mã số qui ước dựa trên phiên bản của tổ chức AHRQ',
          config: {
            title: {
              background: true
            },
            description: {
              small: true
            }
          }
        },
        {
          question: {
            number: 1,
            title: 'Tại khoa/phòng/đơn vị của tôi, mọi người làm việc nhóm cùng nhau hiệu quả.',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 2,
            title: 'Tại khoa/phòng/đơn vị của tôi, có đủ người để xử lý khối lượng công việc.',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 3,
            title: 'Nhân viên trong khoa/phòng/đơn vị của tôi phải làm việc nhiều thời gian hơn qui định để có thể chăm sóc người bệnh tốt nhất.',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 4,
            title: 'Khoa/phòng/đơn vị của tôi thường xuyên xem xét các quy trình làm việc nhằm xác định vấn đề cần thay đổi để cải thiện an toàn cho người bệnh.',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 5,
            title: 'Khoa/phòng/đơn vị của tôi phụ thuộc quá nhiều vào nhân viên hợp tác, bán thời gian, thời vụ',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 6,
            title: 'Trong khoa/phòng/đơn vị của tôi, nhân viên cảm thấy sai sót của họ là bằng chứng chống đối lại họ.',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 7,
            title: 'Khi có một sự cố được báo cáo trong khoa/phòng/đơn vị của tôi, một cá nhân có liên quan sự cố sẽ được nhắc nhở chứ không phải một vấn đề được nêu ra để phân tích nguyên nhân vì sao sự cố xảy ra.',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 8,
            title: 'Nhân viên trong khoa/phòng/đơn vị của tôi giúp đỡ lẫn nhau khi bận rộn',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 9,
            title: 'Những người làm việc trong khoa/phòng/đơn vị của tôi có hành vi thiếu tôn trọng người khác.  ',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 10,
            title: 'Khi nhân viên mắc sai sót, khoa/phòng/đơn vị của tôi tập trung vào việc học hỏi/rút kinh nghiệm được gì từ sự cố này hơn là đổ lỗi cho một người nào đó.',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 11,
            title: 'Cường độ làm việc tại khoa/phòng/đơn vị của tôi gấp rút nên ảnh hưởng tiêu cực đến sự an toàn của người bệnh.',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 12,
            title: 'Tại khoa/phòng/đơn vị của tôi, sau khi thực hiện các thay đổi để cải tiến an toàn người bệnh, có tiến hành đánh giá lại hiệu quả của các can thiệp thay đổi.',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 13,
            title: 'Nhân viên ở khoa/phòng/đơn vị của tôi khi có liên quan đến sai sót về an toàn người bệnh không được nhận hỗ trợ.',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        },
        {
          question: {
            number: 14,
            title: 'Khoa/phòng/đơn vị của tôi để các vấn liên quan đến an toàn người bệnh tương tự tiếp tục xảy ra.',
            answers: [
              {
                label: 'Rất không đồng ý',
                value: 9
              },
              {
                label: 'Không đồng ý',
                value: 3,
              },
              {
                label: 'Đồng ý',
                value: 2
              },
              {
                label: 'Rất đồng ý',
                value: 1
              },
              {
                label: 'Không áp dụng hoặc không biết',
                value: 0
              }
            ]
          }
        }
      ]
    ],
    stepActive: 0,
  }),

  computed: {
    boxs() {
      return this.steps[this.stepActive] 
    }
  },

  methods: {
    onNext () {
      this.stepActive += 1
    },

    onBack () {
      this.stepActive = this.stepActive === 0 ? 0 : (this.stepActive - 1)
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
  }
</style>