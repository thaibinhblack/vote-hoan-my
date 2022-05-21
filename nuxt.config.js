const evn = require("dotenv").config();
import webpack from "webpack";


export default {
  ssr: false,
  server: {
    port: 3001,
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s",
    title: "Tool Vote for safety",
    meta: [
      {charset: "utf-8"},
      {name: "viewport", content: "width=device-width, initial-scale=1"},
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      {rel: "icon", type: "image/x-icon", href: "/favicon.ico"},
      {rel: 'stylesheet', href: '/libs/stimulsoft/css/stimulsoft.viewer.office2013.whiteblue.css'}
    ],
    script: [
      // {
      //   src: "https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js",
      //   type: "text/javascript"
      // },
      {src: "/libs/stimulsoft/viewer/stimulsoft.reports.js"},
      {src: "/libs/stimulsoft/viewer/stimulsoft.reports.maps.js"},
      {src: "/libs/stimulsoft/viewer/stimulsoft.viewer.js"},
    ]
  },
  target: "server",
  env: {
    baseUrl: process.env.NODE_ENV === "development" ? process.env.DEV_URL_BASE : process.env.PRO_URL_BASE,
  },
  publicRuntimeConfig: {
    baseUrl: process.env.NODE_ENV === "development" ? process.env.DEV_URL_BASE : process.env.PRO_URL_BASE,
    socketUrl: process.env.NODE_ENV === "development" ? process.env.DEV_URL_SOCKET : process.env.PRO_URL_SOCKET,
    duAnCode: process.env.DU_AN_CODE,
  },
  router: {
    routes: [
      {
        path: '/khao-sat', component: 'pages/_KhaoSat'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {color: "#fff"},
  /*
   ** Global CSS
   */
  css: [
    {src: "devextreme/dist/css/dx.common.css", lang: "css"},
    {src: "~/assets/dx.generic.custom-scheme.css", lang: "css"},
    {src: "~/assets/app.scss", lang: "scss"}
    //  {src: "~/assets/css/stimulsoft.viewer.office2013.whiteblue.css", lang: "css"},
  ],
  vuetify: {
    customVariables: ["~/assets/variables.scss"]
  },
  /*
   ** Plugins to load before mounting the App
   */
  components: true,
  plugins: [
    {src: "~/plugins/axios.js", ssr: false},
    {src: "~/plugins/vuetify.js", ssr: false},
    {src: "~/plugins/services.js", ssr: false},
    {src: "~/plugins/vclipboard.js", ssr: false},
    {src: "~/plugins/vee-validate.js", ssr: false},
    {src: "~/plugins/devextreme.js", ssr: false},
    {src: "~/plugins/user.js", ssr: false},
    {src: "~/plugins/SplitterPage.js", ssr: false},
    {src: "~/plugins/echarts", ssr: false},
    {src: "~/plugins/element-ui", ssr: false},
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/toast", '@nuxtjs/dotenv', '@nuxtjs/moment', "@nuxtjs/composition-api/module"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    'nuxt-i18n',
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    '@nuxtjs/composition-api/module'
  ],
  i18n: {
    locales: [
      {
        code: 'vi',
        file: 'vi-VN.js',
        name: "Tiếng việt"

      },
      {
        code: 'en',
        file: 'en-US.js',
        name: "English"
      },

    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'vi',
    localeDetection: false,
    parsePages: false,
    strategy: 'prefix',
    rootRedirect: 'vi',
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: true,
      fallbackLocale: "vi",
      cookieKey: 'language'
    },
    vueI18n: {
      fallbackLocale: 'vi',

    },
    vuex: {
      // Module namespace
      moduleName: 'i18n',

      // If enabled, current app's locale is synced with nuxt-i18n store module
      syncLocale: true,

      // If enabled, current translation messages are synced with nuxt-i18n store module
      syncMessages: true,

      // Mutation to commit to set route parameters translations
      syncRouteParams: true
    }
  },
  bootstrapVue: {
    icons: false
  },
  moment: {
    timezone: true,
    defaultTimezone: 'Asia/Ho_Chi_Minh',
    defaultLocale: 'vi',
    locales: ['vi']
  },

  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: false,
      home: false,

    },
    strategies: {
      local: {
        scheme: "refresh",
        token: {
          property: "data.token",
          maxAge: 3600,
          // type: 'Bearer'
        },
        user: {
          property: "data"
          // autoFetch: true
        },
        refreshToken: {
          property: "data.refresh_token",
          data: "refresh_token",
          maxAge: 60 * 3 * 60
        },
        autoLogout: true,
        endpoints: {
          logout: false,
          login: {
            url: "auth/v1/login",
            method: "post"
          },
          refresh: {
            url: "auth/v1/refresh-token",
            method: "post"
          },
          user: {
            url: "auth/v1/tai-khoan/me",
            method: "get"
          }
        }
      }
    },
    plugins: ['@/plugins/auth-lang-redirect.js'],
    localStorage: false
  },
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    delete: {},
    get: {},
    head: {},
    post: {},
    baseURL: process.env.NODE_ENV === "development" ? process.env.DEV_URL_BASE : process.env.PRO_URL_BASE,
    debug: false,
    credentials: false

  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  loaders: {
    vue: {
      prettify: false
    }
  },
  /*
   ** Build configuration
   */
  build: {
    loaders: {
      vue: {
        prettify: false
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        // global modules
        _: "lodash"
      })
    ]
  }
};
