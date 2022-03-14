<template>
  <v-dialog v-model='dialog' max-width='700' persistent>

    <v-card>
      <v-system-bar color='primary' dark lights-out window>
        <span class='font-weight-medium'>Tài khoản</span>
        <v-spacer></v-spacer>

        <v-icon @click='close'>mdi-close</v-icon>
      </v-system-bar>
      <ValidationObserver ref='observer' v-slot='{ validate,invalid, reset }'>
        <v-card-text>
          <form>
            <v-row>
              <v-col>
                <ValidationProvider v-slot='{ errors }' name='Tên tài khoản' rules='required'>
                  <v-text-field
                    v-model='itemEdit.ten_tai_khoan'
                    :error-messages='errors'
                    append-icon='mdi-account-edit'
                    label='Tên tài khoản'
                    required
                  />
                </ValidationProvider>

                <ValidationProvider v-slot='{ errors }' name='Tên hiển thị' rules='required'>
                  <v-text-field
                    v-model='itemEdit.display_name'
                    :error-messages='errors'
                    :name='Math.random()'
                    append-icon='mdi-account-circle'
                    autocomplete='new-password'
                    label='Tên hiển thị'
                    required

                  />
                </ValidationProvider>

                <span class='caption'>Nhân viên</span>
                <NhanVienCombobox
                  :value.sync='itemEdit.nhan_vien_id'
                  append-icon='mdi-comment-account'
                  required
                />


                <ValidationProvider v-if='addNew' v-slot='{ errors }' name='Mật khẩu'
                                    rules='required|password:@confirm'>
                  <v-text-field
                    v-model='itemEdit.mat_khau'
                    :error-messages='errors'
                    :name='Math.random()'
                    :type="viewPass ? 'text':'password'"
                    append-icon='visibility' autocomplete='new-password'
                    label='Mật khẩu'
                    @click:append='viewPass = !viewPass '
                  />
                </ValidationProvider>

                <ValidationProvider v-if='addNew' v-slot='{ errors }' name='confirm' rules='required'>
                  <v-text-field
                    v-model='itemEdit.confirmation'
                    :error-messages='errors'
                    :name='Math.random()'
                    :type="viewPass ? 'text':'password'"
                    append-icon='visibility'
                    autocomplete='new-password'
                    label='Mật khẩu nhập lại'
                    @click:append='viewPass = !viewPass'
                  />
                </ValidationProvider>


              </v-col>

              <v-col>
                <ValidationProvider v-slot='{ errors }' name='Phân quyền' rules='required'>
                  <phan-quyen-compobox
                    :errors='errors'
                    :value.sync='itemEdit.phan_quyen_id'
                    append-icon='mdi-comment-account'
                    required
                  />
                </ValidationProvider>
                {{nhomPhanQuyen}}
                <nhom-phan-quyen-compobox
                  :du-an-code='duAnCode'
                  :value.sync='nhomPhanQuyen'
                  append-icon='mdi-comment-account'
                  label='Nhóm phân quyền'
                />
                <ValidationProvider v-slot='{ errors }' name='Bệnh viện' rules='required'>
                  <benh-vien-combobox
                    :errors-messages='errors[0]'
                    :value.sync='itemEdit.hospital_id'
                    append-icon='mdi-hospital-building'
                    required
                  />
                </ValidationProvider>
                <v-text-field
                  v-model='itemEdit.title'
                  append-icon='title'
                  label='Title'
                />
                <v-text-field
                  v-model='itemEdit.department'
                  append-icon='room'
                  label='Department'
                />
                <v-text-field
                  v-model='itemEdit.so_dien_thoai'
                  append-icon='phone'
                  label='Số điện thoại'
                />
                <v-text-field
                  v-model='itemEdit.email'
                  append-icon='email'
                  label='Email'
                />


                <v-checkbox v-model='itemEdit.tinh_trang' label='Đang hoạt động' />

              </v-col>
            </v-row>


          </form>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn class='ma-2 white--text' color='primary' dark @click='close'>
            <v-icon dark left>close</v-icon>
            Đóng
          </v-btn>

          <v-btn class='ma-2 white--text' color='red' dark @click='saveData'>
            <v-icon dark left>save</v-icon>
            Lưu thông tin
          </v-btn>

        </v-card-actions>
      </ValidationObserver>
    </v-card>

    <dx-load-panel
      :close-on-outside-click='false'
      :shading='true'
      :show-indicator='true'
      :show-pane='true'
      :visible.sync='loadingVisible'
      shading-color='rgba(0,0,0,0.4)'
    />
  </v-dialog>
