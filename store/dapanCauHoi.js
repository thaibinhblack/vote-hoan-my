import data from '@/static/data/dapanCauHoi.json'

export const state = () => ({
  dapan: [],
  types: [
    {
      label: 'Kiểu số',
      value: 'number'
    },
    {
      label: 'Kiểu text',
      value: 'text'
    }
  ]
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
  },

  queryDapAn: ({ dispatch }, params = {}) => {
    const result = data.filter((item) => item.cauhoi_id === params.cauhoi_id)

    return new Promise((resolve, reject) => {
      try {
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
}