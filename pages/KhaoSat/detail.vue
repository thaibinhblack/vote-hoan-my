<template>
  <div class="detail-khao-sat">
    <el-tabs
      class="detail-khao-sat__tab"
      v-model="tabActive"
    >
      <el-tab-pane
        label="Tiếng việt"
        id="vi"
        name="vi"
      >
        <div class="detail-khao-sat__container">
          <div class="col-12 detail-khao-sat__info">
            <h3 class="detail-khao-sat__title"> Thông tin: </h3>
            <form-phien-ban
              :data="form"
              @remove="onDelete"
            />
          </div>

          <div class="col-12 detail-khao-sat__intro-phan-cau-hoi">
            <h3 class="detail-khao-sat__title">
              Phần câu hỏi:
            </h3>

            <ul class="detail-khao-sat__list-phan-cau-hoi">
              <li
                v-for="(item, index) in dataPhanCauHoi"
                :key="index"
                :class="{
                  'detail-khao-sat__item-phan-cau-hoi': true,
                  '--active': item.gia_tri_phan_cau_hoi === activePhanCauHoi
                }"
                @click="handleTabPhanCauHoi(item)"
              >
                {{ item.gia_tri_phan_cau_hoi }}
                <span class="detail-khao-sat__sup">
                  {{ item.cau_hois ? item.cau_hois.length : 0 }}
                </span>
              </li>

              <li
                :class="{
                  'detail-khao-sat__item-phan-cau-hoi --icon': true,
                }"
                @click="addPhanCauHoi()"
              >
                <v-icon>mdi-plus</v-icon>
              </li>
            </ul>
          </div>

          <div class="col-12">
            <form-phan-cau-hoi
              v-for="(item, index) in dataPhanCauHoi"
              v-model="dataPhanCauHoi[index]"
              :key="index"
              :data="item"
              :phienban="form"
              :language="tabActive"
              @remove="onRemove($event, index)"
              :class="{
                'detail-khao-sat__form-phan-cau-hoi': true,
                '--active': item.gia_tri_phan_cau_hoi === activePhanCauHoi
              }"
            />
          </div>
        </div>
      </el-tab-pane>
       <el-tab-pane
        label="English"
        id="en"
        name="en"
      >
        <div class="detail-khao-sat__container">
          <div class="col-12">
            <h3 class="detail-khao-sat__title"> Info: </h3>
            <form-phien-ban
              :data="form"
              @remove="onDelete"
              language="en"
            />
          </div>

          <div class="col-12">
            <h3 class="detail-khao-sat__title">
              Questions:
            </h3>

            <form-phan-cau-hoi
              v-for="(item, index) in dataPhanCauHoi"
              :key="index"
              :data="item"
              language="en"
              @remove="onRemove"
            />

          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>  
</template>

<script>
import {
  mapActions
} from 'vuex'
import FormPhanCauHoi from './components/FormPhanCauHoi.vue'
import FormPhienBan from './components/FormPhienBan.vue'

export default {
  name: 'DetailKhaoSat',

  components: {
    FormPhanCauHoi,
    FormPhienBan
  },

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
      ]
    },
    dataPhanCauHoi: [],
    tabActive: 'vi',
    activePhanCauHoi: null
  }),

  watch: {
    tabActive() {
      this.initData(this.form.switch_phien_ban)
    },

    '$route' () {
      this.initData(this.$route.query.id)
    },

    dataPhanCauHoi: {
      deep: true,
      handler(data) {
        this.handleTabPhanCauHoi(data[data.length - 1])
      }
    }
  },

  created () {
    this.initData(this.$route.query.id)
  },

  methods: {
    ...mapActions('phanCauHoi', ['fetchPhanCauHoi']),
    ...mapActions('phienBanKhaoSat', ['handleDelete', 'fetchKhaoSatById']),

    initData (id) {
      this.loading = true
      this.fetchKhaoSatById({
        id: id,
        language: this.$i18n.localeProperties.code
      })
      .then((res) => {
        this.form = {
          ...res
        }
        this.tabActive = this.form.language
        this.getPhanCauHoi()
      }).catch((err) => {
        console.log('fetchKhaoSatById', err)
        this.$message({
          type: 'warning',
          message: 'Phiên bản không tồn tại, hoặc đã tạm ngưng hoạt động!'
        })
        this.$router.back()
      })
      
    },

    onRemove (data, idx) {
      this.dataPhanCauHoi = [
        ...this.dataPhanCauHoi.filter((item, index) => index !== idx)
      ]
    },

    onDelete (data) {
      this.handleDelete(data)
      .then((res) => {
        this.$router.back()
      })
    },

    getPhanCauHoi () {
      this.fetchPhanCauHoi({
        phien_ban_id: this.form.phien_ban_id,
        language: this.form.language
      }).then((res) => {
        this.dataPhanCauHoi = [
          ...res.data
        ]
      }).catch((err) => {
        console.log('fetchPhanCauHoi', err)
        this.$message({
          type: 'warning',
          message: this.$t('error.server')
        })
      })
    },

    addPhanCauHoi () {
      const active = this.dataPhanCauHoi[this.dataPhanCauHoi.length - 1].gia_tri_phan_cau_hoi
      if(active) {
        this.dataPhanCauHoi = [
        ...this.dataPhanCauHoi,
          {
            language: this.tabActive,
            phien_ban_id: this.form.phien_ban_id,
            status_phan_cau_hoi: 1
          }
        ]
      } else {
        this.activePhanCauHoi = active
        this.$message({
          type: 'warning',
          message: 'Bạn chưa lưu phần câu hỏi này!'
        })
      }
    },

    handleTabPhanCauHoi (data) {
      this.activePhanCauHoi = data.gia_tri_phan_cau_hoi
    }
  }

}
</script>

<style lang="scss">
  .detail-khao-sat {
    &__title {
      padding: 15px 0;
    }

    &__select {
      display: block;
      width: 100%;
    }

    .el-input__suffix {
      height: 40px;
      top: unset;
      bottom: 0;
    }

    &__tab {
      padding: 0 15px;
    }

    &__footer {
      padding: 15px;
    }

    &__info {
      padding: 15px 0;
    }

    &__intro-phan-cau-hoi {
      display: flex;
      align-items: center;
    }

    &__list-phan-cau-hoi {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    &__item-phan-cau-hoi {
      list-style: none;
      width: 30px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #e2e2e2;
      background-color: #fff;
      text-align: center;
      border-radius: 50%;
      font-size: 13px;
      margin: 5px;
      cursor: pointer;
      position: relative;

      &:hover, &.\--active {
        background-color: #ccecff;
        color: #333;

        .detail-khao-sat__sup {
          background-color: #fff;
        }
      }

      &.\--icon {
        i {
          font-size: 13px;
        }
      }
    }

    &__form-phan-cau-hoi   {
      display: none;

      &.\--active {
        display: block;
      }
    }

    &__sup {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #ccecff;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      border: 1px solid #e2e2e2;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      font-size: 11px;
    }
  }
</style>