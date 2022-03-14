<template>

  <ValidationProvider :name="label" rules="required" :invalid="valid" v-slot="{errors}"
                      :rules="required ? 'required':''">
    <v-combobox :items="items"
                :label="label"
                item-value="menu_id"
                :filter="seachQuery"
                cache-items
                :search-input.sync="search"
                :error-messages="errors"
                :prepend-icon="icon"
                v-model="select"
                @change="onSelectionChanged"

    >
      <template slot="selection" slot-scope="data">
        {{ data.item.menu_name }}
      </template>
      <template slot="item" slot-scope="data">
        <v-icon class="mr-5">{{ data.item.icon }}</v-icon>
        {{ data.item.menu_name }} - path : {{ data.item.path }}
      </template>
    </v-combobox>

  </ValidationProvider>

</template>


<script>
import {mapState} from "vuex"

export default {
  props: {
    label: {
      type: String,
      default: "Menu",
      require: true,
    },
    value: {
      type: Number,
      default: null,
      require: true,
    },
    duAnId: {
      type: Number,
      default: null,
      require: true,
    },
    valid: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: "archive",
      require: true,
    }

  },
  computed: {
    ...mapState({})
  },
  data() {
    return {
      loading: false,
      search: null,
      select: null,
      items: [],
    }
  },
  watch: {
    search(val) {
      // val && val !== this.select && this.querySelections(val)
    },
  },
  async created() {
    this.loading = true;
    await this.getDataMenu();
    this.loading = false;
  },
  updated() {
    console.log("-------updated------");
  },
  methods: {
    seachQuery(item, queryText, itemText) {
      return (
        item.menu_name.toLowerCase().includes(queryText.toLowerCase()) || item.path.toLowerCase().includes(queryText.toLowerCase()) || item.icon.toLowerCase().includes(queryText.toLowerCase())
      );
    },
    async getDataMenu() {
      if (!this.duAnId) return;
      await this.$services.menu.getMenuByDuanId(this.duAnId)
        .then(res => {
          if (res.status === 200) {
            this.items = res.data.data;
          }
          if (this.value) {
            this.select = this.items.filter(x => x.menu_id === this.value)[0];
          }

        }).catch(err => {
          console.log(err)
        });
    },

    onSelectionChanged(e) {

      console.log("-------onSelectionChanged-------")



      if (e && e.menu_id) {
        this.$emit("update:value", e.menu_id);
        this.$emit('onSelectionChanged', e.menu_id)
      }


    }

  },

}
</script>

<style lang="scss">


</style>
