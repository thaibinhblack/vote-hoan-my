export const state = () => ({
  list: [],
  types: [
    {
      label: 'Radio',
      value: 'radio'
    },
    {
      label: 'Checkbox',
      value: 'checkbox'
    }
  ],
  status: [
    {
      label: 'Tất cả trạng thái',
      value: -1
    },
    {
      label: 'Đang hoạt động',
      value: 1
    },
    {
      label: 'Ngưng hoạt động',
      value: 2
    }
  ],
  pagination: {}
})

export const getters = {
  LIST_LABEL: (state) => {
    return state.list.map((item) =>  ({
      label: item.giatri_cauhoi,
      id: item.phan_cauhoi_id
  }))
  }
}

export const mutations = {
  SET_LIST: (state, payload) => {
    state.list = [
      ...payload
    ]
  },

  SET_PAGINATION: (state, payload) => {
    state.pagination = {
      ...payload
    }
  }
}

export const actions = {
  setList: ({ commit }, payload) => {
    commit('SET_LIST', payload)
  },
  setPagination: ({commit }, payload) => {
    commit('SET_PAGINATION', payload)
  },

  fetchPhanCauHoi({ dispatch }, params = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        dispatch('root/setLoading', true, { root: true })
        await this.$voteSafe.phancauhoi.apiGetPhanCauHoi(params)
        .then((res) => {
          dispatch('root/setLoading', false, { root: true })
          if (res.data.code === 200) {
            dispatch('setList', res.data.data)
            dispatch('setPagination', res.data.paging)
            resolve(res.data)
          } else {
            reject(res.data)
          }
        }).catch((err) => {
          console.log('api phan cau hoi', err)
          dispatch('root/setLoading', false, { root: true })
          reject(err)
        }) 
      } catch (error) {
        dispatch('root/setLoading', false, { root: true })
        reject(error)
      }
    })
  },

  createPhanCauHoi ({ dispatch }, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        dispatch('root/setLoading', true, { root: true })
        await this.$voteSafe.phancauhoi.apiCreatePhanCauHoi(payload)
        .then((res) => {
          dispatch('root/setLoading', false, { root: true })
          if (res.data.code === 200) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        }).catch((err) => {
          dispatch('root/setLoading', false, { root: true })
          reject(err)
        })
      } catch (error) {
        dispatch('root/setLoading', false, { root: true })
        reject(err)
      }
    })
  },
  
  updatePhanCauHoi ({ dispatch }, payload) {
    console.log('call update')
    return new Promise(async (resolve, reject) => {
      try {
        dispatch('root/setLoading', true, { root: true })
        await this.$voteSafe.phancauhoi.apiUpdatePhanCauHoi(payload)
        .then((res) => {
          dispatch('root/setLoading', false, { root: true })
          if (res.data.code === 200) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        }).catch((err) => {
          dispatch('root/setLoading', false, { root: true })
          reject(err)
        })
      } catch (error) {
        dispatch('root/setLoading', false, { root: true })
        reject(err)
      }
    })
  },

  deletePhanCauHoi ({ dispatch }, id) {
    return new Promise((resolve, reject) => {
      dispatch('root/setLoading', true, { root: true })
      this.$voteSafe.phancauhoi.apiDeletePhanCauHoi(id)
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