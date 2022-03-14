<template>
  <v-container fluid>
    <v-row align='center' no-gutters>
      <v-btn
        v-if='!editData'
        color='primary'
        tile
        @click.stop='openFormThemMoi()'
      >
        <v-icon left>mdi-pencil</v-icon>
        Thêm mới
      </v-btn>

      <DxSelectBox
        v-model='tinhTrang'
        :items='
          [
            {
              id : -1,
              name : "Tất cả",
            },
            {
              id : 0,
              name : "Tạm ngưng"
            },
            {
              id : 1,
              name : "Đang hoạt động"
            }
          ]
      '
        :width='200'
        class='ml-3'
        display-expr='name'
        placeholder='Trạng thái'
        styling-mode='underlined'
        value-expr='id'
      />
      <v-btn
        v-if='!editData'
        class='ma-1'
        color='secondary'
        dark
        tile
        @click='GetData'
      >
        <v-icon left>mdi-refresh</v-icon>
        Làm mới
      </v-btn>

    </v-row>

    <dx-load-panel
      :close-on-outside-click='false'
      :shading='true'
      :show-indicator='true'
      :show-pane='true'
      :visible.sync='loadingVisible'
      shading-color='rgba(0,0,0,0.4)'
    />

    <dx-data-grid
      id='gridContainer'
      :allow-column-reordering='true'
      :allow-column-resizing='true'
      :column-auto-width='true'
      :data-source='dataSource'
      :focused-row-enabled='true'
      :show-borders='true'
      :word-wrap-enabled='true'
      class='mt-3'
      column-resizing-mode='widget'
      key-expr='tai_khoan_id'
      @initialized='saveGridInstance'
    >
      <DxGrouping :context-menu-enabled='true' />
      <DxGroupPanel :visible='true' /> <!-- or "auto" -->
      <dx-keyboard-navigation
        :edit-on-key-press='true'
        enter-key-action='moveFocus'
        enter-key-direction='column'
      />
      <DxSearchPanel
        :visible='true'
        :width='400'
        placeholder='Tìm kiếm...'

      />

      <DxFilterRow :visible='true' />
      <DxHeaderFilter
        :allow-search='true'
        :visible='true'
      />
      <DxPager
        :allowed-page-sizes='[50,100, 200, 500]'
        :show-info='true'
        :show-navigation-buttons='true'
        :show-page-size-selector='true'
        info-text='Page #{0}. Total: {1} ({2} items)'
      />
      <dx-paging
        :enabled='true'
        :page-size='50'
      />
      <dx-column :width='100' alignment='center' caption='Menu' cell-template='menuTemplet' />
      <dx-column :width='70' alignment='center' caption='ID' data-field='tai_khoan_id' />
      <dx-column
        :width='150'
        alignment='center'
        caption='Tên tài khoản'
        data-field='ten_tai_khoan'
      >
        <dx-required-rule />
      </dx-column>
      <dx-column
        :width='200'
        caption='Tên hiển thị'
        data-field='display_name'
      >
        <dx-required-rule />
      </dx-column>
      <dx-column
        :group-index='0'
        alignment='center'
        caption='Bệnh viện'
        data-field='hospital_id'
      >
        <dx-lookup
          :data-source='benhVienDataSource'
          display-expr='name'
          value-expr='hospital_id'
        />
        <dx-required-rule />
      </dx-column>
      <dx-column
        :width='200'
        caption='Tên người sử dụng'
        data-field='nhan_vien_su_dung.ten_nhan_vien'
      >
        <!--        <dx-lookup-->
        <!--          :data-source='nhanVienSource'-->
        <!--          display-expr='ten_nhan_vien'-->
        <!--          value-expr='nhan_vien_id'-->
        <!--        />-->

      </dx-column>
      <dx-column :width='230' caption='Phân quyền' data-field='phan_quyen_id'>
        <dx-lookup
          :data-source='phanQuyenSource'
          display-expr='cap_do'
          value-expr='phan_quyen_id'
        />
        <dx-required-rule />
      </dx-column>
      <dx-column :width='230' caption='Nhóm phân quyền' cell-template='nhomPhanQuyen' data-field='nhom_quyen' />
      <template #nhomPhanQuyen='{ data: cellInfo }'>
        <div>
          <span v-for='(item,index) in getTenNhomPhanQuen(cellInfo.value)' :key='index'>
            {{ item }},
          </span>
        </div>

      </template>

      <dx-column caption='Tình trạng' data-field='tinh_trang'>
        <dx-required-rule />
      </dx-column>


      <dx-column
        caption='Phòng ban'
        data-field='department'
      />

      <dx-column
        caption='Email'
        data-field='email'
      />

      <dx-column

        caption='Số điện thoại'
        data-field='so_dien_thoai'
      />

      <dx-column
        caption='Domain login'
        data-field='domain_login'
      />

      <dx-column
        caption='Title'
        data-field='title'
      />
      <dx-column
        :width='200'
        caption='Thời gian đăng nhập'
        data-field='thoi_gian_dang_nhap'
        data-type='date'
        format='dd/MM/yyyy hh:mm aa'
      />

      <template #dropDownBoxEditor='{ data: cellInfo }'>
        <NhanVienCombobox
          :data-source='nhanVienSource'
          :on-value-changed='cellInfo.setValue'
          :value='cellInfo.value'
        />
      </template>
      <template #menuTemplet='item'>
        <div>
          <v-tooltip bottom>
            <template #activator='{ on, attrs }'>
              <v-icon color='primary' v-bind='attrs' @click='openFormEdit(item)' v-on='on'>create</v-icon>
            </template>
            <span>Chỉnh sửa</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template #activator='{ on, attrs }'>
              <v-icon color='red' v-bind='attrs' @click='openFormDoiMatKhau(item)' v-on='on'>vpn_key</v-icon>
            </template>
            <span>Đổi mật khẩu</span>
          </v-tooltip>

        </div>
      </template>
    </dx-data-grid>

    <!--    <v-row align='center' class='mt-5' justify='center' no-gutters>-->
    <!--      <v-col cols='8'>-->
    <!--        <v-row align='center' justify='center'>-->
    <!--          <v-pagination-->
    <!--            v-model='paging.currentPage'-->
    <!--            :length='paging.lastPage!=null ? paging.lastPage:0'-->
    <!--            :total-visible='7'-->
    <!--            @input='pageChangeHandler'-->
    <!--          />-->
    <!--          <DxSelectBox-->
    <!--            v-model='paging.pageNumberSelect'-->
    <!--            :items='paging.pageNumber'-->
    <!--            :width='100'-->
    <!--            class='ml-3'-->
    <!--            @selection-changed='onSelectionPageNumberChanged'-->
    <!--          />-->

    <!--          <v-chip class='ml-2' color='secondary' label>-->
    <!--            {{ paging.first }} - {{ paging.last }} / {{ paging.total }} rows-->
    <!--          </v-chip>-->
    <!--        </v-row>-->
    <!--      </v-col>-->
    <!--    </v-row>-->

    <TaiKhoanEdit
      v-if='dialogThemMoi'
      :add-new='isAddNew'
      :data-edit='dataEdit'
      :dialog.sync='dialogThemMoi'
      @success='GetData'
    />

    <DoiMatKhau
      v-if='dialogDoiMatKhau'
      :data-edit='dataEdit'
      :dialog.sync='dialogDoiMatKhau'
      @success='GetData'
    />

  </v-container>
