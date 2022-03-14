export const state = () => ({
  danhSachNhanVien: []
});

export const actions = {
  async getNhanVien({ commit }) {
    await this.$services.nhanvien
      .apiGetAllNhanVienCombobox()
      .then(res => {
        if (res.data.code === 200) {
          commit("setDanhSachNhanVien", res.data.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};

export const mutations = {
  setDanhSachNhanVien(state, data) {
    state.danhSachNhanVien = data;
  }
};

export const getters = {
  getDanhsachNhanVien(state) {
    return state.danhSachNhanVien;
  }
};
