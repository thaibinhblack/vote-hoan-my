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

  queryDapAn({ dispatch }, params = {}) {
    return new Promise((resolve, reject) => {
      try {
        dispatch("root/setLoading", true, { root: true })
        this.$voteSafe.dapan.apiGetDapAn(params)
        .then((res) => {
          dispatch("root/setLoading", false, { root: true })
          if (res.data.code === 200) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        })
        .catch((err) => {
          dispatch("root/setLoading", false, { root: true })
          reject(err)
        })
      } catch (error) {
        dispatch("root/setLoading", false, { root: true })
        reject(error)
      }
    })
  },

  totalDapAn: ({ dispatch }, cauhoi_id) => {
    return new Promise((resolve, reject) => {
      try {
        const result = data.filter((item) => item.cauhoi_id === cauhoi_id)
        resolve(result.length)
      } catch (error) {
        reject(error)
      }
    })
  },

  createDapAn ({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('root/setLoading', true, { root: true })
      this.$voteSafe.dapan.apiCreateDapAn(payload)
      .then((res) => {
        dispatch('root/setLoading', false, { root: true })
        if (res.data.code === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      })
      .catch((err) => {
        dispatch('root/setLoading', false, { root: true })
        reject(err)
      })
    })
  },

  updateDapAn({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('root/setLoading', true, { root: true })
      this.$voteSafe.dapan.apiUpdateDapAn(payload)
      .then((res) => {
        dispatch('root/setLoading', false, { root: true })
        if (res.data.code === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      })
      .catch((err) => {
        dispatch('root/setLoading', false, { root: true })
        reject(err)
      })
    })
  },

  deleteDapAn ({ dispatch }, id)  {
    return new Promise((resolve, reject) => {
      dispatch('root/setLoading', true, { root: true })
      this.$voteSafe.dapan.apiDeleteDapAn(id)
      .then((res) => {
        dispatch('root/setLoading', false, { root: true })
        if (res.data.code === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      })
      .catch((err) => {
        dispatch('root/setLoading', false, { root: true })
        reject(err)
      })
    })
  }
}