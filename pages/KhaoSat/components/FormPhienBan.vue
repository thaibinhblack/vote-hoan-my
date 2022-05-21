<template>
  <div class="form-phien-ban">
    <el-form
      class="form-phien-ban__form-container"
      ref="form-phien-ban"
      :model="form"
      :rules="rules"
    >
      <div
        class="form-phien-ban__item"
      >
        <div class="row">
          <el-form-item
            class="col-12 col-md-4 col-xl-3"
            prop="tieude_khaosat"
            label="Tiêu đề"
          >
            <el-input
              v-model="form.tieude_khaosat"
              placeholder="Nhập tiêu đề khảo sát"
            />
          </el-form-item>

          <el-form-item
            class="col-12 col-md-4 col-xl-3"
            prop="status_khaosat"
            label="Trạng thái"
          >
            <el-select
              class="form-phien-ban__select"
              v-model="form.status_khaosat"
            >
              <el-option
                v-for="({ label, value }, index) in status"
                :key="index"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            class="col-12 col-md-4 col-xl-3"
            prop="url_khaosat"
            label="URL"
          >
            <el-input
              v-model="form.url_khaosat"
              placeholder="Nhập url khao sát"
            />
          </el-form-item>
        </div>

        <el-form-item
          label="Mô tả"
        >
          <el-input
            v-model="form.mota_khaosat"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </div>
      <div class="form-phien-ban__action">
        <el-button
          plain
          type="primary"
          @click="onSubmit"
        >
          <v-icon>
            mdi-content-save-outline
          </v-icon>
          Lưu lại
        </el-button>

        <el-button
          plain
          type="success"
          @click="onPreview"
        >
          <v-icon>
            mdi-eye
          </v-icon>
          Preview
        </el-button>

        <el-button
          plain
          type="danger"
          @click="onDelete"
        >
          <v-icon>
            mdi-delete
          </v-icon>
          Gỡ bỏ
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'

export default {
  name: 'FormPhienBan',

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    form: {},
    rules: {
      tieude_khaosat: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa nhập tiêu đề khảo sát'
        }
      ],
      url_khaosat: [
        {
          required: true,
          trigger: 'blur',
          message: 'Bạn chưa URL khảo sát'
        }
      ],
      status_khaosat: [
        {
          required: true,
          trigger: 'change',
          message: 'Bạn chưa chọn trạng thái'
        }
      ]
    }
  }),

  computed: {
    ...mapState('phienBanKhaoSat', ['status']),

    isUpdate () {
      return Object.entries(this.data).length > 0
    }
  },

  watch: {
    data () {
      this.initData()
    }
  },

  methods: {
    initData () {
      if (this.isUpdate) this.form = {
        ...this.data
      }
      else this.form = {}
    },

    onSubmit () {},

    onPreview () {},

    onDelete () {
      this.$confirm(`Bạn có muốn gỡ bỏ ${this.form.tieude_khaosat}?`)
      .then(() => {
        this.$emit('remove', this.form)
      })
    }
  }
}
</script>

<style lang="scss">
.form-phien-ban {
  &__form-container {
    padding: 15px;
    background-color: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    box-shadow: -1px 3px 5px #e2e2e2;
  }

  &__select {
    display: block;
    width: 100%;
  }
}
</style>