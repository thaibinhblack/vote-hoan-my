export const state = () => ({
  data: {}
})

export const getters = {

}

export const mutations = {
  SET_DATA: (state, payload) => {
    state.data = {
      ...payload
    }
  }
}


export const actions = {
  setData: ({commit}, payload) => {
    commit("SET_DATA", payload)
  },


  fetchKhaoSat: ({ dispatch }, params = {}) => {
    const result = {
      phienban_id: 1,
      url_khaosat: '/khaosat?phienban_id=1',
      time_start: '08:00:00 07/05/2022',
      time_end: '11:00:00 07/05/2022',
      tieude_khaosat: 'BÌNH CHỌN VÌ AN TOÀN  - VOTE FOR SAFETY (Phiên bản 2) - HMSG',
      mota_khaosat: 'Bản dịch được sự cho phép của Tổ chức AHRQ tại Mỹ (the United States Agency for Healthcare Research and Quality'
    }

    dispatch('setData', result)
  }
}
