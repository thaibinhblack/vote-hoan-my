import data from '@/static/data/benhVien.json'

export const state = {
  list_benhvien: []
}

export const getters = {}

export const mutations = {
  SET_LIST_BENHVIEN: (state, payload) => {
    state.list_benhvien = [
      ...payload
    ]
  }
}

export const actions = {
  setListBenhVien: ({ commit }, payload) => {
    commit('SET_LIST_BENHVIEN', payload)
  },

  fetchListBenhVien: ({ dispatch }, params = {}) => {
    try {
      dispatch('setListBenhVien', data)
    } catch (error) {
    }
  }
}