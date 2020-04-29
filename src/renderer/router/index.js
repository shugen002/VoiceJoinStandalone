import Help from '../views/Help.vue'
import Home from '../views/Home.vue'
import Debug from '../views/Debug.vue'
import Login from '../views/Login.vue'
import Rules from '../views/Rules.vue'
import Setting from '../views/Setting.vue'
import Phone from '../views/Phone.vue'
import Live from '../views/Live.vue'

export default function (options) {
  return {
    routes: [
      {
        path: '/',
        redirect: '/home'
      },
      {
        path: '/home',
        name: 'home',
        component: Home
      },
      {
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/live',
        name: 'live',
        component: Live
      },
      {
        path: '/rules',
        name: 'rules',
        component: Rules
      },
      {
        path: '/phone',
        name: 'phone',
        component: Phone
      },
      {
        path: '/setting',
        name: 'setting',
        component: Setting
      },
      {
        path: '/help',
        name: 'help',
        component: Help
      },
      {
        path: '/debug',
        name: 'debug',
        component: Debug
      },
      {
        path: '*',
        redirect: '/home'
      }
    ]
  }
}

// dynamically set application title to current view
// router.afterEach(to => {
//   let title =
//     to.path === '/home'
//       ? process.env.PRODUCT_NAME
//       : `${to.meta.title} - ${process.env.PRODUCT_NAME}`

//   if (!title) {
//     title = 'Home'
//   }
// })
