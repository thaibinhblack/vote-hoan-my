import Vue from 'vue';
import notify from "devextreme/ui/notify";

export const state = () => ({
  drawer: false,
  titlePage: "",
  menus: [],
  khoLamViec: null,
  phongBanLamViec: null,
  nhanVienSuDung: null,
  isLoading: false,
  socket: {
    Id: null,
    isConnected: false,
  }

});

export const mutations = {
  SET_NHAN_VIEN(state, data) {
    state.nhanVienSuDung = data;
  },
  SET_LOADING(state, data) {
    state.isLoading = data;
  },
  //--------------SOCKET-IO----------------
  SET_CLIENT_ID(state, data) {
    state.socket.Id = data;
  },
  SET_CLIENT_CONNECTED(state, data) {
    state.socket.isConnected = data;
  },

  //--------------SOCKET-IO----------------
  SET_DRAWER(state, data) {
    state.drawer = data;
  },
  toggleDrawer(state) {
    state.drawer = !state.drawer;
  },
  setTilePage(state, data) {
    state.titlePage = data;
  },
  setMenus(state, data) {
    state.menus = data;
  },
  setKhoLamViec(state, data) {
    state.khoLamViec = data;
  },
  setPhongBanLamViec(state, data) {
    state.phongBanLamViec = data;
  },

};

export const actions = {
  connect({commit}) {
    commit("SET_CLIENT_CONNECTED", true);
  },
  async getMenuLeftByPhanQuyenId({commit}, phanQuyenId) {
    let menu = [
      {icon: "mdi-home-roof", menu_name: "Trang chủ", path: "/"},
      {
        icon: "mdi-login-variant",
        menu_name: "Đăng nhập hệ thống",
        path: "/login"
      }
    ];

    if (phanQuyenId) {
      let par = {
        phanQuyenId: phanQuyenId,
      }
      if (process.env.DU_AN_ID) {
        par.duAnId = process.env.DU_AN_ID;
      }

      if (process.env.DU_AN_CODE) {
        par.duAnCode = process.env.DU_AN_CODE;
      }

      await this.$services.menu
        .apiMenuTheoPhanQuyenIdAndDuAnId(par)
        .then(res => {
          let data = res.data.data;
          if (data)
            menu = _.sortBy(data, ['order_by']);
        })
        .catch(err => {
          console.log("Erro :" + err);
        });

    }

    commit("setMenus", menu);

    return menu;
  },
  async dangXuat({commit}) {
    commit("setPhongBanLamViec", null);
    commit("setKhoLamViec", null);
  }
};

export const getters = {
  user(state) {
    return state.auth.user;
  },
  nhanVienSuDung(state) {
    return state.nhanVienSuDung;
  },
  authenticated(state) {
    return state.auth.loggedIn;
  },
  drawerLeft(state) {
    return state.drawer;
  },
  khoLamViec(state) {
    return state.khoLamViec;
  },
  phongBanLamViec(state) {
    return state.phongBanLamViec;
  }
};