</template>
<script>
import {
  DxColumn,
  DxDataGrid,
  DxFilterRow,
  DxGrouping,
  DxGroupPanel,
  DxHeaderFilter,
  DxKeyboardNavigation,
  DxLookup,
  DxPager,
  DxPaging,
  DxSearchPanel
} from 'devextreme-vue/data-grid'
import { DxRequiredRule } from 'devextreme-vue/form'
import { DxSelectBox } from 'devextreme-vue'
import { DxLoadPanel } from 'devextreme-vue/load-panel'
import NhanVienCombobox from '~/components/Templates/NhanVien/NhanVienCombobox'
import TaiKhoanEdit from '~/pages/HeThong/TaiKhoan/components/TaiKhoanEdit'
import DoiMatKhau from '~/pages/HeThong/TaiKhoan/components/DoiMatKhau'
import CheckError from '@/utils/handlerErro'

export default {
  components: {
    DxPager,
    TaiKhoanEdit,
    NhanVienCombobox,
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxLookup,
    DxSelectBox,
    DxKeyboardNavigation,
    DxLoadPanel,
    DxSearchPanel, DxFilterRow, DxHeaderFilter, DxGroupPanel, DxGrouping,
    DxRequiredRule,
    DoiMatKhau
  },
  middleware: ['auth', 'check-role'],
  data() {
    return {
      passwordOptions: {
        // mode: "password"
      },
      isAddNew: false,
      dialogThemMoi: false,
      loadingVisible: false,
      dialogDelete: false,
      dialogDoiMatKhau: false,
      dataDeleteQuestion: {},
      dataEdit: {},
      numUpdate: 0,
      modelThang: new Date().getMonth() + 1,
      modelNam: new Date().getFullYear(),
      editData: false,
      allowUpdating: false,
      dataSource: [],
      nhanVienSource: [],
      benhVienDataSource: [],
      phanQuyenSource: [],
      dataGridInstance: null,
      tinhTrang: 1,
      paging: {
        pageNumberSelect: 300,
        currentPage: 1,
        totalPage: 0,
        lastPage: 0,
        pageNumber: [
          50, 100, 200, 300, 400, 600
        ],
        first: 0,
        last: 0,
        total: 0
      }

    }
  },
  watch: {
    modelThang(val) {
      this.GetData()
    },
    modelNam(val) {
      this.GetData()
    }
  },
  created() {
    this.$store.commit('setTilePage', 'Danh mục tài khoản')
    this.tinhTrang = 1
    this.GetData()


  },
  methods: {
    pageChangeHandler(selectedPage) {
      this.paging.curentPage = selectedPage

      this.GetData(this.criteria)
    },
    onSelectionPageNumberChanged() {
      this.paging.curentPage = 1

      this.GetData(this.criteria)
    },
    getTenNhomPhanQuen(list) {
      const name = []

      if (list)
        list.forEach(item => {
          const phanQuyen = this.phanQuyenSource.filter(x => x.phan_quyen_id === item)
          if (phanQuyen && phanQuyen.length > 0) {
            name.push(phanQuyen[0].cap_do)
          }
        })

      return name
    },
    async GetData() {
      this.loadingVisible = true


      await this.$services.nhanvien
        .apiGetAll()
        .then(res => {
          this.nhanVienSource = res.data.data

        })
        .catch(err => {
          console.log(err)

        })
      await this.$services.phanquyen
        .apiGetAll()
        .then(res => {
          this.phanQuyenSource = res.data.data

        })
        .catch(err => {
          console.log(err)
        })

      await this.$services.hospital
        .apiGetAll()
        .then(res => {
          this.benhVienDataSource = res.data.data

        })
        .catch(err => {
          console.log(err)
        })

      const par = {
        top: this.paging.pageNumberSelect,
        page: this.paging.currentPage,
        duAnCode: process.env.DU_AN_CODE

      }
      if (this.tinhTrang >= 0) {
        par.tinhTrang = this.tinhTrang
      }

      await this.$services.auth
        .apiGetAll(par)
        .then(res => {
          this.dataSource = res.data.data

          const pg = res.data.paging
          this.paging.currentPage = pg.current_page
          this.paging.total = pg.total
          this.paging.first = pg.first
          this.paging.last = pg.last
          this.paging.lastPage = pg.last_page
        })
        .catch(res => {
          CheckError(res)
        })


      this.loadingVisible = false

    },
    saveGridInstance(e) {
      this.dataGridInstance = e.component
    },
    async openFormThemMoi() {

      this.dataEdit = {}
      this.dialogThemMoi = true
      this.isAddNew = true
    },
    openFormEdit(item) {
      this.dataEdit = item.data.row.data
      this.dialogThemMoi = true
      this.isAddNew = false

    },
    openFormDoiMatKhau(item) {
      this.dataEdit = item.data.row.data
      this.dialogDoiMatKhau = true
    }


  }
}
</script>

<style scoped>
#gridContainer {
  height: 80vh;
}
</style>
