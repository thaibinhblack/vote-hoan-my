<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :show-borders="true"
      :data-source="phanQuyenData"
      key-expr="phan_quyen_id"
      :selection="{ mode: 'single' }"
      @selection-changed="onSelectionChanged"
      @toolbar-preparing="onToolbarPreparing($event)"
      :column-hiding-enabled="true"
      :column-auto-width="true"
      :allow-column-resizing="true"
      column-resizing-mode="widget"
    >
      <dx-search-panel :visible="true" :width="240" placeholder="Search..."/>
      <dx-column alignment="center" cell-template="menuTemplet" data-field="tai_khoan_id" caption="Menu"/>
      <DxColumn alignment="center" data-field="phan_quyen_id" caption="Id"/>
      <DxColumn alignment="center" :group-index="0" data-field="du_an.ten_du_an" caption="Tên dự án"/>
      <DxColumn data-field="cap_do" caption="Tên nhóm"/>
      <DxColumn alignment="center" data-field="tinh_trang" caption="Tình trạng"/>
      <DxColumn alignment="center" data-field="mac_dinh" caption="Mặc định"/>
      <template #menuTemplet="item">
        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-on="on" v-bind="attrs" color="primary" @click="openFormEdit(item)">create</v-icon>
            </template>
            <span>Chỉnh sửa</span>
          </v-tooltip>
        </div>
      </template>
      <template #btnAddNew="{ data }">
        <v-btn
          @click="openFormThemMoi"
          fab
          x-small
          dark
          color="blue"
          class="ml-3"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </template>
    </DxDataGrid>

    <PhanQuyenEdit @success="GetData" :dataEdit="dataEdit" :add-new="isAddNew" :dialog.sync="dialogThemMoi"
                   v-if="dialogThemMoi"/>
  </div>
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
  DxForm,
  DxPager,
  DxSearchPanel
} from "devextreme-vue/data-grid";
import PhanQuyenEdit from "~/pages/HeThong/PhanQuyen/component/PhanQuyenEdit";

export default {
  components: {
    PhanQuyenEdit,
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
  },
  props: {
    duAnId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      phanQuyenData: [],
      dialogThemMoi: false,
      dataEdit: {},
      isAddNew: false,

    };
  },
  methods: {
    onToolbarPreparing(e) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        template: 'btnAddNew'
      });
    },
    async openFormThemMoi() {

      this.dataEdit = {};
      this.dialogThemMoi = true;
      this.isAddNew = true;
    },
    openFormEdit(item) {
      this.dataEdit = item.data.row.data;
      this.dialogThemMoi = true;
      this.isAddNew = false;

    },
    GetData() {
      this.GetDataPhanQuyen(this.duAnId);
    },
    async GetDataPhanQuyen(duAnId) {
      this.loadingVisible = true;
      let par = {}

      await this.$services.phanquyen
        .apiGetAll(par)
        .then(res => {
          this.phanQuyenData = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });

      this.loadingVisible = false;
    },
    onSelectionChanged({selectedRowsData}) {
      if (selectedRowsData[0]) {
        this.$emit("RowSelectChange", selectedRowsData[0]);
      }
    }
  },
  created() {
    this.GetData();
  }
};
</script>
