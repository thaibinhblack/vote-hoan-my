export const state = () => ({
  danhSachNhanVien: [],
  danhSachDichVuVacine: [],
  danhSachDuocVacine: []
});

export const actions = {};

export const mutations = {
  setDanhSachNhanVien(state, data) {
    state.danhSachNhanVien = data;
  },
  setDanhSachDichVuVacine(state, data) {
    state.danhSachDichVuVacine = data;
  },
  setDanhSachDuocVacine(state, data) {
    state.danhSachDuocVacine = data;
  }
};

export const getters = {
  getDanhsachNhanVien(state) {
    return state.danhSachNhanVien;
  },
  getDanhSachDichVuVacine(state) {
    return state.danhSachDichVuVacine;
  },
  getDanhSachDuocVacine(state) {
    return state.danhSachDuocVacine;
  }
};
