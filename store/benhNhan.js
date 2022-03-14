export const state = () => ({
  benhNhan: {},
  benhNhans: []
});

export const actions = {
  async get({ commit }) {
    await this.$axios.get(`/cars`).then(res => {
      if (res.status === 200) {
        commit("set", res.data);
      }
    });
  }
};

export const mutations = {
  SET_BENH_NHAN(state, data) {
    state.benhNhan = data;
  }
};

export const getters = {
  thongTinBenhNhan(state) {
    return state.benhNhan;
  }
};
