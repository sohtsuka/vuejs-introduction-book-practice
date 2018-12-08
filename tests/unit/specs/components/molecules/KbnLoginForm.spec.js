import { mount } from '@vue/test-utils'
import KbnLoginForm from '@/components/molecules/KbnLoginForm.vue'

describe('KbnLoginForm', () => {
  describe('プロパティ', () => {
    describe('validation', () => {
      let loginForm

      beforeEach(done => {
        loginForm = mount(KbnLoginForm, {
          propsData: { onlogin: () => {} }
        })
        loginForm.vm.$nextTick(done)
      })

      describe('email', () => {
        describe('required', () => {
          describe('何も入力されていない', () => {
            it('validation.email.requiredがinvalidであること', () => {
              loginForm.setData({ email: '' })
              expect(loginForm.vm.validation.email.required).toEqual(false)
            })
          })

          describe('入力あり', () => {
            it('validation.email.requiredがvalidであること', () => {
              loginForm.setData({ email: 'foo@example.com' })
              expect(loginForm.vm.validation.email.required).toEqual(true)
            })
          })
        })

        describe('format', () => {
          describe('メールアドレス形式でないフォーマット', () => {
            it('validation.email.formatがinvalidであること', () => {
              loginForm.setData({ email: 'foobar' })
              expect(loginForm.vm.validation.email.format).toEqual(false)
            })
          })

          describe('メールアドレス形式のフォーマット', () => {
            it('validation.email.formatがvalidであること', () => {
              loginForm.setData({ email: 'foo@example.com' })
              expect(loginForm.vm.validation.email.format).toEqual(true)
            })
          })
        })
      })

      describe('password', () => {
        describe('required', () => {
          describe('何も入力されていない', () => {
            it('validation.password.requiredがinvalidであること', () => {
              loginForm.setData({ password: '' })
              expect(loginForm.vm.validation.password.required).toEqual(false)
            })
          })

          describe('入力あり', () => {
            it('validation.password.requiredがvalidであること', () => {
              loginForm.setData({ password: 'x' })
              expect(loginForm.vm.validation.password.required).toEqual(true)
            })
          })
        })
      })
    })

    describe('valid', () => {
      let loginForm

      beforeEach(done => {
        loginForm = mount(KbnLoginForm, {
          propsData: { onlogin: () => {} }
        })
        loginForm.vm.$nextTick(done)
      })

      describe('バリデーション項目全てOK', () => {
        it('validになること', () => {
          loginForm.setData({
            email: 'foo@example.com',
            password: '12345678'
          })
          expect(loginForm.vm.valid).toEqual(true)
        })
      })

      describe('バリデーションNG項目あり', () => {
        it('invalidになること', () => {
          loginForm.setData({
            email: 'foo@example.com',
            password: ''
          })
          expect(loginForm.vm.valid).toEqual(false)
        })
      })
    })

    describe('disableLoginAction', () => {
      let loginForm

      beforeEach(done => {
        loginForm = mount(KbnLoginForm, {
          propsData: { onlogin: () => {} }
        })
        loginForm.vm.$nextTick(done)
      })

      describe('バリデーションNG項目あり', () => {
        it('ログイン処理は無効', () => {
          loginForm.setData({
            email: 'foo@example.com',
            password: ''
          })
          expect(loginForm.vm.disableLoginAction).toEqual(true)
        })
      })

      describe('バリデーション項目全てOKかつログイン処理中でない', () => {
        it('ログイン処理は有効', () => {
          loginForm.setData({
            email: 'foo@example.com',
            password: '12345678'
          })
          expect(loginForm.vm.disableLoginAction).toEqual(false)
        })
      })

      describe('バリデーション項目全てOKかつログイン処理中', () => {
        it('ログイン処理は無効', () => {
          loginForm.setData({
            email: 'foo@example.com',
            password: '12345678',
            progress: true
          })
          expect(loginForm.vm.disableLoginAction).toEqual(true)
        })
      })
    })

    describe('onlogin', () => {
      let loginForm
      let onloginStub

      beforeEach(() => {
        onloginStub = jest.fn()
        loginForm = mount(KbnLoginForm, {
          propsData: { onlogin: onloginStub }
        })
        loginForm.setData({
          email: 'foo@example.com',
          password: '12345678'
        })
      })

      describe('resolve', () => {
        it('resolveされること', (done) => {
          expect.assertions(3)
          const onloginResult = Promise.resolve()
          onloginStub.mockReturnValueOnce(onloginResult)
          onloginResult.then(() => {
            loginForm.vm.$nextTick().then(() => {
              expect(onloginStub).toBeCalledWith({
                email: loginForm.vm.email,
                password: loginForm.vm.password
              })
              expect(loginForm.vm.error).toEqual('')
              expect(loginForm.vm.disableLoginAction).toEqual(false)
              done()
            })
          })
          loginForm.find('button').trigger('click')
        })
      })

      describe('reject', () => {
        it('rejectされること', (done) => {
          expect.assertions(3)
          const onloginResult = Promise.reject(new Error('login error!'))
          onloginStub.mockReturnValueOnce(onloginResult)
          onloginResult.catch(() => {
            loginForm.vm.$nextTick().then(() => {
              expect(onloginStub).toBeCalledWith({
                email: loginForm.vm.email,
                password: loginForm.vm.password
              })
              expect(loginForm.vm.error).toEqual('login error!')
              expect(loginForm.vm.disableLoginAction).toEqual(false)
              done()
            })
          })
          loginForm.find('button').trigger('click')
        })
      })
    })
  })
})
