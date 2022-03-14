<template>
  <v-container fluid>

    <v-row no-gutters justify="center" align="center">

      <v-btn v-if="!editData" @click.stop="ThemMoi()" tile outlined color="primary">
        <v-icon left>mdi-pencil</v-icon>
        Thêm mới
      </v-btn>
      <v-btn v-if="editData" @click.stop="SaveData" class="ma-1" tile dark color="red darken-3">
        <v-icon left>mdi-content-save</v-icon>
        Lưu
      </v-btn>
      <v-btn v-if="!editData" class="ma-1" @click="GetData" dark tile color="secondary">
        <v-icon left>mdi-refresh</v-icon>
        Làm mới
      </v-btn>

      <v-btn v-if="editData" class="ma-1" @click="DisableChange" dark tile color="blue">
        <v-icon left>mdi-keyboard-return</v-icon>
        Hủy chỉnh sửa
      </v-btn>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="accent"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon left>menu</v-icon>
            Chức năng
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="onClickTaiFile">
            <v-list-item-title>
              <v-icon left>get_app</v-icon>
              Tải file import
            </v-list-item-title>
          </v-list-item>
          <v-list-item type="file" @click="onClickImportData">
            <v-list-item-title>
              <v-icon left>cloud_upload</v-icon>
              Import nhân viên
              <input
                ref="uploader"
                class="d-none"
                type="file"
                accept=".xlsx"
                @change="onFileChanged"
              >
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer/>
      <DxTextBox
        @key-down="onKeyDownTimKiem"
        placeholder="Nhập nội dung tìm kiếm..."
        :showClearButton="true" :width="500"
        :value.sync="noiDungTimKiem"/>
      <v-btn color="primary" class="ma-3" @click="onClickTimKiem">
        <span>Tìm kiếm</span>
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
      @initialized="saveGridInstance"
      id="gridNhanVien"
      :show-borders="true"
      :remote-operations="true"
      :data-source="dataNhanVien"
      :word-wrap-enabled="true"
      :allow-column-resizing="true"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :focused-row-enabled="true"
      key-expr="nhan_vien_id"
      @row-updated="onRowUpdated"
      @init-new-row="onRowNewRow"
      @row-inserted="onRowInserted"
      @row-removing="onRowRemoving"
      :allowColumnResizing="true"
      column-resizing-mode="widget"
    >
      <dx-paging :page-size="12"/>
      <dx-pager :show-page-size-selector="true" :allowed-page-sizes="[8, 12, 20,100]"/>
      <dx-keyboard-navigation
        :edit-on-key-press="true"
        enter-key-action="moveFocus"
        enter-key-direction="column"
      />

      <dx-paging :enabled="false"/>
      <dx-editing :allow-updating="true" :allow-deleting="true" mode="popup">
        <dx-popup :show-title="true" :width="700" :height="525" title="Nhân viên">
          <dx-position my="center" at="center"/>
        </dx-popup>
        <dx-form :form-data="itemUpdate">
          <DxItemForm :col-count="1" :col-span="2" item-type="group">
            <DxItemForm data-field="ma_nhan_vien"></DxItemForm>
            <DxItemForm data-field="ten_nhan_vien"></DxItemForm>
            <DxItemForm data-field="gioi_tinh"/>
            <DxItemForm data-field="chuc_danh_id"/>
            <DxItemForm data-field="chuc_vu_id"/>
            <DxItemForm data-field="tinh_trang"/>
          </DxItemForm>
        </dx-form>
      </dx-editing>
      <!--      <dx-search-panel :visible="true" :width="240" placeholder="Search..."/>-->

      <dx-column alignment="center" :width="70" data-field="nhan_vien_id" caption="ID"/>
      <dx-column alignment="center" data-field="ma_nhan_vien" caption="Mã nhân viên">
        <dx-required-rule/>
      </dx-column>
      <dx-column data-field="ten_nhan_vien" caption="Tên nhân viên">
        <dx-required-rule/>
      </dx-column>
      <dx-column data-field="gioi_tinh" caption="Giới tính (Nam/Nữ)"></dx-column>
      <dx-column data-field="chuc_danh_id" caption="Chức danh" alignment="center">
        <dx-lookup :data-source="dataChucDanh" value-expr="chuc_danh_id" display-expr="ten_chuc_danh"/>
        <dx-required-rule/>
      </dx-column>
      <dx-column data-field="chuc_vu_id" caption="Chức vụ" alignment="center">
        <dx-lookup :data-source="dataChucVu" value-expr="chuc_vu_id" display-expr="ten_chuc_vu"/>
        <dx-required-rule/>
      </dx-column>
      <dx-column data-field="tinh_trang" caption="Tình trạng"></dx-column>

      <template #gioi-tinh-template="{ data }">
        <div v-if="data === true">Nam</div>
        <div v-else>Nữ</div>
      </template>
    </dx-data-grid>


    <v-row align="center" justify="center" class="mt-3" no-gutters>
      <v-col cols="8">
        <v-row justify="center">
          <v-pagination
            v-model="curentPage"
            class="fex"
            :length="paging.last_page!=null?paging.last_page:0"
            @input="pageChangeHandler"
          />
          <DxSelectBox
            class="ml-3"
            v-model="pageNumberSelect"
            :items="pageNumber"
            :width="100"
            @selection-changed="onSelectionPageNumberChanged"
          />
        </v-row>

      </v-col>

    </v-row>
    <v-row class="mt-3" justify="center">
      <v-chip class="ml-2" label color="secondary">
        {{ paging.first }} - {{ paging.last }} / {{ paging.total }} rows
      </v-chip>
    </v-row>


  </v-container>
