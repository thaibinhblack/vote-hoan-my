<template>
  <DxTreeList
    id="phongBan"
    :data-source="dataTable"
    :show-row-lines="true"
    :show-borders="true"
    :column-auto-width="true"
    :word-wrap-enabled="true"
    :expanded-row-keys="expandedRowKeys"
    :selected-row-keys="selectedRowKeys"
    key-expr="phong_ban_id"
    parent-id-expr="parent_key_id"
    @initialized="saveGridInstance"
    @Selection-changed="onSelectionChanged"
  >
    <DxSearchPanel
      :visible="true"
      :width="300"
    />
    <DxSelection mode="single"/>

    <dx-column data-field="ten_phong_ban" caption="Tên phòng ban">
      <DxValidationRule type="required"/>
    </dx-column>

    <dx-column data-field="tinh_trang" caption="Tình trạng"></dx-column>

    <!-- End Column Table -->
  </DxTreeList>
</template>

<script>
import {
  DxColumn,
  DxEditing,
  DxLookup,
  DxSelection,
  DxTreeList,
  DxValidationRule,
  DxSearchPanel
} from "devextreme-vue/tree-list";

export default {
  components: {
    DxColumn, DxEditing, DxLookup, DxSelection, DxTreeList, DxValidationRule, DxSearchPanel
  },
  data() {
    return {
      dataTable: [],
      expandedRowKeys: [],
      selectedRowKeys: [],
      dataGridInstance: {}
    };
  },
  created() {
    this.GetData();
    console.log(this.dataGridInstance);
  },
  methods: {
    saveGridInstance(e) {
      this.dataGridInstance = e.component;
    },
    async GetData() {
      this.loadingVisible = true;

      await this.$services.phongban
        .apiGetAll()
        .then(res => {
          this.dataTable = res.data.data;

          this.dataTable.map(x => {
            if (x.parent_key_id == null) {
              x.parent_key_id = 0;
            }
            return x;
          })

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

};
</script>
<style>
#phongBan {
  height: 700px;
}
</style>
