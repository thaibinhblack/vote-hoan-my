export const state = {}

export const getter = {}

export const mutations = {}

export const actions = {
  createNhanVienKhaoSat ({ dispatch }, data) {
    return new Promise(async(resolve, reject) => {
      try {
        dispatch('root/setLoading', true, { root: true })
        await this.$voteSafe.nhanvienks.apiCreateNhanVienKhaoSat(data)
        .then((res) => {
          dispatch('root/setLoading', false, { root: true })
          if(res.data.code === 200) resolve(res.data)
          else reject(res.data)
        })
      } catch (error) {
        dispatch('root/setLoading', false, { root: true })
        reject(error)
      }
    })
  },
  
  queryNhanVienKhaoSat ({ dispatch }, params) {
    return new Promise(async(resolve, reject) => {
      dispatch('root/setLoading', true, { root: true })
      await this.$voteSafe.nhanvienks.apiGetNhanVienKhaoSat(params)
      .then((res) => {
        dispatch('root/setLoading', false, { root: true })
        if(res.data.code === 200) resolve(res.data)
        else reject(res.data)
      }).catch((err) => {
        dispatch('root/setLoading', false, { root: true })
        reject(err)
      })
    })
  }
}
