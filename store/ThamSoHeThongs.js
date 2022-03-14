const SERVICE = "auth/v1";
const RESOURCE = "tham-so-he-thong";


const config = {
  headers: {"content-type": "application/json"},
};

export const state = () => ({
  thamSoHeThong: {},
  thamSoHeThongs: [],
});

export const mutations = {
  SET_THAMSOHETHONG(state, data) {
    state.thamSoHeThong = data;
  },
  SET_THAMSOHETHONGS(state, data) {
    state.thamSoHeThongs = data;
  },
};

export const actions = {
  getAll({commit}) {
    this.$axios
      .get(`${SERVICE}/${RESOURCE}`)
      .then((res) => {
        if (res.data.code === 200) {
          var data = res.data.data;
          commit("SET_THAMSOHETHONGS", data);
        }
      })
      .catch((err) => {
      });
  },
  add({commit, dispatch}, par) {
    if (!par) return;

    if (par.id) {
      par.id = null;
    }
    this.$axios
      .post(`${SERVICE}/${RESOURCE}`, JSON.stringify(par), config)
      .then((response) => {
        if (response.status === 200) {
          commit("SUCCESS", null, {root: true});
          dispatch("getAll");
        }
      })
      .catch((err) => {
        dispatch(
          "snackbar/setSnackbar",
          {
            color: "red",
            text: err,
          },
          {root: true}
        );

        commit("ERROR", err, {root: true});
      });
  },
  update({commit, dispatch}, par) {
    if (!par) return;
    const item = JSON.stringify(par);
    this.$axios
      .put(`${SERVICE}/${RESOURCE}/${par.id}`, item, config)
      .then((response) => {
        if (response.status === 200) {
          commit("SUCCESS", null, {root: true});
          dispatch("getAll");
        }
      })
      .catch((err) => {
        dispatch(
          "snackbar/setSnackbar",
          {
            color: "red",
            text: err,
          },
          {root: true}
        );

        commit("ERROR", err, {root: true});
      });
  },
  Remove({commit, dispatch}, par) {
    if (!par) return;
    this.$axios
      .delete(`${SERVICE}/${RESOURCE}/${par}`)
      .then((response) => {
        if (response.status === 200) {
          commit("SUCCESS", null, {root: true});
          dispatch("getAll");
        }
      })
      .catch((err) => {
        dispatch(
          "snackbar/setSnackbar",
          {
            color: "red",
            text: err,
          },
          {root: true}
        );

        commit("ERROR", err, {root: true});
      });
  },
};
