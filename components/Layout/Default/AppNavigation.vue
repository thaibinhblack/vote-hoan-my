<template>
  <v-navigation-drawer
    width="350"
    class="menuLeft"
    v-model="drawer"
    :clipped="$vuetify.breakpoint.lgAndUp"
    disable-resize-watcher
    :disable-route-watcher="true"
    app
  >
    <!-- Nếu user chưa đăng nhập show loging -->
    <div v-if="!authenticated">
      <v-list-item>
        <v-list-item-avatar>
          <!--            <img src="~static/img/user.png"/>-->
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Guest</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>

    <!-- User is logging -->
    <div v-else>
      <v-img  class="mt-4 mx-auto" contain max-width="300" max-height="120" :src="logoImage"/>
      <v-list-item three-line>
        <v-list-item-content class="ml-3">
          <v-list-item-title class="font-weight-medium">
            <v-menu offset-y :nudge-bottom="10">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark v-on="on">
                  {{ getDisplayName() }}
                  <v-icon right>mdi-arrow-down-drop-circle-outline</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="logout">
                  <v-list-item-title>
                    {{ $t("app.logout") }}
                  </v-list-item-title>
                  <v-list-item-icon>
                    <v-icon>lock</v-icon>
                  </v-list-item-icon>
                </v-list-item>
                <v-list-item @click="onClickOpenSelectLanguage">
                  <v-list-item-title>
                    {{ $t("languageSelect") }}
                  </v-list-item-title>
                  <v-list-item-icon>
                    <v-icon>mdi-flag-variant</v-icon>
                  </v-list-item-icon>
                </v-list-item>

                <v-list-item @click="onClickChangePassword">
                  <v-list-item-title>
                    {{ $t("changePassword") }}
                  </v-list-item-title>
                  <v-list-item-icon>
                    <v-icon>lock</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-title>
          <v-list-item-subtitle class="red--text subtitle-2">
            {{ getHospital() }}
          </v-list-item-subtitle>


        </v-list-item-content>
      </v-list-item>
    </div>

    <v-divider></v-divider>
    <ItemNav :tree-data="menuLeft"></ItemNav>

    <ChangeLanguage :dialog.sync="dialogLanguage"/>

    <DoiMatKhau
      :dataEdit="taiKhoan"
      :dialog.sync="dialogDoiMatKhau"
      v-if="dialogDoiMatKhau"
    />

  </v-navigation-drawer>
</template>

<script>
import {mapState} from "vuex";
import ItemNav from "~/components/Layout/Default/Navbar";
import notify from "devextreme/ui/notify";
import ChangeLanguage from "~/components/Base/ChangeLanguage";
import DoiMatKhau from "~/pages/HeThong/TaiKhoan/components/DoiMatKhau";

export default {
  name: "AppNavigation",
  components: {
    ItemNav,
    ChangeLanguage,
    DoiMatKhau
  },
  data() {
    return {
      appTitle: "APP",
      test: true,
      dialogLanguage: false,
      dialogDoiMatKhau: false,
      taiKhoan: null,
    };
  },
  computed: {
    logoImage: () => process.env.LOGO,
    ...mapState({
      menuLeft: state => state.menus,
    }),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit('SET_DRAWER', val);
      }
    }
  },
  methods: {
    onClickOpenSelectLanguage(e) {
      this.dialogLanguage = true;
    },
    onClickChangePassword(e) {
      console.log(this.user)

      if (this.user) {
        this.$services.auth.apiGetById(this.user.tai_khoan_id)
          .then(res => {
            this.taiKhoan = res.data.data;
            this.dialogDoiMatKhau = true;
          }).catch(err => {
            notify("Lỗi lấy thông tin tài khoản")
          }
        )
      }
    },
    async logout() {
      await this.$auth.logout();
      await this.$store.commit("setMenus", null);
      await this.$router.push("/");
    },
    getDisplayName() {
      if (this.user && this.user.nhan_vien_su_dung) {
        return this.user.nhan_vien_su_dung.ten_nhan_vien;
      }
      if (this.user && this.user.display_name) {
        return this.user.display_name;
      }
      return "Nhập thông tin";
    },
    getHospital() {
      if (this.user && this.user.hospital) {
        return this.user.hospital.name;
      }
      return "Nhập thông tin bệnh viện";
    }

  },

};
</script>
<style scoped>
a {
  color: white;
  text-decoration: none;
}

.menuLeft .a {
  font-size: 12px;
}
</style>
