<template>
  <div class="treeHospital mt-3">
    <DxTreeList
      @initialized="saveInstance"
      id="simple-treeview"
      :data-source="items"
      search-mode="contains"
      data-structure="plain"
      parent-id-expr="parent_id"
      key-expr="hospital_id"
      display-expr="name"
      :show-row-lines="true"
      :show-borders="true"
      :expanded-row-keys="expandedRowKeys"
      :selected-row-keys.sync="selectedRowKeys"
      @item-click="selectItem"
      @selection-changed="onSelectionChanged"
    >
      <DxSelection :recursive="true" mode="multiple"/>
      <DxFilterRow
        :visible="true"
      />
      <DxColumn
        :width="300"
        caption="Tên bệnh viện"
        data-field="name"
      />
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
    value: {
      type: Array,
    },
    phanQuyen: {
      type: Boolean,
      default: false
    },
  },
  computed: {},
  data() {

    return {
      benhVienTree: {},
      items: [],
      expandedRowKeys: [],
      selectedRowKeys: [],
    };
  },
  async created() {
    this.GetData();
  },
  methods: {
    GetData() {
      this.loading = true;

      if (this.phanQuyen) {
        this.$services.hospital.apiGetAllByTaiKhoanId()
          .then(res => {
            if (res.status === 200) {
              this.items = res.data.data;

              this.expandedRowKeys = this.items.map(x => x.hospital_id);
            }


          }).catch(err => {
          console.log(err)
        });
      }
      if (!this.phanQuyen) {
        this.$services.hospital.apiGetAll()
          .then(res => {
            if (res.status === 200) {
              this.items = res.data.data;

              this.expandedRowKeys = this.items.map(x => x.hospital_id);
            }


          }).catch(err => {
          console.log(err)
        });
      }

      this.loading = false;
    },
    saveInstance(e) {
      this.benhVienTree = e.component;
    },
    onSelectionChanged(e) {

      this.$emit("input", this.benhVienTree.getSelectedRowKeys("all"));
    },
    selectItem(e) {
      if (e && e.itemData) {
        this.$emit("update:value", e.itemData);
        this.$emit('onSelectionChanged', e.itemData)
      }


    }
  }
};
</script>
<style scoped lang="css">
.treeHospital {
  width: 100%;
}

#simple-treeview {
  width: 100%;
}

</style>
