const SERVICE = "auth/v1/";
const RESOUCE = "danh-muc-du-an";


export const state = () => ({
  DanhMucDuAns: [],
  DanhMucDuAn: {},
  DuAnChon: {}
});

export const mutations = {
  setDanhMucDuAns(state, data) {
    state.DanhMucDuAns = data;
  },
  setDanhMucDuAn(state, data) {
    state.DanhMucDuAn = data;
  },
  setDuAnChon(state, data) {
    state.DuAnChon = data;
  }
};
export const actions = {
  async getComboboxData({commit}) {
    await this.$axios.get(`${SERVICE}/${RESOUCE}/combobox`)
      .then(res => {
        if (res.data.code === 200) {
          commit("setDanhMucDuAns", res.data.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  async setDuAn({commit},payload) {
    await this.$axios.put(`${SERVICE}/tai-khoan/du-an?duAnId=`+payload)
      .then(res => {
        if (res.data.code === 200) {
          commit("setDuAnChon", payload);
          return res.data.data;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
export const getters = {};
