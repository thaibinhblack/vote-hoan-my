import axios from "axios"

export default function ({store, redirect, route, app}) {
  const parCheck = {
    duAnId: process.env.DU_AN_ID,
    duAnCode: process.env.DU_AN_CODE,
    path: route.path
  }

  let api = app.$services;


  console.log("app", app);
  api.menu.apiCheckRole(parCheck).then(res => {
    console.log("Check-role", res)
  }).catch(err => {
    //return redirect(app.localePath('/camtruycap'))
  })

}
