<template>
  <div
    v-bind="$attrs"
    class="box-form"
  >
    <div v-if="config.border" class="box-form__border-top"></div>
    <div class="box-form__container">
      <div
        v-if="title"
        :class="{
          'box-form__title': true,
          '--background': configTitle.background || false,
          '--medium': configTitle.medium || false,
        }"
      >
        {{ title }}
      </div>

      <div
        v-if="description"
        :class="{
          'box-form__description': true,
          '--has-top': configTitle.background || false,
          '--heading': configDescription.heading || false,
          '--small': configDescription.small || false
        }"
      >
        <span v-html="description"></span>
      </div>

      <div
        v-if="showQuestion"
        class="box-form__question"
      >
        <div class="box-form__question-title">
          <span class="box-form__number-question">
            {{ question.number }}.
          </span>

          {{ question.title }}
        </div>

        <ul class="box-form__list-answer">
           <v-radio-group v-model="answer">
            <v-radio
              class="box-form__item-radio"
              v-for="(answer, index) in question.answers"
              :key="index"
              :label="answer.label"
              :value="answer.value"
              :title="answer.label"
            ></v-radio>
          </v-radio-group>
        </ul>

        <div class="box-form__remove-answer">
          <span
            v-if="value !== null"
            @click="onRemove"
            class="box-form__btn-remove"
          >
            Xóa lựa chọn
          </span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'BoxForm',

  props: {
    value: {
      default: null
    },
    config: {
      type: Object,
      default: () => ({
        title: {},
        description: {},
        border: false
      })
    },

    title: {
      type: String,
      default: ''
    },

    description: {
      type: String,
      default: ''
    },

    question: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    configTitle () {
      return this.config.title || false
    },

    configDescription () {
      return this.config.description || false
    },

    answer: {
      get () {
        return this.value
      },

      set (value) {
        this.$emit('input', value)
      }
    },

    showQuestion () {
      return this.question ? (Object.entries(this.question).length > 0) : false
    }
  },

  methods: {
    onRemove () {
      this.$emit('input', null)
    }
  }
}
</script>


<style lang="scss">
  .box-form {
    background-color: #fff;
    padding: 24px;
    padding-top: 22px;
    position: relative;
    overflow: hidden;

    &__number-question {
      padding-right: 20px;
    }

    &__border-top {
      background-color: rgb(116, 149, 109);
      position: absolute;
      width: 100%;
      height: 10px;
      top: -1px;
      left: -1px;
    }
  
    &__title {
      font-size: 16px;
      font-weight: bold;
      letter-spacing: .1px;
      line-height: 24px;
      color: #202124;
      
      &.\--medium {
        font-size: 32px;
        line-height: 135%;
      }

      &.\--background {
        background-color: rgb(116, 149, 109);
        color: rgba(255, 255, 255, 1);
        position: absolute;
        top: -1px;
        left: -1px;
        padding: 12px 24px;
        width: 100%;
        font-weight: normal;
      }
    }

    &__description {
      font-size: 14px;
      font-weight: 400;
      letter-spacing: .2px;
      line-height: 20px;
      color: #202124;
      margin-top: 12px;

      &.\--heading {
        font-size: 16px;
        font-weight: 500;
        letter-spacing: .1px;
        line-height: 24px;
      }

      &.\--small {
        font-size: 12px;
        font-weight: 400;
        letter-spacing: .3px;
        line-height: 135%;
      }

      &.\--has-top {
        margin-top: 48px;
      }
    }

    &__list-answer {
      padding: 0 !important;
    }

    &__question-title {
      font-size: 16px;
      letter-spacing: .1px;
      line-height: 24px;
      color: #202124;
      font-weight: 400;
    }

    &__item-radio {
      & * {
        font-size: 14px;
        font-weight: 400;
        letter-spacing: .2px;
        line-height: 20px;
        color: #202124;
        min-width: 1px;
      }
    }

    &__remove-answer {
      min-height: 36px;
      display: flex;
      width: 100%;
      justify-content: right;
    }

    &__btn-remove {
      cursor: pointer;
      color: #5f6368;
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: .25px;
      line-height: 36px;
    }
  }
</style>