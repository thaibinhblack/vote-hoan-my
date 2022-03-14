<template>
  <v-container fluid>
    <v-row no-gutters align="center">
      <v-btn
        v-if="!editData"
        @click.stop="openFormThemMoi()"
        tile
        color="primary"
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
        v-if="!editData"
        class="ml-3"
        @click="GetData"
        dark
        tile
        color="secondary"
      >
        <v-icon left>mdi-refresh</v-icon>
        Làm mới
      </v-btn>

    </v-row>

    <dx-load-panel
      :visible.sync="loadingVisible"
      :show-indicator="true"
      :show-pane="true"
      :shading="true"
      :close-on-outside-click="false"
      shading-color="rgba(0,0,0,0.4)"
    />

    <dx-data-grid
      class="mt-3"
      @initialized="saveGridInstance"
      id="gridContainer"
      :data-source="dataSource"
      :show-borders="true"
      :word-wrap-enabled="true"
      :allow-column-resizing="true"
      column-resizing-mode="widget"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :focused-row-enabled="true"
      key-expr="tai_khoan_id"
    >
      <DxGrouping :context-menu-enabled="true"/>
      <DxGroupPanel :visible="true"/> <!-- or "auto" -->
      <dx-keyboard-navigation
        :edit-on-key-press="true"
        enter-key-action="moveFocus"
        enter-key-direction="column"
      />
      <DxSearchPanel
        :visible="true"
        placeholder="Tìm kiếm..."
        :width="400"

      />

      <DxFilterRow :visible="true"/>
      <DxHeaderFilter
        :visible="true"
        :allow-search="true"
      />

      <dx-paging :enabled="false"/>
      <dx-column :width="100" alignment="center" cell-template="menuTemplet" caption="Menu"/>
      <dx-column alignment="center" :width="70" data-field="tai_khoan_id" caption="ID"/>
      <dx-column
        alignment="center"
        data-field="ten_tai_khoan"
        caption="Tên tài khoản"
      >
        <dx-required-rule/>
      </dx-column>
      <dx-column
        data-field="display_name"
        caption="Tên hiển thị"
      >
        <dx-required-rule/>
      </dx-column>
      <dx-column
        :group-index="0"
        alignment="center"
        data-field="hospital_id"
        caption="Bệnh viện"
      >
        <dx-lookup
          :data-source="benhVienDataSource"
          value-expr="hospital_id"
          display-expr="name"
        />
        <dx-required-rule/>
      </dx-column>
      <dx-column
        data-field="department"
        caption="Phòng ban"
      />
      <dx-column
        data-field="title"
        caption="Title"
      />
      <dx-column data-field="nhom_phan_quyen" caption="Nhóm phân quyền" cell-template="nhomPhanQuyen"/>
      <template #nhomPhanQuyen="{ data: cellInfo }">
        <div>
          <span v-for="(item,index) in getTenNhomPhanQuen(cellInfo.value)" :key="index">
            {{ item }},
          </span>
        </div>

      </template>

      <dx-column data-field="tinh_trang" caption="Tình trạng">
        <dx-required-rule/>
      </dx-column>
      <dx-column
        data-field="phone_number"
        caption="Phone number"
      />
      <dx-column
        data-field="email"
        caption="Email"
      />


      <dx-column
        data-field="thoi_gian_dang_nhap"
        caption="Thời gian đăng nhập"
        format="dd/MM/yyyy hh:mm aa"
        data-type="date"
        :width="200"
      />


      <template #menuTemplet="item">
        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-on="on" v-bind="attrs" color="primary" @click="openFormEdit(item)">create</v-icon>
            </template>
            <span>Chỉnh sửa</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-on="on" v-bind="attrs" color="red" @click="openFormDoiMatKhau(item)">vpn_key</v-icon>
            </template>
            <span>Đổi mật khẩu</span>
          </v-tooltip>


        </div>
      </template>
    </dx-data-grid>

    <TaiKhoanEdit
      @success="GetData"
      :dataEdit="dataEdit"
      :add-new="isAddNew"
      :dialog.sync="dialogThemMoi"
      v-if="dialogThemMoi"
      :readonly="!isAddNew"
    />
    <DoiMatKhau
      @success="GetData"
      :dataEdit="dataEdit"
      :dialog.sync="dialogDoiMatKhau"
      v-if="dialogDoiMatKhau"
    />

  </v-container>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxEditing,
  DxLookup,
  DxExport,
  DxSelection,
  DxKeyboardNavigation,
  DxScrolling,
  DxSorting,
  DxPopup,
  DxPosition,
  DxForm, DxSearchPanel, DxFilterRow, DxHeaderFilter, DxGroupPanel, DxGrouping
} from "devextreme-vue/data-grid";
import {
  DxItem as DxItemForm,
  DxRequiredRule,
  DxCompareRule,
  DxSimpleItem,
  DxLabel,
  DxAsyncRule
} from "devextreme-vue/form";
import {DxCheckBox, DxSelectBox} from "devextreme-vue";
import DxToolbar, {DxItem} from "devextreme-vue/toolbar";
import {DxNumberBox} from "devextreme-vue/number-box";
import {DxLoadPanel} from "devextreme-vue/load-panel";
import TaiKhoanEdit from "~/pages/HeThong/TaiKhoanBenhVien/components/TaiKhoanEdit";
import BenhVienCombobox from  "~/components/Templates/BenhVien/BenhVienCombobox"
import DoiMatKhau from "~/pages/HeThong/TaiKhoanBenhVien/components/DoiMatKhau";

