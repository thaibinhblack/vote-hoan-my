import data from '@/static/data/cauhoi.json'
export const state = () => ({
  list: [],
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
  }
}