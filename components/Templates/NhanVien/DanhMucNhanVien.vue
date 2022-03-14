<template>
  <DxDataGrid
    id="gridContainer"
    :show-borders="true"
    :data-source="phanQuyenData"
    key-expr="phan_quyen_id"
    :selection="{ mode: 'single' }"
    @selection-changed="onSelectionChanged"
  >
    <!-- <dx-search-panel :visible="true" :width="240" placeholder="Search..." /> -->
    <DxColumn alignment="center" data-field="phan_quyen_id" caption="Id" />
    <DxColumn alignment="center" data-field="cap_do" caption="Cấp" />
    <DxColumn alignment="center" data-field="tinh_trang" caption="Tình trạng" />
  </DxDataGrid>
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
export default {
  components: {
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
  data() {
    return {
      phanQuyenData: []
    };
  },
  methods: {
    async GetData() {
      this.loadingVisible = true;

      await this.$services.phanquyen
        .apiGetAll()
        .then(res => {
          this.phanQuyenData = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });

      this.loadingVisible = false;
    },
    onSelectionChanged({ selectedRowsData }) {
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
