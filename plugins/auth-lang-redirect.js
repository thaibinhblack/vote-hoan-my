// Tránh xung đột với nuxt auth
export default ({app}) => {
  let redirect = app.$auth.$storage.options.redirect;
  for (let key in redirect) {
    let path = '/' + app.i18n.locale + redirect[key]
    if (redirect[key]) {
      redirect[key] = path
    }

  }
  app.$auth.$storage.options.redirect = redirect
}
