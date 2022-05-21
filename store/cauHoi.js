import data from '@/static/data/cauhoi.json'
export const state = () => ({
  list: [],
  thuanNghich: [
    {
      label: 'Câu hỏi thuận',
      value: 0
    },
    {
      label: 'Câu hỏi nghịch',
      value: 1
    }
  ],
  status: [
    {
      label: 'Đang hoạt động',
      value: 0
    },
    {
      label: 'Ngừng hoạt động',
      value: 2
    }
  ]
})

export const getters = {}

export const mutations = {
  SET_LIST: (state, payload) => {
    state.list = [
      ...payload
    ]
  }
}

export const actions = {
  setList: ({ commit }, payload) => {
    commit('SET_LIST', payload)
  },

  fetchListCauhoi: ({ dispatch }, params = {}) => {
    const result = [
      ...data
    ]
    dispatch('setList', result)
  },

  fetchCauhoi: ({ dispatch }, params = {}) => {
    const result = data.filter((item) => item.phancauhoi_id === params.phancauhoi_id)
    return new Promise((resolve, reject) => {
      try {
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
}