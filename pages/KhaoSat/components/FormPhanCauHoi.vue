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
            {{ language === 'vi' ? 'Phần' : 'Block' }} {{ form.giatri_cauhoi }}
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
          :label="language === 'vi'
            ? 'Mã phần câu hỏi'
            : 'Key block question'
          "
        >
          <el-input
            :placeholder="language === 'vi'
              ? 'Nhập mã phần câu hỏi'
              : 'Please input block question'
            "
            v-model="form.giatri_cauhoi"
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="ten_cauhoi"
          :label="language === 'vi'
            ? 'Tên phần câu hỏi'
            : 'Name block question'
          "
        >
          <el-input
            :placeholder="language === 'vi'
              ? 'Nhập tên phần câu hỏi'
              : 'Please input name block question'
            "
            v-model="form.ten_cauhoi"
          />
        </el-form-item>

        <el-form-item
          class="col-12 col-md-4 col-xl-3"
          prop="phanloai"
          :label="language === 'vi'
            ? 'Loại câu hỏi'
            : 'Type question'
          "
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
          :label="language === 'vi'
            ? 'Trạng thái câu hỏi'
            : 'Status question'
          "
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
        :label="language === 'vi'
          ? 'Mô tả câu hỏi'
          : 'Description question'
        "
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
        {{ 
          language === 'vi'
          ? 'Thông tin câu hỏi'
          : 'Info block question'
         }}

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
            :cauhoi="form"
            :language="language"
          />
          <div class="col-12 form-phan-cau-hoi__footer">
             <el-button
              class="form-phan-cau-hoi__btn-action"
              plain
              type="success"
              @click="onUpdate"
            >
              <v-icon>mdi-content-save-outline</v-icon>
              {{
                language === 'vi' ? 'Cập nhật' : 'Update'
              }}
            </el-button>

            <el-button
              class="form-phan-cau-hoi__btn-action"
              plain
              type="primary"
              @click="onNew"
            >
              <v-icon>mdi-plus</v-icon>
              {{ language === 'vi' ? 'Thêm mới' : 'Create new' }}
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
    },

    language: {
      type: String,
      default: 'vi'
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
      this.$confirm(`Bạn muốn gỡ bỏ ${this.data.ten_cauhoi}`)
      .then(() => {
        this.$emit('remove', this.data)
      })
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
    },

    onSubmit () {},

    onUpdate () {}
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
    margin: 15px 0;
  }

  &__question-cotnainer {
    display: block;
  }

  &__btn-action {
    i {
      font-size: 15px !important;
    }
  }

  &__footer {
    padding: 15px;
  }
}
</style>