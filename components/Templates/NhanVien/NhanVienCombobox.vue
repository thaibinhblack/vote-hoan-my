<template>
  <div>
    <DxSelectBox
      stylingMode="underlined"
      :search-enabled="true"
      :data-source="fromUngroupedData"
      search-mode="contains"
      :search-expr="searchExprOption"
      itemTemplate="item"
      :grouped="true"
      :value="value"
      @selection-changed="onSelectionChanged"
      :show-clear-button="true"
      :placeholder="label"
      display-expr="ten_nhan_vien"
      value-expr="nhan_vien_id"
      ref="mySelectBox"
    >
      <template #group="item">
        {{ item.data.key }}
      </template>
      <template #item="{ data }">
        {{ data.ma_nhan_vien }} - {{ data.ten_nhan_vien }}
      </template>
    </DxSelectBox>
  </div>
</template>
<script>
import {DxColumn, DxDataGrid, DxFilterRow, DxPaging, DxScrolling, DxSelection} from "devextreme-vue/data-grid";
import DxDropDownBox from "devextreme-vue/drop-down-box";
import {DxSelectBox} from "devextreme-vue/select-box";
import DataSource from "devextreme/data/data_source";
import notify from "devextreme/ui/notify";
import {mapGetters} from "vuex";

const dropDownBoxRefName = "dropDownBoxRef";

export default {
  auth: false,
  components: {
    DxDataGrid,
    DxPaging,
    DxSelection,
    DxScrolling,
    DxColumn,
    DxDropDownBox,
    DxFilterRow,
    DxSelectBox
  },
  props: {
    label: {
      type: String,
      default: "Tên nhân viên"
    },
    value: {
      type: Number,
      default: null
    },
    text: {
      type: String,
      default: null,
    },
    tenNhanVienHienThi: {
      type: String,
      default: "abc"
    }
  },
  computed: {
    ...mapGetters({
      nhanVien: "danhMuc/getDanhsachNhanVien"
    })
  },
  data() {
    return {
      dataSource: [],
      fromUngroupedData: {},
      currentValue: this.value,
      dropDownOptions: {width: 500},
      dropDownBoxRefName,
      searchTimeoutOption: 200,
      minSearchLengthOption: 0,
      searchExprOption: ["ma_nhan_vien", "ten_nhan_vien", "ten_phong_ban"]
    };
  },
  async created() {
    await this.NapDuLieu();
  },
  mounted() {
  },
  methods: {
    async NapDuLieu() {
      if (this.nhanVien.length === 0) {
        await this.$services.nhanvien
          .apiGetAllNhanVienCombobox()
          .then(res => {
            if (res.data.code === 200) {
              this.$store.commit("danhMuc/setDanhSachNhanVien", res.data.data);
            }
          })
          .catch(err => {
            if (err.response && err.response.data) {
              const message = err.response.data.message;

              if (message) {
                notify(message, "error", 3000);
              }
            }
          });
      }

      this.fromUngroupedData = new DataSource({
        store: this.nhanVien,
        key: "nhan_vien_id",
        group: "ten_phong_ban"
      });
    },
    onSelectionChanged(e) {
      if (e.selectedItem) {
        this.$emit("update:value", e.selectedItem.nhan_vien_id);
        this.$emit("update:text", e.selectedItem.ten_nhan_vien);
      } else {
        this.$emit("update:value", null);
        this.$emit("update:text", null);
      }
    },
    ResetCombo() {
      this.$refs.mySelectBox.instance.reset();
      this.$refs.mySelectBox.instance.focus()
    },
  }
};
</script>
