<template>
  <div class="group-user">
    <el-checkbox-group
      class="group-user__container"
      v-model="selected"
    >
      <el-checkbox
        v-for="(item, index) in users"
        :label="item.user_id"
        :key="index"
      >
        {{item.fullname}}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import {
  mapActions
} from 'vuex'

export default {
  name: 'GroupUser',

  props: {
    value: {
      type: Array,
      default: () => ([])
    },

    id: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    loading: false,
    users: [],
  }),

  computed: {
    selected: {
      get () {
        return this.value
      },

      set (val) {
        this.$emit('input', val)
      }
    }
  },

  watch: {
    id (data) {
      this.fetchNhanVien(data)
    }
  },

  created () {
    this.fetchNhanVien(this.id)
  },

  methods: {
    ...mapActions('nhanVien', ['queryNhanVien']),

    fetchNhanVien (id) {
      this.loading = true
      this.queryNhanVien(id)
      .then((res) => {
        this.users = [
          ...res
        ]
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.group-user {
  &__container {
    padding: 15px 0;
  }
}
</style>