<template>
  <div>
    <DxTagBox
      :data-source="dataSource"
      v-model:value="currentValue"
      :show-selection-controls="true"
      :max-displayed-tags="10"
      :show-multi-tag-only="false"
      :on-value-changed="(e) => onValueChanged(e.value)"
      :on-selection-changed="onSelectionChanged"
      :search-enabled="true"
      value-expr="tai_khoan_id"
      :display-expr="displayExpr"
      apply-value-mode="useButtons"

    >
      <template #item="{ data }">
        <div>
          {{data.display_name}} ({{data.ten_tai_khoan}}) - <b> {{data.department}} </b>
        </div>
      </template>
    </DxTagBox>
  </div>

</template>
<script>

import DxTagBox from 'devextreme-vue/tag-box';

export default {
  components: {DxTagBox},
  props: {
    value: {
      type: Array,
      default: () => []
    },
    onValueChanged: {
      type: Function,
      default: () => function () {
      }
    },
    dataSource: {},
    dataGridComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  methods: {
    displayExpr(item) {
      // "item" can be null
      return item &&  item.display_name + ' ('+item.ten_tai_khoan+')';
    },
    onSelectionChanged() {
      this.dataGridComponent.updateDimensions();
    }
  }
};
</script>
