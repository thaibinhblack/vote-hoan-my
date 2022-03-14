<template>
  <div class="treePhongBan">

    <DxTreeView
      ref="treePhongBan"
      :height="600"
      :items="dataTable"
      data-structure="plain"
      key-expr="phong_ban_id"
      parent-id-expr="parent_key_id"
      show-check-boxes-mode="selectAll"
      selection-mode="multiple"
      :select-nodes-recursive="true"
      :select-by-click="true"
      :searchEnabled="true"

      @selection-changed="treeViewSelectionChanged"
      @content-ready="treeViewContentReady"
    >
      <template #item="item">
        {{ item.data.ten_phong_ban }}
      </template>
    </DxTreeView>
  </div>

</template>

<script>
import DxTreeView from 'devextreme-vue/tree-view';

export default {
  components: {
    DxTreeView
  },
  computed: {},
  props: ["selected", "selected_key"],
  data() {
    return {
      dataTable: [],
      expandedRowKeys: [],
      selectedRowKeys: [],
    };
  },
  created() {
    this.GetData();
    this.expandAll();
  },
  methods: {
    expandAll() {
      let tree = this.$refs.treePhongBan;

      console.log(tree);

      if (tree) {
        tree.expandAll();
      }
    },
    collapseAll() {
      let tree = this.$refs.treePhongBan;

      if (tree) {
        tree.collapseAll();
      }
    },
    async GetData() {
      this.loadingVisible = true;

      await this.$services.phongban
        .apiGetAll()
        .then(res => {

          this.dataTable = [];
          let dataTree = res.data.data;

          if (dataTree) {
            dataTree.map(x => {
              x.expanded = false;
              x.selected = true;
            });
            this.dataTable = dataTree;
          }

        })
        .catch(err => {
          console.log(err);
        });

      this.loadingVisible = false;
    },
    async SetDataFocus(e) {
      this.loadingVisible = true;

      await this.$services.phongban
        .apiGetAll()
        .then(res => {

          this.dataTable = [];
          let dataTree = res.data.data;

          if (dataTree) {
            dataTree.map(x => {

              const check = _.find(e, (item) => {
                return item === x.phong_ban_id
              });

              x.expanded = check > 0;
              x.selected = check > 0;
            });
            this.dataTable = dataTree;
          }

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
    },
    treeViewSelectionChanged(e) {
      this.syncSelection(e.component);
    },
    treeViewContentReady(e) {
      this.syncSelection(e.component);
    },
    syncSelection(treeView) {
      this.selectedRowKeys = treeView.getSelectedNodes().map((node) => node.itemData);
      this.$emit("update:selected", this.selectedRowKeys);
    },


  },

};
</script>

<style scoped>
.treePhongBan {
  border: solid #1b8042 thin;
}
</style>
