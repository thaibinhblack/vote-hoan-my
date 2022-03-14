<template>
  <div class="treeHospital mt-3">
    <DxTreeView
      id="simple-treeview"
      :items="items"

      :search-enabled="true"
      search-mode="contains"
      data-structure="plain"
      parent-id-expr="parent_id"
      key-expr="hospital_id"
      display-expr="name"
      @item-click="selectItem"
    />

  </div>
</template>
<script>
import DxTreeView from 'devextreme-vue/tree-view';


export default {
  components: {
    DxTreeView
  },
  props: {
    value: {
      type: Number,
      default: null,
      require: true,
    },
    phanQuyen: {
      type: Boolean,
      default: false
    },
  },
  data() {

    return {
      items: [],
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
  border: 1px solid #1b8042;

}

</style>
