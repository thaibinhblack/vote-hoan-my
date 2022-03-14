<template>
  <v-autocomplete
    v-model='select'
    :append-icon='appendIcon'
    :clearable='clearable'
    :error-messages='errors'
    :items='items'
    :label='label'
    :prepend-icon='prependIcon'
    :readonly='readOnly'
    cache-items
    item-text='cap_do'
    item-value='phan_quyen_id'
    multiple
    @change='onSelectionChanged'
  />
</template>


<script>
import { mapState } from 'vuex'

export default {
  props: {
    label: {
      type: String,
      default: 'Phân quyền',
      require: true
    },
    value: {
      type: Array,
      require: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    duAnId: {
      type: Number,
      default: null,
      require: true
    },
    duAnCode: {
      type: String,
      default: null
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
      type: String
    },
    appendIcon: {
      type: String
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    errors: {
      type: String,
      default: null
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
      items: []
    }
  },
  watch: {
    search(val) {
      // val && val !== this.select && this.querySelections(val)
    }
  },
  async created() {
    this.GetData()
  },
  methods: {
    async GetData() {
      this.loading = true

      const par = {}
      if (this.duAnCode) {
        par.duAnCode = this.duAnCode
      }
      if (this.duAnId) {
        par.duAnId = this.duAnId
      }

      await this.$services.phanquyen.apiGetAll(par)
        .then(res => {
          if (res.status === 200) {
            this.items = res.data.data
          }

          if (this.value) {
            this.select = this.items.filter(x => x.phan_quyen_id === this.value)[0]
          }

        }).catch(err => {
          console.log(err)
        })

      if (this.value) {
        this.select = this.value
      }

      this.loading = false
    },
    seachQuery(item, queryText, itemText) {

      if (item) {
        return (
          item.cap_do.toLowerCase().includes(queryText.toLowerCase())
        )
      }

    },
    onSelectionChanged(e) {
      if (e) {
        this.$emit('update:value', e)
        this.$emit('input', e)
        this.$emit('onSelectionChanged', e)
      }

      if (!e) {
        this.$emit('update:value', null)
        this.$emit('input', null)
        this.$emit('onSelectionChanged', null)
      }

    }

  }

}
</script>

<style lang='scss'>


</style>
