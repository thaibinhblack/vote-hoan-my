<template>

  <ValidationProvider :name="label" rules="required" :invalid="valid" v-slot="{errors}"
                      :rules="required ? 'required':''">
    <v-autocomplete :items="items"
                    :label="label"
                    item-value="phan_quyen_id"
                    item-text="cap_do"
                    cache-items
                    :error-messages="errors"
                    :readonly="readOnly"
                    :prepend-icon="prependIcon"
                    :append-icon="appendIcon"
                    v-model="select"
                    :clearable="clearable"

                    @change="onSelectionChanged"
    >
    </v-autocomplete>

  </ValidationProvider>

</template>


<script>
import {mapState, mapActions} from "vuex"

export default {
  props: {
    label: {
      type: String,
      default: "Phân quyền",
      require: true,
    },
    value: {
      type: Number,
      default: null,
      require: true,
    },
    clearable: {
      type: Boolean,
      default: true
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
    prependIcon: {
      type: String,
    },
    appendIcon: {
      type: String,
    },
    readOnly: {
      type: Boolean,
      default: false
    },

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

    await this.$services.phanquyen.apiGetAll()
      .then(res => {
        if (res.status === 200) {
          this.items = res.data.data;
        }

        if (this.value) {
          this.select = this.items.filter(x => x.phan_quyen_id === this.value)[0];
        }

      }).catch(err => {
        console.log(err)
      });

    this.loading = false;
  },
  methods: {
    seachQuery(item, queryText, itemText) {

      if (item) {
        return (
          item.cap_do.toLowerCase().includes(queryText.toLowerCase())
        );
      }

    },
    //...mapActions(['DuAn/getComboboxData']),
    onSelectionChanged(e) {
      if (e) {
        this.$emit("update:value", e);
        this.$emit('onSelectionChanged', e)
      }

      if (!e) {
        this.$emit("update:value", null);
        this.$emit('onSelectionChanged', null)
      }

    }

  },

}
</script>

<style lang="scss">


</style>
