<template>
  <v-app-bar app dense>
    <v-toolbar-title>
      <v-app-bar-nav-icon @click="toggleDrawer"/>
      <v-btn @click="CloseDrawer" color="primary" class="hidden-sm-and-down" dark :to="localePath('/')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-toolbar-title>
    <v-toolbar-title class="ml-5 headline">
      {{ titlePage }}
    </v-toolbar-title>

    <v-spacer/>

    <div v-if="!authenticated" class="hidden-sm-and-down">
      <v-btn @click="CloseDrawer" dark :to="localePath('/login')">
        Login
        <v-icon right>mdi mdi-login</v-icon>
      </v-btn>
    </div>
    <div v-else class="hidden-sm-and-down ml-3">
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

    </div>
    <div class="hidden-md-and-up">
      <div v-if="!authenticated">
        <v-btn @click="CloseDrawer" dark :to="localePath('/login')">
          Login
          <v-icon right>mdi mdi-login</v-icon>
        </v-btn>
      </div>
    </div>
    <ChangeLanguage :dialog.sync="dialogLanguage"/>

    <DoiMatKhau
      :dataEdit="taiKhoan"
      :dialog.sync="dialogDoiMatKhau"
      v-if="dialogDoiMatKhau"
    />

  </v-app-bar>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import ItemNav from "~/components/Layout/Default/Navbar";
import ChangeLanguage from "~/components/Base/ChangeLanguage";
import DoiMatKhau from "~/pages/HeThong/TaiKhoan/components/DoiMatKhau";
import notify from "devextreme/ui/notify";

export default {
  components: {
    DoiMatKhau,
    ChangeLanguage,
    ItemNav
  },
  data() {
    return {
      appTitle: "HM APP",
      dialogLanguage: false,
      dialogDoiMatKhau: false,
      taiKhoan: null,
    };
  },

  computed: {
    ...mapState({
      menuLeft: state => state.menu.menuTop,
      titlePage: state => state.titlePage,
      // drawer: state => state.drawer
    }),
    leftDrawer: {
      // getter
      get: function () {
        return this.$store.state.drawer;
      },
      // setter
      set: function (newValue) {
        this.$store.commit("SET_DRAWER", newValue);
      }
    }
  },
  methods: {
    ...mapMutations([
      'toggleDrawer'
    ]),
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
      await this.$store.dispatch("getMenuLeftByPhanQuyenId", null);
      await this.$store.dispatch("dangXuat", {root: true});
      await this.$router.push(this.localePath('/login'));
    },
    CloseDrawer() {
      this.$store.commit("SET_DRAWER", false);
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
  },
  props: {
    source: String
  }
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
