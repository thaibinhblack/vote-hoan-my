<template>
  <DxSelectBox
    :search-enabled="true"
    :data-source="dataSource"
    search-mode="contains"
    :search-expr="searchExprOption"
    itemTemplate="item"
    :value="localState"
    display-expr="ten_phong_ban"
    value-expr="phong_ban_id"
    @selection-changed="onSelectionChanged"
    :show-clear-button="true"
    :readOnly="readOnly"
    :width="300"
  >
    <template #item="{ data }">
      {{ data.ten_phong_ban }}
    </template>
  </DxSelectBox>
</template>
<script>


import {DxSelectBox} from "devextreme-vue/select-box";
import notify from "devextreme/ui/notify";

const dropDownBoxRefName = "dropDownBoxRef";

export default {
  components: {
    DxSelectBox
  },
  props: {
    value: {
      type: Number,
      default: null
    },
    readOnly: false,
  },
  computed: {
    localState: {
      get() {
        return this.value;
      },
      set(localState) {
        this.$emit("input", localState ? localState : null);
      },

    }
  },
  data() {
    return {
      currentValue: this.value,
      dropDownOptions: {width: 500},
      dropDownBoxRefName,
      dataSource: [],
      searchTimeoutOption: 200,
      minSearchLengthOption: 0,
      searchExprOption: ["ten_phong_ban"]
    };
  },
  async created() {
    await this.NapDuLieu();
    if (this.value) {
      this.$emit("input", this.value);
    }
    console.log("Phong ban value", this.value)
  },
  methods: {
    async NapDuLieu() {
      this.$services.phongban
        .apiGetPhongBanCombobox()
        .then(res => {
          if (res.data.code === 200) {
            this.dataSource = res.data.data;
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
    },
    onSelectionChanged(e) {

      if (e.selectedItem) {
        this.$emit("update:value", e.selectedItem.phong_ban_id);
        this.$emit("update:text", e.selectedItem.ten_phong_ban);
        this.$emit("input", e.selectedItem.phong_ban_id);
      } else {
        this.$emit("update:value", null);
        this.$emit("update:text", null);
        this.$emit("input", null);
      }
    }
  }
};
</script>
