export const state = () => ({
  users: [],
  danhSachNhanVien: [],
  columns: [
    {
      label: '#',
      column: 'index',
      width: 80
    },
    {
      label: 'Tài khoản ID',
      column: 'tai_khoan_id',
      width: 100
    },
    {
      label: 'Nhân viên ID',
      column: 'nhan_vien_id',
      width: 100
    },
    {
      label: 'Mã nhân viên',
      column: 'ma_nhan_vien',
      width: 150
    },
    {
      label: 'Tên nhân viên',
      column: 'ten_nhan_vien',
    },
    {
      label: 'Email',
      column: 'email',
    },
    {
      label: 'Số điện thoại',
      column: 'so_dien_thoai',
    },
    {
      label: 'Giới tính',
      column: 'gioi_tinh',
      width: 100,
      format: {
        type: 'data',
        data: [
          {
            value: 1,
            label: 'Nam'
          },
          {
            value: 0,
            label: 'Nữ'
          }
        ]
      }
    }
  ]
})


export const actions = {
  async getNhanVien({ commit }) {
    await this.$services.nhanvien
      .apiGetAllNhanVienCombobox()
      .then(res => {
        if (res.data.code === 200) {
          commit("setDanhSachNhanVien", res.data.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },

  setDanhSachNhanVien ({ commit }, data) {
    commit('setDanhSachNhanVien', data)
  },

  queryNhanVien({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      try {
        dispatch('root/setLoading', true, { root: true })
        this.$voteSafe.nhanvien
          .apiGetNhanVien(params)
          .then((res) => {
            dispatch('root/setLoading', false, { root: true })
            if (res.data.code === 200) {
              dispatch('setDanhSachNhanVien', res.data.data)
              resolve(res.data)
            } else {
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
};

export const mutations = {
  setDanhSachNhanVien(state, data) {
    state.danhSachNhanVien = data;
  }
};

export const getters = {
  getDanhsachNhanVien(state) {
    return state.danhSachNhanVien;
  },

  danhSachNhanVien (state) {
    return state.danhSachNhanVien.reduce((arr, key, index) => ([
      ...arr,
      {
        ...key,
        index: index + 1
      }
    ]), [])
  }
};
