import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import KbnLoginView from '@/components/templates/KbnLoginView.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('KbnLoginView', () => {
  let actions
  let $router
  let store
  let LoginFormComponentStub

  const triggerLogin = (loginView, target) => {
    const loginForm = loginView.find(target)
    loginForm.vm.onlogin('foo@example.com', '12345678')
      .catch(() => {}) // suppress UnhandledPromiseRejectionWarning
  }

  beforeEach(() => {
    LoginFormComponentStub = {
      name: 'KbnLoginForm',
      props: ['onlogin'],
      render: h => h('p', ['login form'])
    }

    $router = {
      push: jest.fn()
    }

    actions = {
      login: jest.fn()
    }

    store = new Vuex.Store({
      state: {},
      actions
    })
  })

  describe('ログイン', () => {
    let loginView

    describe('成功', () => {
      beforeEach(() => {
        loginView = mount(KbnLoginView, {
          mocks: { $router },
          stubs: {
            'kbn-login-form': LoginFormComponentStub
          },
          store,
          localVue
        })
      })

      it('ボードページのルートにリダイレクトすること', done => {
        expect.assertions(1)
        const loginResult = Promise.resolve()
        actions.login.mockReturnValueOnce(loginResult)
        loginResult.then(() => {
          loginView.vm.$nextTick().then(() => {
            expect($router.push).toBeCalledWith({ path: '/' })
            done()
          })
        })
        triggerLogin(loginView, LoginFormComponentStub)
      })
    })

    describe('失敗', () => {
      let spy

      beforeEach(() => {
        loginView = mount(KbnLoginView, {
          stubs: {
            'kbn-login-form': LoginFormComponentStub
          },
          store,
          localVue
        })
        spy = jest.spyOn(loginView.vm, 'throwReject')
      })

      afterEach(() => {
        spy.mockRestore()
      })

      it('エラー処理が呼び出されること', done => {
        expect.assertions(1)
        const err = new Error('login failed')
        const loginResult = Promise.reject(err)
        actions.login.mockReturnValueOnce(loginResult)
        loginResult.catch(() => {
          loginView.vm.$nextTick().then(() => {
            expect(spy).toBeCalledWith(err)
            done()
          })
        })
        triggerLogin(loginView, LoginFormComponentStub)
      })
    })
  })
})
