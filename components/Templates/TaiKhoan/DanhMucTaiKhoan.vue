<template>
  <DxDataGrid
    id="gridContainer"
    :show-borders="true"
    :data-source="dataTable"
    key-expr="tai_khoan_id"
    :selection="{ mode: 'single' }"
    @selection-changed="onSelectionChanged"
    :allow-column-resizing="true"
    column-resizing-mode="widget"
    :allow-column-reordering="true"
    :column-auto-width="true"
    :wordWrapEnabled="true"
  >
    <DxPaging :enabled="false"/>
    <DxSearchPanel :width="300" :visible="true"/>
    <DxHeaderFilter :visible="true"/>
    <!--    <DxColumn width="30" data-field="tai_khoan_id" caption="ID"/>-->
    <DxColumn width="150" data-field="ten_tai_khoan" caption="Tên tài khoản"/>
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
    </dx-column>
    <DxColumn width="200" data-field="display_name" caption="Tên hiển thị"/>
    <dx-column data-field="nhom_phan_quyen" caption="Nhóm phân quyền" cell-template="nhomPhanQuyen"/>
    <template #nhomPhanQuyen="{ data: cellInfo }">
      <div>
          <span v-for="(item,index) in getTenNhomPhanQuen(cellInfo.value)" :key="index">
            {{ item }},
          </span>
      </div>
    </template>
    <DxColumn width="100" data-field="tinh_trang" caption="Active"/>
    <DxColumn width="150" data-field="department" caption="Department"/>
  </DxDataGrid>
</template>
<style scoped>

#gridContainer {
  height: 75vh;
}

</style>

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
  DxSearchPanel, DxHeaderFilter
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
    DxSearchPanel, DxHeaderFilter
  },
  data() {
    return {
      dataTable: [],
      benhVienDataSource: [],
      phanQuyenSource: [],

    };
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

      await this.$services.auth
        .apiGetAll()
        .then(res => {
          this.dataTable = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });

      this.loadingVisible = false;
    },
    onSelectionChanged({selectedRowsData}) {

      if (selectedRowsData) {
        this.$emit("RowSelectChange", selectedRowsData[0]);
      }
    }
  },
  created() {
    this.GetData();
  }
};
</script>
