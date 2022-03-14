<template>
  <v-container>

    <v-row justify="center" align="center">
      <v-col cols="12">
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
      </v-col>
    </v-row>

    <v-row no-gutters justify="center" class="ma-3">
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
      :data-source="dataTable"
      :word-wrap-enabled="true"
      :allow-column-resizing="true"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :focused-row-enabled="true"
      key-expr="chuc_vu_id"
      @row-updated="onRowUpdated"
      @init-new-row="onRowNewRow"
      @row-inserted="onRowInserted"
      @row-removing="onRowRemoving"
      :allowColumnResizing="true"
      column-resizing-mode="widget"
    >
      <DxHeaderFilter
        :visible="true"
      />
      <DxFilterRow
        :visible="true"
      />
      <dx-paging :page-size="12"/>
      <dx-pager :show-page-size-selector="true" :allowed-page-sizes="[8, 12, 20,100]"/>
      <dx-keyboard-navigation
        :edit-on-key-press="true"
        enter-key-action="moveFocus"
        enter-key-direction="column"
      />

      <dx-paging :enabled="false"/>
      <dx-editing :allow-updating="true" :allow-deleting="true" mode="popup">
        <dx-popup :show-title="true" :width="700" :height="525" title="Cập nhật">
          <dx-position my="center" at="center"/>
        </dx-popup>
        <dx-form :form-data="itemUpdate">
          <DxItemForm :col-count="1" :col-span="2" item-type="group">
            <DxItemForm data-field="ten_chuc_vu"/>
            <DxItemForm data-field="ten_chuc_vu_viet_tat"/>
            <DxItemForm dataType="boolean" data-field="tinh_trang"/>
          </DxItemForm>
        </dx-form>
      </dx-editing>

      <dx-column alignment="center" :width="70" data-field="chuc_vu_id" caption="ID"/>
      <dx-column data-field="ten_chuc_vu" caption="Tên chức vụ">
        <dx-required-rule/>
      </dx-column>

      <dx-column data-field="ten_chuc_vu_viet_tat" caption="Tên viết tắt"/>
      <dx-column dataType="boolean" data-field="tinh_trang" caption="Tình trạng"/>

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
  DxSearchPanel, DxFilterRow, DxHeaderFilter
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
import CheckError from "~/utils/handlerErro";


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
    DxSearchPanel, DxFilterRow, DxHeaderFilter
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
      dataTable: [],

      dataPhongBanCombobox: [],
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
    this.$store.commit("setTilePage", "Danh mục chức vụ");
    this.GetDataCombobox();
    this.GetData();

  },
  methods: {
    onSelectionPageNumberChanged() {
      this.curentPage = 1
      this.GetData()
    },
    pageChangeHandler(selectedPage) {
      this.curentPage = selectedPage
      this.GetData();
    },
    onToolbarPreparing(e) {
      const toolbarItems = e.toolbarOptions.items;
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


    },
    async GetData() {
      this.loadingVisible = true;
      let par = {
        top: this.pageNumberSelect,
        page: this.curentPage,
        search: this.noiDungTimKiem,
      }
      await this.$services.chucvu
        .apiGetAll(par)
        .then(res => {
          this.dataTable = res.data.data;
          this.paging = res.data.paging;
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

        await this.$services.chucvu
          .apiDeletebyId(dataRemove.chuc_vu_id)
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
      console.log("------onRowInserted------")

      const dataInsert = e.data;
      let itemInserted = {
        ten_phong_ban: dataInsert.ten_phong_ban,
        tinh_trang: dataInsert.tinh_trang,
        parent_key_id: dataInsert.parent_key_id,
      };

      await this.$services.chucvu
        .apiInsert(itemInserted)
        .then(res => {
          notify("Thêm thành công");
        })
        .catch(err => {
          CheckError(err);
        });

      await this.GetData();
    },
    async onRowUpdated(e) {

      console.log("------onRowUpdated------")

      const dataUpdate = e.data;

      await this.$services.chucvu
        .apiUpdate(dataUpdate)
        .then(res => {
          notify("Cập nhật thành công");
        })
        .catch(err => {
          CheckError(err);
        });
      await this.GetData();
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
          let url = res.data.link;
          if (url) this.$Utils.Export.ExportExelWithTemplet(DataExport, url);
          else
            notify(
              "Lỗi lấy templet báo cáo, vui lòng liên hệ IT!",
              "warning",
              3000
            );
        })
        .catch(err => {
          CheckError(err);
        });
    },
  }
};
</script>


<style>
#gridNhanVien {
  height: 60vh;
}

</style>