</template>
<script>
import {DxTextBox} from "devextreme-vue";

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
  DxForm,
  DxPager,
  DxSearchPanel
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
import notify from "devextreme/ui/notify";
import {DxNumberBox} from "devextreme-vue/number-box";
import {DxLoadPanel} from "devextreme-vue/load-panel";
import {SaveBlob} from "~/utils/file";


function getNewFileName() {
  return "ChiSoHoatDong_" + new Date().getTime();
}

export default {
  middleware: "auth",
  components: {
    DxTextBox,
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
    DxItemForm,
    DxRequiredRule,
    DxSimpleItem,
    DxLabel,
    DxAsyncRule,
    DxCompareRule,
    DxPager,
    DxSearchPanel
  },
  data() {
    return {
      //Paging
      pageNumberSelect: 100,
      curentPage: 1,
      paging: {
        total_page: 0
      },
      pageNumber: [
        50, 100, 200, 300, 400
      ],
      noiDungTimKiem: null,
      //
      loadingVisible: false,
      editData: false,
      allowUpdating: false,
      // Data Api
      dataNhanVien: [],
      dataChucDanh: [],
      dataChucVu: [],
      // End Data Api

      dataGridInstance: null,

      itemUpdate: {
        ten_tai_khoan: "",
        mat_khau: "",
        tinh_trang: true,
        don_vi: "HMDL",
        domain_login: false,
        tu_dong_dang_nhap: false,
        phan_quyen_id: null,
        nhan_vien_su_dung_id: null
      }
    };
  },
  created() {
    this.$store.commit("setTilePage", "Danh mục nhân viên");
    this.GetDataCombobox();
    this.GetData();

  },
  methods: {
    onClickTaiFile(e){
      this.$services.nhanvien.apiDowloadFileImport()
        .then(res => {
          if (res.status === 200) {
            const blob = new Blob([res.data], {
              type: "application/vnd.ms-excel;charset=utf-8"
            });

            SaveBlob(blob, "file-hang-hoa-import.xlsx")
            //FileSaver.saveAs(blob, "file-hang-hoa-import.xlsx");
          }
        })
        .catch(err => {
          console.log(err);
          notify("Lỗi get report", "error")
        })
    },
    onClickImportData(e){},
    onFileChanged(e){},
    onSelectionPageNumberChanged() {
      this.curentPage = 1
      this.GetData()
    },
    pageChangeHandler(selectedPage) {
      this.curentPage = selectedPage
      this.GetData();
    },
    onToolbarPreparing(e) {
      var toolbarItems = e.toolbarOptions.items;
      toolbarItems.forEach(function (item) {
        if (item.name === "saveButton" || item.name === "revertButton") {
          item.visible = false;
        }
      });
    },
    onKeyDownTimKiem(e) {
      const keyCode = e.event.key;
      if (keyCode === 'Enter') {
        this.paging.page = 1

        // Tránh chưa cập nhật value search sau 0,8s mới gọi hàm tìm kiếm
        setTimeout(() => {
          this.GetData();
        }, 800)
      }
    },
    //Get instance grid
    saveGridInstance(e) {
      this.dataGridInstance = e.component;
    },
    // Get dữ liệu combobox lưới
    async GetDataCombobox() {
      await this.$services.chucdanh
        .apiGetChucDanhAll()
        .then(res => {
          this.dataChucDanh = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
      await this.$services.chucvu
        .apiGetChucVuAll()
        .then(res => {
          this.dataChucVu = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    async GetData() {
      this.loadingVisible = true;
      let par = {
        top: this.pageNumberSelect,
        page: this.curentPage,
        search: this.noiDungTimKiem,
      }
      await this.$services.nhanvien
        .apiGetAll(par)
        .then(res => {
          this.dataNhanVien = res.data.data;
          this.paging = res.data.paging;
          console.log(this.paging);
        })
        .catch(err => {
          console.log(err);
        });


      this.loadingVisible = false;
    },
    //Xử lý event row
    async onRowNewRow(e) {
    },
    async onRowRemoving(e) {
      if (e.cancel === false) {
        const dataRemove = e.data;

        await this.$services.nhanvien
          .apiDeletebyId(dataRemove.id)
          .then(res => {
            notify("Xóa thành công");
          })
          .catch(err => {
            notify("Lỗi cập nhật dữ liệu", "error", 3000);
            console.log(err);
          });
      }
    },
    async onRowInserted(e) {
      const dataInsert = e.data;

      let itemInserted = {
        ma_nhan_vien: dataInsert.ma_nhan_vien,
        ten_nhan_vien: dataInsert.ten_nhan_vien,
        gioi_tinh: dataInsert.gioi_tinh,
        tinh_trang: dataInsert.tinh_trang,
        chuc_vu_id: dataInsert.chuc_vu_id,
        chuc_danh_id: dataInsert.chuc_danh_id
      };

      await this.$services.nhanvien
        .apiInsert(itemInserted)
        .then(res => {
          notify("Thêm thành công");
        })
        .catch(err => {
          notify("Lỗi cập nhật dữ liệu", "error", 3000);
          console.log(err);
        });

      this.GetData();
    },
    async onRowUpdated(e) {
      const dataUpdate = e.data;

      await this.$services.nhanvien
        .apiUpdate(dataUpdate)
        .then(res => {
          notify("Cập nhật thành công");
        })
        .catch(err => {
          notify("Lỗi cập nhật dữ liệu", "error", 3000);
          console.log(err);
        });
      this.GetData();
    },
    onClickTimKiem() {
      this.curentPage = 1
      this.GetData()
    },

    ThemMoi() {
      this.dataGridInstance.addRow();
    },
    DisableChange() {
      this.dataGridInstance.cancelEditData();
      this.editData = false;
      this.allowUpdating = false;
    },
    async SaveData() {
      this.numUpdate = 0;
      this.loadingVisible = true;
      await this.dataGridInstance.saveEditData().then(res => {
        this.loadingVisible = false;
      });

      this.editData = false;
      this.allowUpdating = false;
    },
    async ExportData(DataExport) {
      await this.$services.uploadfile
        .apiGetFileUploadByCode("danhmuctaikhoan")
        .then(res => {
          var url = res.data.link;
          if (url) this.$Utils.Export.ExportExelWithTemplet(DataExport, url);
          else
            notify(
              "Lỗi lấy templet báo cáo, vui lòng liên hệ IT!",
              "warning",
              3000
            );
        })
        .catch(res => {
          console.log(res);
          notify(
            "Lỗi cập nhật:" + item.data.dm_chi_so_hoat_dong.ten_chi_so,
            "warning",
            500
          );
        });
    },

  }
};
</script>


<style>
#gridNhanVien {
  height: 70vh;
}

</style>
