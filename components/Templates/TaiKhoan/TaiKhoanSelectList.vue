<template>
  <div>
    <DxDropDownBox
      stylingMode="underlined"
      :value.sync="gridBoxValue"
      :defer-rendering="false"
      :show-clear-button="true"
      :data-source="gridDataSource"
      :display-expr="gridBoxDisplayExpr"
      value-expr="tai_khoan_id"
      placeholder="Chọn dữ liệu..."
      id="ddbTaiKhoan"
      :input-attr="inputAttr"

    >
      <template #content="{ data }">
        <DxDataGrid
          :data-source="gridDataSource"
          :columns="gridColumns"
          :hover-state-enabled="true"
          :selected-row-keys.sync="gridBoxValue"
          key-expr="tai_khoan_id"
        >
          <DxSelection mode="multiple"/>
          <DxPaging
            :enabled="true"
            :page-size="10"
          />
          <DxFilterRow :visible="true"/>
          <DxScrolling mode="virtual"/>
        </DxDataGrid>
      </template>
    </DxDropDownBox>
  </div>
</template>

<script>
import DxDropDownBox from 'devextreme-vue/drop-down-box';
import {DxDataGrid, DxSelection, DxPaging, DxFilterRow, DxScrolling} from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';

export default {
  components: {
    DxDataGrid, DxSelection, DxPaging, DxFilterRow, DxScrolling, DxDropDownBox
  },
  props: {
    hospitalId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      inputAttr: {
        id: 'taiKhoanDro',
        class: 'dlTaiKhoan'
      },
      loading: false,
      gridBoxValue: [],
      gridDataSource: null,
      gridColumns: ['tai_khoan_id', 'ten_tai_khoan', 'display_name', 'department']
    }
  },
  mounted() {
    this.GetData();
  },
  methods: {
    gridBoxDisplayExpr(item) {
      return item && `${item.display_name} <${item.ten_tai_khoan}>`;
    },
    GetData() {
      this.loading = true;

      let par = {
        hospitalId: this.hospitalId
      }

      this.$services.auth.apiGetAll(par)
        .then(res => {
          if (res.status === 200) {
            this.gridDataSource = res.data.data;
          }
        })
        .catch(err => {
          console.log(err)
        });

      this.loading = false;
    },
  }
}
</script>

<style>
#taiKhoanDro {
  color: red !important;
  word-wrap: break-word;
  white-space: normal;
  width: 100%;
}



</style>
