<template>
  <v-app id="login" class="login">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card outlined class="elevation-1 pa-3">
              <v-toolbar flat dark color="primary">
                <v-icon left>mdi-account</v-icon>
                <v-toolbar-title class="font-weight-light">
                  {{ $t("login.loginFormName") }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-title class="font-weight-black blue--text">
              </v-card-title>
              <v-card-text>
                <v-row align="center" justify="center">
                  <v-img
                    :src="logoImage"
                    alt="Trang đăng nhập hệ thống"
                    max-height="150"
                    max-width="200"
                    contain
                  />
                </v-row>

                <v-form @submit.prevent="login" id="check-login-form">
                  <v-text-field
                    append-icon="person"
                    name="login"
                    :label="$t('login.userLoginName')"
                    type="text"
                    v-model="userLogin.name"
                    :error="error"
                    :rules="[rules.required]"
                    autofocus
                  />
                  <v-text-field
                    :type="hidePassword ? 'password' : 'text'"
                    :append-icon="
                      hidePassword ? 'visibility_off' : 'visibility'
                    "
                    name="password"
                    :label="$t('login.password')"
                    id="password"
                    :rules="[rules.required]"
                    v-model="userLogin.pass"
                    :error="error"
                    v-on:keyup.enter="login"
                    @click:append="hidePassword = !hidePassword"
                  />


                  <v-select
                    v-model="langSelect"
                    :items="availableLocales"
                    item-text="name"
                    item-value="code"
                    :label="$t('languageSelect')"
                    append-icon="mdi-flag-variant"
                    @input="onSelectLangInputChange"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  type="submit"
                  block
                  color="primary"
                  @click="login"
                  :loading="loading"
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-snackbar v-model="showResult" :timeout="2000" top>
        {{ result }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import {mapState} from "vuex";

const Cookie = process.client ? require("js-cookie") : undefined;
import notify from "devextreme/ui/notify";
import CheckError from "~/utils/handlerErro";

export default {
  layout: "public",
  head() {
    return {
      title: "Đăng nhập",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "My custom description"
        }
      ]
    };
  },

  computed: {
    availableLocales() {
      return this.$i18n.locales;
    },
    logoImage: () => process.env.LOGO,
    ...mapState({
      taiKhoanLogin: state => state.taikhoan.taiKhoanLogin,
      nhanVienLogin: state => state.taikhoan.nhanVienLogin,
      menuTop: state => state.menu.menuTop
    })
  },
  data() {
    return {
      langSelect: {},
      loading: false,
      userLogin: {
        name: "",
        pass: ""
      },
      hidePassword: true,
      error: false,
      showResult: false,
      result: "",
      rules: {
        required: value => !!value || "Vui lòng nhập thông tin!."
      }
    };
  },
  created() {
    this.$store.commit("setTilePage", this.$t("login.loginFormName"));
    this.langSelect = 'vi';
    this.setLang('vi');
  },
  methods: {
    async setLang(e) {
      await this.$i18n.setLocaleCookie(e);
      await this.$i18n.setLocale(e);
    },
    async login({redirect}) {
      const vm = this;

      if (!vm.userLogin.name || !vm.userLogin.pass) {
        vm.result = "Thông tin không được để trống.";
        vm.showResult = true;
        return;
      }

      let userLoginPar = {
        username: vm.userLogin.name,
        password: vm.userLogin.pass
      };

      if (process.env.DU_AN_ID) {
        userLoginPar.du_an_id = parseInt(process.env.DU_AN_ID);
      }

      if (process.env.DU_AN_CODE) {
        userLoginPar.du_an_code = process.env.DU_AN_CODE;
      }

      try {
        this.$store.commit("SET_LOADING", true);

        let res = await this.$auth.loginWith("local", {
          data: userLoginPar
        });

        if (res.status === 200) {
          this.$store.commit("setMenus", res.data.data.menu, {root: true});
          await this.$store.dispatch(
            "getMenuLeftByPhanQuyenId",
            this.user.phan_quyen_id
          );
          await this.$router.push(this.localePath("/admin"));
          await this.$store.dispatch("connect");

          this.$store.commit("SET_LOADING", false);
          notify(this.$t("login.loginSusses"));
        }
      } catch (err) {
        CheckError(err, "Đăng nhập không thành công!");
        this.$store.commit("SET_LOADING", false);
      }
    },
    async onSelectLangInputChange(e) {
      await this.setLang(e)
      // this.$validator.localize(e);
      // // this.$i18n.setLocaleCookie(e);
      // // this.$i18n.locale = e;
      // await this.$router.push(this.switchLocalePath(e));
    }
  }
};
</script>

<style scoped lang="css">
.login {
  background-color: #2b2d30;
}
</style>
