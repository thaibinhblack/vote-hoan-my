export const state = () => ({
  data: {},
  list: [],
  status: [
    {
      label: 'Chưa đóng khảo sát',
      value: 1
    },
    {
      label: 'Đóng khảo sát',
      value: 2
    }
  ],
  fields: [
    {
      key: 'phienban_id',
      field: 'text',
      placeholder: 'Tìm kiếm theo ID',
      label: 'ID'
    },
    {
      key: 'tieude_khaosat',
      field: 'text',
      placeholder: 'Tìm kiếm theo iêu đề',
      label: 'Tiêu đề'
    },
    {
      key: 'status_khao_sat',
      field: 'select',
      placeholder: 'Trạng thái',
      list: [
        {
          label: 'Tất cả trạng thái',
          value: -1
        },
        {
          label: 'Chưa đóng khảo sát',
          value: 1
        },
        {
          label: 'Đóng khảo sát',
          value: 2
        }
      ]
    }
  ],
  columns: [
    {
      label: 'ID',
      column: 'phien_ban_id',
      align: 'center',
      width: 60
    },
    {
      label: 'Tiêu đề',
      column: 'tieu_de_khao_sat',
      width: 180
    },
    {
      label: 'Mô tả',
      column: 'mo_ta_khao_sat',
      format: {
        type: 'html'
      }
    },
    {
      label: 'Nội dung',
      column: 'noi_dung_khao_sat',
      format: {
        type: 'html'
      }
    },
    {
      label: 'Số lượng nhân viên',
      column: 'sl_nhan_vien_ks',
    },
    {
      label: 'Trạng thái',
      column: 'status_khao_sat',
      align: 'center',
      format: {
        type: 'data',
        data: [
          {
            label: 'Chưa đóng khảo sát',
            value: 1,
            class: '--txt-success'
          },
          {
            label: 'Đã đóng khảo sát',
            value: 2,
            class: '--txt-danger'
          }
        ]
      },
      width: 120
    },
    {
      label: 'Ngày kết thúc',
      column: 'time_end',
      align: 'center',
      format: {
        type: 'time'
      },
      width: 150
    }
  ],
  pagination: {},
  thongke: {},
  columnThongKe: [
    {
      label: '#',
      column: 'index',
      width: 80
    },
    {
      label: 'Mã nhân viên',
      column: 'ma_nhan_vien',
      width: 120
    },
    {
      label: 'Tên nhân viên',
      column: 'ten_nhan_vien',
    },
    {
      label: 'Email nhân viên',
      column: 'email',
    },
    {
      label: 'Giới tính',
      column: 'gioi_tinh',
      format: {
        type: 'data',
        data: [
          {
            label: 'Nam',
            value: 1
          },
          {
            label: 'Nữ',
            value: 0
          }
        ]
      },
      width: 80
    },
    {
      label: 'Trạng thái khảo sát',
      column: 'status_khao_sat',
      width: 120,
      format: {
        type: 'data',
        data: [
          {
            label: 'Chưa hoàn thành',
            value: 1,
            class: '--txt-danger'
          },
          {
            label: 'Đã hoàn thành',
            value: 2,
            class: '--txt-success'
          }
        ]
      }
    },
  ]
})

export const getters = {
  list: (state) => {
    return state.list.reduce((arr, key, index) => ([
      ...arr,
      {
        ...key,
        index: index + 1,
        sl_nhan_vien_ks: `${key.nhan_vien_khao_sat.filter(item => item.status_khao_sat === 2).length} / ${key.nhan_vien_khao_sat.length}`
      }
    ]), [])
  },

  dataThongKe (state) {
    return state.thongke.nhan_vien_khao_sat ? state.thongke.nhan_vien_khao_sat.reduce((arr, key, index) => ([
      ...arr,
      {
        index: index + 1,
        hospital_id: key.hospital_id,
        status_khao_sat: key.status_khao_sat,
        ...key.thong_tin_nhan_vien
      }
    ]), [])
    : []
  }
}

export const mutations = {
  SET_DATA: (state, payload) => {
    state.data = {
      ...payload
    }
  },

  SET_LIST: (state, payload) => {
    state.list = [
      ...payload
    ]
  },

  SET_PAGINATION: (state, payload) => {
    state.pagination = {
      ...payload
    }
  },

  CREATE_DATA: (state, payload) => {
    state.list = [
      {
        ...payload
      },
      ...state.list
    ]
  },

  UPDATE_DATA: (state, payload) => {
    state.list = [
      ...state.list.reduce((arr, key) => {
        arr = payload.phienban_id === key.phienban_id
        ? [
          ...arr,
          {
            ...payload
          }
        ]
        : [
          ...arr,
          {
            ...key
          }
        ]
        return arr
      }, [])
    ]
  },

  DELETE_DATA: (state, payload) => {
    state.list = [
      ...state.list.filter((item) => item.phienban_id !== payload.phienban_id)
    ]
  },

  SET_THONGKE: (state, payload) => {
    state.thongke = {
      ...payload
    }
  }
}


