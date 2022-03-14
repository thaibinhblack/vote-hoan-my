import Cookies from "js-cookie"

export default function ({$axios, app, redirect}) {
  console.log("--------$axios----------")


  //$axios.defaults.withCredentials = true

  //$axios.defaults.withCredentials = true;

  $axios.onRequest(() => {
    $axios.defaults.headers.common['Language'] = Cookies.get('language') // for all requests
  })

  $axios.onResponseError(error => {

  });
}
