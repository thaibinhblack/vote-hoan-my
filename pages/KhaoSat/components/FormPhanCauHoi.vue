<template>
  <div class="form-phan-cau-hoi">
    <div class="col-12">
      <div class="row">
        <div class="col-12 form-phan-cau-hoi__action">
          <button
            type="button"
            @click="onRemove"
            title="Gỡ bỏ"
          >
            <v-icon>mdi-delete</v-icon>
          </button>

          <button
            type="button"
            @click="onShowLayout"
            :title="titleShow"
          >
            <v-icon>{{ iconShowLayout }}</v-icon>
          </button>
        </div>

        <div class="col-12">
          <h3 class="form-phan-cau-hoi__title">
            Phần {{ form.giatri_cauhoi }}
          </h3>
        </div>
      </div>
    </div>

    <el-form
      v-if="showLayout"
      :model="form"
      :rules="rules"
      class="form-phan-cau-hoi__container"
    >
      <div class="row">
        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="giatri_cauhoi"
          label="Mã phần câu hỏi"
        >
          <el-input
            placeholder="Nhập mã phần câu hỏi"
            v-model="form.giatri_cauhoi"
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="ten_cauhoi"
          label="Tên phần câu hỏi"
        >
          <el-input
            placeholder="Nhập tên phần câu hỏi"
            v-model="form.ten_cauhoi"
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="phanloai"
          label="Loại câu hỏi"
        >
          <el-select
            class="form-phan-cau-hoi__select"
            v-model="form.phanloai"
          >
            <el-option
              v-for="({ label, value }, index) in types"
              :key="index"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="phanloai"
          label="Trạng thái câu hỏi"
        >
          <el-select
            class="form-phan-cau-hoi__select"
            v-model="form.status_cauhoi"
          >
            <el-option
              v-for="({ label, value }, index) in status"
              :key="index"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item
        label="Mô tả câu hỏi"
        prop="mota_cauhoi"
      >
        <el-input
          type="textarea"
          :rows="3"
          v-model="form.mota_cauhoi"
        />
      </el-form-item>
    </el-form>

    <div
      v-if="showLayout"
      class="col-12"
    >
      <h4 class="form-phan-cau-hoi__title">
        Thông tin câu hỏi

        <button
          type="button"
          @click="onShow"
        >
          <v-icon>
            {{ iconShow }}
          </v-icon>
        </button>
      </h4>

      <div class="form-phan-cau-hoi__question-cotnainer">
        <div class="row">
          <form-cau-hoi
            v-for="(item, index) in list"
            :key="index"
            :data="item"
          />
          <div class="col-12">
            <el-button
              class="form-phan-cau-hoi__btn-action"
              plain
              type="primary"
              @click="onNew"
            >
              <v-icon>mdi-plus</v-icon>
              Thêm mới
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'
import FormCauHoi from './FormCauHoi.vue'

export default {
  name: 'FormPhanCauHoi',

  components: {
    FormCauHoi
  },

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    form: {},
    rules: {},
    show: false,
    iconShow: 'mdi-chevron-down',
    list: [],
    titleShow: 'Đóng lại',
    showLayout: true,
    iconShowLayout: 'mdi-chevron-down'
  }),

  computed: {
    ...mapState('phanCauHoi', ['types', 'status'])
  },

  watch: {
    data (data) {
      this.form = {
        ...data
      }

      this.initData()
    }
  },

  methods: {
    ...mapActions('cauHoi', ['fetchCauhoi']),

    initData () {
      if (this.data.phan_cauhoi_id) {
        this.fetchCauhoi({
          phancauhoi_id: this.data.phan_cauhoi_id
        }).then((res) => {
          this.list = [
            ...res
          ]
        })
      }
    },

    onRemove () {
      this.$emit('remove', this.data)
    },

    onShow () {
      this.show = !this.show
    },

    onShowLayout () {
      this.showLayout = !this.showLayout
      this.iconShowLayout = this.showLayout ? 'mdi-chevron-down' : 'mdi-chevron-up'
    },

    onNew () {
      this.list = [
        ...this.list,
        {}
      ]
    }
  }
}
</script>

<style lang="scss">
.form-phan-cau-hoi {
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  margin-bottom: 15px;
  box-shadow: -1px 3px 5px #e2e2e2;
  background-color: #fff;

  &__container {
    padding: 15px;
  }

  &__select {
    display: block;
    width: 100%;
  }

  &__action {
    display: flex;
    align-items: center;
    justify-content: right;
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__question-cotnainer {
    display: block;
  }

  &__btn-action {
    i {
      font-size: 15px !important;
    }
  }
}
</style>