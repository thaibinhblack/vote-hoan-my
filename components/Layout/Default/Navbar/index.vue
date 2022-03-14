<template>
  <div>
    <v-list v-if="treeData && treeData.length >0" dense>
      <div v-for="item in treeData" :key="item.id">
        <ItemNav :item="item"></ItemNav>
      </div>
    </v-list>
  </div>
</template>

<script>
import ItemNav from "~/components/Layout/Default/Navbar/ItemNav";

export default {
  components: {ItemNav},
  props: {
    treeData: {
      type: Array,
      required: true,
      default: function () {
        return []
      }
    }
  },
  methods: {}
};
</script>
