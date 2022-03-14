import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify)

export default (ctx) => {
  const vuetify = new Vuetify({
    theme: {
      dark: false,
      icons: ['mdi', 'md'],
      breakpoint: {
        scrollBarWidth: 20,
        thresholds: {
          xs: 600,
          sm: 960,
          md: 1280,
          lg: 1920,
        },
      },
      themes: {
        dark: {
          primary: "0090A1",
          accent: colors.deepPurple.accent3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent4
        },
        light: {
          primary: "0090A1",
          black: colors.grey.darken4,
          accent: colors.blue,
          secondary: colors.blueGrey.darken4,
          red: colors.red.darken2,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent4
        }
      }
    }
  })

  ctx.app.vuetify = vuetify
  ctx.$vuetify = vuetify.framework
}
