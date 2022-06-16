export const state = {}
export const getters = {}
export const mutations = {}
export const actions = {
  saveKetQua ({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('root/setLoading', true, { root: true })
      this.$voteSafe.ketqua.apiSaveKetQua(payload)
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