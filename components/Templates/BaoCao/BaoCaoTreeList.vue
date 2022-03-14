<template>
  <div class="treeHospital">
    <DxTreeList
      :id="noLimit ? 'no-limit-treeview ': 'simple-treeview'"
      :data-source="items"
      search-mode="contains"
      data-structure="plain"
      parent-id-expr="parent_id"
      key-expr="id"
      display-expr="name"
      :show-row-lines="true"
      :show-borders="true"
      :expanded-row-keys="expandedRowKeys"
      :selected-row-keys.sync="selectedRowKeys"
      :focused-row-enabled="true"
      :word-wrap-enabled="true"
      @focused-row-changed="onFocus"
    >
      <DxSelection :recursive="true" mode="single"/>
      <DxFilterRow
        :visible="true"
      />

      <DxColumn
        caption="Tên báo cáo"
        data-field="name"
      />
      <!--      <DxColumn-->
      <!--        :width="100"-->
      <!--        caption="code"-->
      <!--        data-field="code"-->
      <!--      />-->
    </DxTreeList>

  </div>
</template>
<script>
import {
  DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLookup, DxFilterRow
} from 'devextreme-vue/tree-list';


export default {
  components: {
    DxTreeList, DxColumn, DxColumnChooser, DxHeaderFilter, DxSearchPanel, DxSelection, DxLookup, DxFilterRow
  },
  props: {
    noLimit: {
      type: Boolean,
      default: false
    },
    phanQuyen: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
    },
    onFocusedRowChanged: {
      type: Function,
    }
  },
  data() {

    return {
      items: [],
      expandedRowKeys: [1, 2, 10],
      selectedRowKeys: [],
    };
  },
  async created() {
    this.loading = true;
    await this.GetData();
    this.loading = false;
  },
  methods: {
    async GetData() {
      if (this.phanQuyen) {
        await this.$services.reports.apiBaoCaoTheoPhanQuyenId()
          .then(res => {
            if (res.status === 200) {
              this.items = res.data.data;
            }
          }).catch(err => {
            console.log(err)
          });
      }

      this.items = [
        {id: 1, code: "BCNXT", name: "Báo cáo nhập xuất tồn"},
        {id: 2, code: "BCTK", name: "Báo cáo thẻ kho"},
        {id: 3, code: "BBKK", name:"Biên bản kiểm kê"}
      ]


    },
    onFocus(e) {
      let rowData = e.row && e.row.data, cellValue, assigned;

      if (rowData) {
        this.$emit("update:value", rowData);
        this.$emit('onFocusedRowChanged', rowData)
      }
    },

  }
};
</script>
<style scoped lang="css">
.treeHospital {
  width: 100%;
}

.element.style {
  max-width: 100%;
}

#simple-treeview {
  width: 100%;
  min-height: 400px;
  max-height: 400px;
}

#no-limit-treeview {
  width: 100%;
}

</style>
