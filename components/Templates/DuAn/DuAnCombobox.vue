<template>
  <v-autocomplete
    v-model="select"
    :loading="loading"
    :items="items"
    cache-items
    :error-messages="errorMessages"
    :label="label"
    item-text="ten_du_an"
    item-value="du_an_id"
    @change="onSelectionChanged"
    :readonly="readOnly"
    return-object
    clearable
  />
</template>


<script>
import CheckError from "~/utils/handlerErro";

export default {
  props: {
    label: {
      type: String,
      default: "Dự án",
      require: true,
    },
    errorMessages: {
      type: String,
      default: null
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
      default: true
    },
    icon: {
      type: String,
      default: "archive",
      require: true,
    },
    readOnly: {
      type: Boolean,
      default: false
    },
  },
  computed: {},
  data() {
    return {
      loading: false,
      search: null,
      select: null,
      items: []

    }
  },
  watch: {
    search(val) {
      // val && val !== this.select && this.querySelections(val)
    },
  },
  async created() {
    this.loading = true;
    await this.getDataDuAn();

    if (this.value) {
      this.select = this.value;
      this.$emit("update:value", this.value);
      this.$emit("input", this.value);
    }

    this.loading = false;
  },
  mounted() {

  },
  methods: {
    async getDataDuAn() {
      await this.$services.duan.apiGetAll()
        .then(res => {
          if (res.data.code === 200) {
            this.items = res.data.data;
            if (this.duAnId) {
              let dataFilter = this.items.filter(x => {
                return x.du_an_id === this.duAnId
              })
              if (dataFilter.length > 0) {
                this.select = dataFilter[0];
                this.updateProp(this.select);
              }
            }
          }
        })
        .catch(err => {
          CheckError(err);
        });
    },
    updateProp(e) {
      this.$emit("update:value", e && e.du_an_id ? e.du_an_id : null);
      this.$emit("input", e && e.du_an_id ? e.du_an_id : null);
      this.$emit('onSelectionChanged', e)
    },
    onSelectionChanged(e) {
      this.$emit("update:value", e && e.du_an_id ? e.du_an_id : null);
      this.$emit("input", e && e.du_an_id ? e.du_an_id : null);
      this.$emit('onSelectionChanged', e)
    }

  },

}
</script>

<style scoped>

</style>
