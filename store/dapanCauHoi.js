import data from '@/static/data/dapanCauHoi.json'

export const state = () => ({
  dapan: []
})

export const getters = {}

export const mutations = {
  SET_DAPAN: (state, payload) => {
    state.dapan = [
      ...payload
    ]
  }
}

export const actions = {
  setData: ({ commit }, payload) => {
    commit('SET_DAPAN', payload)
  },

  fetchDapAn: ({ dispatch }, params = {}) => {
    const result = [
      ...data
    ]

    dispatch('setData', result)
  }
}