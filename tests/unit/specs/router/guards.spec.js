import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { authorizeToken } from '@/router/guards'
import store from '@/store'

const App = {
  name: 'app',
  render: h => h('router-view')
}

const Top = {
  name: 'top',
  render: h => h('p', ['top'])
}

const Login = {
  name: 'login',
  render: h => h('p', ['login'])
}

jest.mock('@/store', () => {
  const obj = {
    get state () {}
  }
  // TODO: 他にきれいな方法はないか？
  obj.mockGetter = jest.spyOn(obj, 'state', 'get')
  return obj
})

const setup = state => {
  store.mockGetter.mockReturnValue(state)

  const router = new VueRouter({
    routes: [{
      path: '/',
      component: Top,
      meta: { requiresAuth: true }
    }, {
      path: '/login',
      component: Login
    }]
  })

  router.beforeEach(authorizeToken)

  return mount(App, {
    localVue,
    store,
    router
  })
}

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)

describe('beforeEachガードフック', () => {
  describe('認証トークンあり', () => {
    it('そのまま解決すること', () => {
      const app = setup({
        auth: {
          token: '1234567890abcdef',
          userId: 1
        }
      })
      expect(app.text()).toEqual('top')
    })
  })

  describe('認証トークンなし', () => {
    it('requiresAuth付きなら、/login にリダイレクトすること', () => {
      const app = setup({})
      expect(app.text()).toEqual('login')
    })
  })
})
