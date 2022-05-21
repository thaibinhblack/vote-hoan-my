export const state = () => ({
  data: {},
  list: [],
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
      key: 'status_khaosat',
      field: 'select',
      placeholder: 'Trạng thái',
      list: [
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
      ]
    }
  ],
  columns: [
    {
      label: 'ID',
      column: 'phienban_id',
      align: 'center',
      width: 60
    },
    {
      label: 'URK Khảo sát',
      column: 'url_khaosat',
      align: 'center',
      width: 130
    },
    {
      label: 'Tiêu đề',
      column: 'tieude_khaosat',
    },
    {
      label: 'Mô tả',
      column: 'mota_khaosat',
    },
    {
      label: 'Trạng thái',
      column: 'trang_thai_text',
      align: 'center',
    },
    {
      label: 'Ngày kết thúc',
      column: 'time_end',
      align: 'center',
    },
    {
      label: 'Ngày tạo',
      column: 'created_at',
      align: 'center',
      width: 140
    }
  ]
})

export const getters = {
  list: (state) => {
    return state.list.map(item => ({
      ...item,
      trang_thai_text: 
        item.status_khaosat === 1
        ? 'Đang hoạt động'
        : (
            item.status_khaosat === 2 
            ? 'Ngừng hoạt động'
            : 'Chưa cập nhật'
          )
    }))
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
  }
}


export const actions = {
  setData: ({ commit }, payload) => {
    commit("SET_DATA", payload)
  },
  setList: ({ commit }, payload) => {
    commit("SET_LIST", payload)
  },


  fetchKhaoSat: ({ dispatch }, params = {}) => {
    const result = {
      phienban_id: 1,
      url_khaosat: '/khaosat?phienban_id=1',
      time_start: '08:00:00 07/05/2022',
      time_end: '10:00:00 07/05/2022',
      tieude_khaosat: 'BÌNH CHỌN VÌ AN TOÀN  - VOTE FOR SAFETY (Phiên bản 2) - HMSG',
      mota_khaosat: 'Bản dịch được sự cho phép của Tổ chức AHRQ tại Mỹ (the United States Agency for Healthcare Research and Quality'
    }

    return new Promise((resolve, reject) => {
      try {
        dispatch('setData', result)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  },

  fetchListKhaoSat: ({ dispatch }, params = {}) => {
    const result = [
      {
        phienban_id: 1,
        url_khaosat: '/khaosat?phienban_id=1',
        time_start: '08:00:00 07/05/2022',
        time_end: '10:00:00 07/05/2022',
        tieude_khaosat: 'BÌNH CHỌN VÌ AN TOÀN  - VOTE FOR SAFETY (Phiên bản 2) - HMSG',
        status_khaosat: 2,
        mota_khaosat: 'Bản dịch được sự cho phép của Tổ chức AHRQ tại Mỹ (the United States Agency for Healthcare Research and Quality'
      },
      {
        phienban_id: 2,
        url_khaosat: '/khaosat?phienban_id=1',
        time_start: '08:00:00 07/05/2022',
        time_end: '10:00:00 07/05/2022',
        tieude_khaosat: 'BÌNH CHỌN VÌ AN TOÀN  - VOTE FOR SAFETY (Phiên bản 2) - HMSG',
        status_khaosat: 1,
        mota_khaosat: 'Bản dịch được sự cho phép của Tổ chức AHRQ tại Mỹ (the United States Agency for Healthcare Research and Quality'
      }
    ]

    dispatch('setList', result)
  },
  
  updatePhienBan: ({ commit }, payload) => {
    commit('UPDATE_DATA', payload)
  },
  
  createPhienBan: ({ commit, state }, payload) => {
    const data = {
      phienban_id: state.list.length + 1,
      ...payload
    }
    commit('CREATE_DATA', data)
  },

  deletePhienBan: ({ commit }, payload) => {
    commit('DELETE_DATA', payload)
  }
}