export default {
  middleware: ["auth"],
  components: {
    DoiMatKhau,
    TaiKhoanEdit,
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxEditing,
    DxLookup,
    DxCheckBox,
    DxSelectBox,
    DxExport,
    DxSelection,
    DxKeyboardNavigation,
    DxToolbar,
    DxItem,
    DxNumberBox,
    DxScrolling,
    DxSorting,
    DxLoadPanel,
    DxPopup,
    DxPosition,
    DxForm,
    DxItemForm, DxSearchPanel, DxFilterRow, DxHeaderFilter, DxGroupPanel, DxGrouping,
    DxRequiredRule,
    DxSimpleItem,
    DxLabel,
    DxAsyncRule,
    DxCompareRule,
    BenhVienCombobox
  },
  watch: {
    modelThang(val) {
      this.GetData();
    },
    modelNam(val) {
      this.GetData();
    }
  },
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
      //
      tinhTrang: 1,
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
      parDuLieu: {
        hospitalId: null,
      }

    };
  },
  created() {
    this.$store.commit("setTilePage", "Danh mục tài khoản bệnh viện");
    this.GetData();
    this.parDuLieu.hospitalId = this.user.hospital.hospital_id;
  },
  methods: {
    getTenNhomPhanQuen(list) {
      let name = [];

      if (list)
        list.forEach(item => {
          let phanQuyen = this.phanQuyenSource.filter(x => x.phan_quyen_id === item);
          if (phanQuyen && phanQuyen.length > 0) {
            name.push(phanQuyen[0].cap_do);
          }
        })

      return name
    },
    async GetData() {
      this.loadingVisible = true;
      let par = {
        hospitalId: this.user.hospital.hospital_id,
      }
      if (this.tinhTrang >= 0) {
        par.tinhTrang = this.tinhTrang
      }

      await this.$services.auth
        .apiGetAll(par)
        .then(res => {
          this.dataSource = res.data.data;
        })
        .catch(res => {
          this.$buefy.toast.open("Có lỗi khi load dữ liệu");
        });

      await this.$services.nhanvien
        .apiGetAll()
        .then(res => {
          this.nhanVienSource = res.data.data;

        })
        .catch(err => {
          console.log(err);

        });
      await this.$services.phanquyen
        .apiGetAll()
        .then(res => {
          this.phanQuyenSource = res.data.data;

        })
        .catch(err => {
          console.log(err);
        });

      await this.$services.hospital
        .apiGetAll()
        .then(res => {
          this.benhVienDataSource = res.data.data;

        })
        .catch(err => {
          console.log(err);
        });
      this.loadingVisible = false;

    },
    saveGridInstance: function (e) {
      this.dataGridInstance = e.component;
    },
    async openFormThemMoi() {
      this.dataEdit = null;
      this.dialogThemMoi = true;
      this.isAddNew = true;
    },
    openFormEdit(item) {
      this.dataEdit = item.data.row.data;
      this.dialogThemMoi = true;
      this.isAddNew = false;

    },
    openFormDoiMatKhau(item) {
      this.dataEdit = item.data.row.data;
      this.dialogDoiMatKhau = true;
    },


  }
};
</script>

<style scoped>
#gridContainer {
  height: 80vh;
}
</style>
