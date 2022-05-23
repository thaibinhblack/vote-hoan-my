export const shortKey = {
  data: () => ({
    ctrl: false,
    eventShort: null
  }),

  mounted() {
    this.shortSave()
  },

  methods: {
    shortSave () {
      this.eventShort = window.addEventListener('keydown', (e) => {
        if (e.keyCode === 17) this.ctrl = true
        if (e.keyCode === 83 && this.ctrl) {
          e.preventDefault()
          this.ctrl = false
          this.$bus.$emit('SHORT_SAVE')
        }
      })
    }
  },

  destroyed() {
    console.log('destroy')
  },
}
