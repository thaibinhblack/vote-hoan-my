export const state = () => ({
  list: []
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
  }
}

export const actions = {
  setList: ({ commit }, payload) => {
    commit('SET_LIST', payload)
  },

  fetchList: ({ dispatch }, params = {}) => {
    const result = [
      {
        phan_cauhoi_id: 1,
        ten_cauhoi: 'PHẦN T: VỊ TRÍ CÔNG VIỆC CỦA ANH / CHỊ',
        mota_cauhoi: 'Lưu ý: Con số đứng trước mỗi chức danh trong câu trả lời bên dưới được hiểu là mã số qui ước dựa trên phiên bản của tổ chức AHRQ',
        giatri_cauhoi: 'T',
        phienban_id: 1,
        phanloai: 'radio'
      },
      {
        phan_cauhoi_id: 2,
        ten_cauhoi: 'PHẦN A: Ý KIẾN VỀ KHOA/PHÒNG/ĐƠN VỊ CỦA ANH/CHỊ',
        mota_cauhoi: 'Lưu ý: Nếu anh/chị làm việc ở nhiều khoa/phòng/đơn vị cùng lúc thì chọn khoa/phòng/đơn vị nào mà thời gian anh/chị làm việc tại đó nhiều hơn. ',
        giatri_cauhoi: 'A',
        phienban_id: 1,
        phanloai: 'radio'
      },
      {
        phan_cauhoi_id: 3,
        ten_cauhoi: 'PHẦN  B: Ý KIẾN VỀ NGƯỜI QUẢN LÝ KHOA/PHÒNG/ĐƠN VỊ CỦA ANH/CHỊ',
        mota_cauhoi: 'Lưu ý: Nếu anh/chị làm việc ở nhiều khoa/phòng/đơn vị cùng lúc thì chọn khoa/phòng/đơn vị nào mà thời gian anh/chị làm việc tại đó nhiều hơn. ',
        giatri_cauhoi: 'B',
        phienban_id: 1
      },
      {
        phan_cauhoi_id: 4,
        ten_cauhoi: 'PHẦN C: Ý KIẾN VỀ VẤN ĐỀ TRAO ĐỔI THÔNG TIN TẠI KHOA/PHÒNG/ĐƠN VỊ CỦA ANH/CHỊ. ',
        mota_cauhoi: 'Lưu ý: Nếu anh/chị làm việc ở nhiều khoa/phòng/đơn vị cùng lúc thì chọn khoa/phòng/đơn vị nào mà thời gian anh/chị làm việc tại đó nhiều hơn. ',
        giatri_cauhoi: 'C',
        phienban_id: 1
      },
      {
        phan_cauhoi_id: 5,
        ten_cauhoi: 'PHẦN D: Ý KIẾN VỀ BÁO CÁO SỰ CỐ TẠI KHOA/PHÒNG/ĐƠN VỊ CỦA ANH/CHỊ',
        mota_cauhoi: 'Lưu ý: Nếu anh/chị làm việc ở nhiều khoa/phòng/đơn vị cùng lúc thì chọn khoa/phòng/đơn vị nào mà thời gian anh/chị làm việc tại đó nhiều hơn. ',
        giatri_cauhoi: 'C',
        phienban_id: 1
      },
      {
        phan_cauhoi_id: 6,
        ten_cauhoi: 'PHẦN E: ĐÁNH GIÁ MỨC ĐỘ AN TOÀN',
        mota_cauhoi: 'Đánh giá mức độ an toàn người bệnh tại khoa/phòng/đơn vị làm việc của Anh/Chị <br /> Lưu ý: Nếu anh/chị làm việc ở nhiều khoa/phòng/đơn vị cùng lúc thì chọn khoa/phòng/đơn vị nào mà thời gian anh/chị làm việc tại đó nhiều hơn',
        giatri_cauhoi: 'C',
        phienban_id: 1
      },
      {
        phan_cauhoi_id: 7,
        ten_cauhoi: 'PHẦN F: Ý KIẾN VỀ BỆNH VIỆN/PHÒNG KHÁM CỦA ANH/CHỊ',
        mota_cauhoi: '',
        giatri_cauhoi: 'F',
        phienban_id: 1
      },
      {
        phan_cauhoi_id: 8,
        ten_cauhoi: 'PHẦN G: THÔNG TIN CÁ NHÂN',
        mota_cauhoi: '',
        giatri_cauhoi: 'G',
        phienban_id: 1
      },
      {
        phan_cauhoi_id: 9,
        ten_cauhoi: 'PHẦN H: Ý KIẾN CÁ NHÂN',
        mota_cauhoi: '',
        giatri_cauhoi: 'H',
        phienban_id: 1
      }
    ]

    dispatch('setList', result)
  }
}