export const actions = {
  setData: ({ commit }, payload) => {
    commit("SET_DATA", payload)
  },
  setList: ({ commit }, payload) => {
    commit("SET_LIST", payload)
  },
  setPagination: ({ commit }, payload) => {
    commit('SET_PAGINATION', payload)
  },
  setThongKe: ({ commit }, payload) => {
    commit('SET_THONGKE', payload)
  },

  fetchKhaoSat: ({ dispatch }) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.$voteSafe.phienban
          .getPhienBanKhaoSat()
          .then((res) => {
            console.log('res', res)
            dispatch('setData', res.data)
            resolve(result)
          })
      } catch (error) {
        reject(error)
      }
    })
  },

  fetchKhaoSatById ({ dispatch }, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        dispatch('root/setLoading', true, { root: true })
        await this.$voteSafe.phienban
          .apiGetPhienBanById(payload)
          .then((res) => {
            dispatch('root/setLoading', false, { root: true })
            if (res.data.code === 200) {
              resolve(res.data.data)
            } else {
              reject(res.data)
            }
          })
      } catch (error) {
        dispatch('root/setLoading', false, { root: true })
        reject(error)
      }
    })
  },

  fetchListKhaoSat ({ dispatch }, params = {}) {
    return new Promise(async (resolve, reject) => {
      dispatch('root/setLoading', true, { root: true })
      console.log('params', params)
      try {
        this.$voteSafe.phienban
          .apiGetPhienBanKhaoSat(params)
          .then((res) => {
            dispatch('root/setLoading', false, { root: true })
            dispatch('setList',res.data.data)
            dispatch('setPagination',res.data.paging)
            resolve(res.data)
          })
          .catch((err) => {
            dispatch('root/setLoading', false, { root: true })
            reject(err)
          })
      } catch (error) {
        dispatch('root/setLoading', false, { root: true })
        reject(error)
      }
    })
  },
  
  createPhienBan({ dispatch }, payload) {
    return new Promise(async (resolve, reject) => {
      dispatch('root/setLoading', true, { root: true })
      try {
        payload = {
          ...payload,
          time_start: this.$moment(payload.time_start).format('YYYY-MM-DD hh:mm:ss'),
          time_end: this.$moment(payload.time_end).format('YYYY-MM-DD hh:mm:ss')
        }
        this.$voteSafe.phienban
        .apiCreatePhienBanKhaoSat(payload)
        .then((res) => {
          if(res.data.code === 200) {
            dispatch('fetchListKhaoSat', {
              language: this.$i18n.loadedLanguages[0]
            })
            resolve(res.data)
          } else {
            dispatch('root/setLoading', false, { root: true })
            reject(res.data)
          }
        })
      } catch (error) {
        dispatch('root/setLoading', false, { root: true })
        reject(error)
      }
    })
  },

  updatePhienBan({ dispatch }, payload) {
    dispatch('root/setLoading', true, { root: true })
    payload = {
      ...payload,
      time_start: this.$moment(payload.time_start).format('YYYY-MM-DD hh:mm:ss'),
      time_end: this.$moment(payload.time_end).format('YYYY-MM-DD hh:mm:ss')
    }
    return new Promise(async (resolve, reject) => {
      this.$voteSafe.phienban
      .apiUpdatePhienBanKhaoSat(payload)
        .then((res) => {
          if (res.data.code === 200) {
            dispatch('fetchListKhaoSat', {
              language: this.$i18n.loadedLanguages[0]
            })
            resolve(res.data)
          } else {
            dispatch('root/setLoading', false, { root: true })
            reject(res.data)
          }
        }).catch((err) => {
          dispatch('root/setLoading', false, { root: true })
          reject(err)
        })
    })
  },

  deletePhienBan({ dispatch }, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        dispatch('root/setLoading', true, { root: true })
        await this.$voteSafe.phienban
        .apiDeletePhienBan(payload)
          .then((res) => {
            
            if(res.data.code === 200) {
              dispatch('fetchListKhaoSat', {
                language: this.$i18n.loadedLanguages[0]
              })
              resolve(res.data)
            } else {
              dispatch('root/setLoading', false, { root: true })
              reject(res.data)
            }
          })
          .catch((err) => {
            dispatch('root/setLoading', false, { root: true })
            reject(err)
          })
      } catch (error) {
        dispatch('root/setLoading', false, { root: true })
        reject(error)
      }
    })
  },

  deletePhienBanById ({ dispatch }, id) {
    return new Promise(async (resolve, reject) => {
      try {
        dispatch('root/setLoading', true, { root: true })
        await this.$voteSafe.phienban
        .apiDeletePhienBanById(id)
          .then((res) => {
            
            if(res.data.code === 200) {
              dispatch('fetchListKhaoSat', {
                language: this.$i18n.loadedLanguages[0]
              })
              resolve(res.data)
            } else {
              dispatch('root/setLoading', false, { root: true })
              reject(res.data)
            }
          })
          .catch((err) => {
            dispatch('root/setLoading', false, { root: true })
            reject(err)
          })
      } catch (error) {
        dispatch('root/setLoading', false, { root: true })
        reject(error)
      }
    })
  },

  setNhanVienKhaoSat ({ dispatch }, payload)  {
    return new Promise(async(resolve, reject) => {
      
    })
  },

  fetchThongKe ({ dispatch }, params) {
    return new Promise(async (resolve, reject) => {
      try {
        dispatch('root/setLoading', true, { root: true })
        await this.$voteSafe.thongke
        .apiGetThongKeKhaoSat(params)
          .then((res) => {
            
            if(res.data.code === 200) {
              dispatch('setThongKe', res.data.data)
              resolve(res.data.data)
            } else {
              dispatch('root/setLoading', false, { root: true })
              reject(res.data)
            }
          })
          .catch((err) => {
            dispatch('root/setLoading', false, { root: true })
            reject(err)
          })
      } catch (error) {
        dispatch('root/setLoading', false, { root: true })
        reject(error)
      }
    })
  }
}
