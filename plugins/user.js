import Vue from "vue";
import {mapGetters} from "vuex";

const User = {
  install(Vue, options) {
    Vue.mixin({
      computed: {
        ...mapGetters({
          phongBanLamViec: "phongBanLamViec",
          nhanVienSuDung: "nhanVienSuDung",
          user: "user",
          drawerLeft: "drawerLeft",
          authenticated: "authenticated"
        })
      }
    });
  }
};

Vue.use(User);
