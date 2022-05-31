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
      value: 1
    }
  ]
})

export const getters = {}

export const mutations = {
  SET_LIST: (state, payload) => {
    state.list = [
      ...payload
    ]
  },

  UPDATE_DATA: (state, data) => {
    const index = state.list.findIndex((item) => item.cauhoi_id === data.cauhoi_id)
    if (index !== -1) {
      state.list = [
        ...state.list.reduce((arr, key, idx) => {
          if (index === idx) {
            arr = [
              ...arr,
              data
            ]
          } else arr = [
            ...arr,
            key
          ]
          return arr
        }, [])
      ]
    }
  }
}

export const actions = {
  setList: ({ commit }, payload) => {
    commit('SET_LIST', payload)
  },
  updateData: ({ commit }, data) => {
    commit('UPDATE_DATA', data)
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
  },

  updateCauHoi: ({ dispatch }, data = {}) => {
    return new Promise((resolve, reject) => {
      dispatch('updateData', data)
      resolve(data)
    })
  }
}