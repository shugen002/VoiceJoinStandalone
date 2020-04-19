
import About from '../views/About.vue'
import Help from '../views/Help.vue'
import Home from '../views/Home.vue'
import Debug from '../views/Debug.vue'
import Login from '../views/Login.vue'
import Rules from '../views/Rules.vue'

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
        path: '/about',
        name: 'about',
        component: About
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
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: '/rules',
        name: 'rules',
        component: Rules
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
