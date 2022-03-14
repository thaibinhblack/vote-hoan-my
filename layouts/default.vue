<template>
  <div id='appRoot'>
    <template>
      <v-app id='inspire' className='app'>
        <!-- Page Header -->
        <Header/>
        <app-navigation/>
        <v-main>
          <div className='page-wrapper'>
            <nuxt/>
          </div>
        </v-main>
        <!-- Go to top -->
        <app-fab/>
        <!-- App Footer -->
      </v-app>
    </template>

    <dx-load-panel
      :visible.sync='loadingVisible'
      :show-indicator='true'
      :show-pane='true'
      :shading='true'
      :close-on-outside-click='false'
      shading-color='rgba(0,0,0,0.4)'
    />
  </div>

</template>

<script>
import {DxLoadPanel} from 'devextreme-vue/load-panel'
import Header from '~/components/Layout/Default/Header'
import AppNavigation from '~/components/Layout/Default/AppNavigation'
import AppFab from '~/components/Layout/Default/AppFab'

export default {
  components: {
    Header,
    AppNavigation,
    DxLoadPanel,
    AppFab
  },
  middleware: 'auth',
  computed: {
    loadingVisible() {
      return this.$store.state.isLoading
    }
  },

  async created() {
    const user = this.$auth.user
    if (user) {
      await this.$store.dispatch('getMenuLeftByPhanQuyenId', user.phan_quyen_id)
      await this.$store.commit('SET_CLIENT_ID', user.tai_khoan_id)
      await this.$store.dispatch('connect')
    }
  }
}
</script>

<style lang='css' scoped>
.setting-fab {
  top: 50% !important;
  right: 0;
  border-radius: 0;
}


.page-wrapper {
  min-height: calc(100vh - 64px - 50px - 81px);
  margin-bottom: 50px;
}


.app--footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