</template>
<script>
import { DxLoadPanel } from 'devextreme-vue/load-panel'

import notify from 'devextreme/ui/notify'


import { extend } from 'vee-validate'
import BenhVienCombobox from '~/components/Templates/BenhVien/BenhVienCombobox'
import PhanQuyenCompobox from '~/components/Templates/PhanQuyen/PhanQuyenCompobox'
import NhanVienCombobox from '~/components/Templates/NhanVien/NhanVienCombobox'
import NhomPhanQuyenCompobox from '~/components/Templates/PhanQuyen/NhomPhanQuyenCompobox'
import CheckError from '@/utils/handlerErro'


extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target
  },
  message: 'Mật khẩu nhập lại không trùng'
})


export default {

  components: {
    NhomPhanQuyenCompobox,
    NhanVienCombobox,
    PhanQuyenCompobox,
    BenhVienCombobox,
    DxLoadPanel
  },
  props: {
    dialog: false,
    addNew: true,
    loadingVisible: false,
    duAnId: {
      type: Number,
      default: null,
      require: true
    },
    //
    menu: {},
    dataEdit: {}
  },
  data() {
    return {
      viewPass: false,
      nhomPhanQuyen: [],
      itemEdit: {
        nhom_quyen: [],
        tinh_trang: true
      }
    }
  },
  computed: {
    duAnCode() {
      return process.env.DU_AN_CODE
    }
  },
  created() {
    if (this.dataEdit) {
      console.log(this.dataEdit)
      this.itemEdit = this.dataEdit
      if (this.itemEdit.nhom_quyen)
        this.nhomPhanQuyen = this.itemEdit.nhom_quyen

    }

  },
  methods: {
    close() {
      this.$emit('update:dialog', false)
      this.$emit('CloseForm', true)
    },
    async saveData() {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {

        notify('Vui lòng nhập đầy đủ thông tin', 'error')
        return
      }
      // check co id thi cap nhat
      if (!this.itemEdit.tai_khoan_id) {
        await this.$services.auth
          .apiInsert(this.itemEdit)
          .then(res => {
            if (res.status === 200) {
              notify('Thêm mới thành công!')
              this.$emit('success')

              const taiKhoanTao = res.data.data

              const dataPq = {
                tai_khoan_id: taiKhoanTao.tai_khoan_id,
                du_an_code: process.env.DU_AN_CODE,
                nhom_phan_quyen: this.nhomPhanQuyen
              }
              this.$services.auth.updatePhanQuyenNhom(dataPq).then(res => {
                notify('Cập nhật phân quyền thành công')
              }).catch(err => {
                CheckError(err)
              })
            }
            this.close()

          })
          .catch(err => {

            const mes = err.response.data.message

            if (mes) {
              notify(mes, 'error')
            }

          })
      }
      // thêm mới
      if (this.itemEdit.tai_khoan_id) {
        await this.$services.auth
          .apiUpdate(this.itemEdit)
          .then(res => {
            if (res.status === 200) {
              notify('cập nhật thành công!')
              this.$emit('success')
              const dataPq = {
                tai_khoan_id: this.itemEdit.tai_khoan_id,
                du_an_code: process.env.DU_AN_CODE,
                nhom_phan_quyen: this.nhomPhanQuyen
              }
              this.$services.auth.updatePhanQuyenNhom(dataPq).then(res => {
                notify('Cập nhật phân quyền thành công')
              }).catch(err => {
                CheckError(err)
              })
              this.close()
            }
          })
          .catch(err => {
            notify('Lỗi cập nhật dữ liệu', 'error', 3000)
            console.log(err)
          })
      }
    }
  }
}
</script>
<style lang='css' scoped>

</style>
