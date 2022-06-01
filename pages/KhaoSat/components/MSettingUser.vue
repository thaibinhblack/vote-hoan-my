<template>
  <div class="m-setting-user">
    <el-drawer
      :title="title"
      :visible.sync="value"
      class="m-form-dap-an"
      size="50%"
      @close="close"
    >
      <template #header>
        <div class="m-setting-user__header">
          {{ title }}
        </div>
      </template>

      <el-form class="m-setting-user__form">
        <el-form-item
          prop="benhvien_id"
          :label="$t('benhvien.label')"
        >
          <el-select
            class="m-setting-user__select"
            v-model="form.benhvien_id"
            multiple
          >
            <el-option
              v-for="({label, value}, index) in list_benhvien"
              :key="index"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <div
          v-for="(item, index) in list_benhvien_selected"
          :key="index"
          class="m-setting-user__benhvien"
        >
          <div class="m-setting-user__title">
            {{ item.label }}
          </div>
          <div class="m-setting-user__person">
            <group-user
              v-model="users[item.value]"
              :id="item.value"
            />
          </div>
        </div>
      </el-form>

      <div class="m-setting-user__footer">
        <el-button
          plain
          type="primary"
          @click="onSubmit"
        >
          {{ $t('action.save') }}
        </el-button>

        <el-button
          plain
          type="warning"
          @click="close"
        >
          {{ $t('action.close') }}
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'
import GroupUser from './GroupUserByBV.vue'

export default {
  name: 'MSettingUser',

  components: {
    GroupUser
  },

  props: {
    value: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    form: {},
    users: {}
  }),

  computed: {
    ...mapState('benhVien', ['list_benhvien']),

    list_benhvien_selected () {
      return this.form.benhvien_id
        ? this.list_benhvien.reduce((arr, key) => {
            const check = this.form.benhvien_id.find(id => id === key.value)
            if (check) arr = [
              ...arr,
              key
            ]
            else arr = [
              ...arr
            ]
            return arr
          }, [])
        : []
    }
  },

  watch: {
    'form.benhvien_id': {
      deep: true,
      handler(data) {
        let vm = this
        data.forEach(value => {
          vm.users = {
            ...vm.users,
            [value]: [
              ...vm.users[value] || []
            ]
          }
        })
      }
    }
  },

  methods: {
    close () {
      this.$emit('input', false)
    },

    onSubmit () {}
  }
}
</script>

<style lang="scss">
  @import './MSettingUser.scss';
</style>