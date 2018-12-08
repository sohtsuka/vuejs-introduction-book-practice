import { Auth } from '@/api'
import actions from '@/store/actions'
import * as types from '@/store/mutation-types'

jest.mock('@/api', () => {
  return {
    Auth: {
      login: jest.fn()
    }
  }
})

describe('loginアクション', () => {
  const address = 'foo@example.com'
  const password = '12345678'
  let commit
  let future

  describe('Auth.loginが成功', () => {
    it('成功となること', done => {
      expect.assertions(1)
      const token = '1234567890abcdef'
      const userId = 1
      Auth.login.mockResolvedValue({ token, userId })
      commit = jest.fn()
      future = actions.login({ commit }, { address, password })
      future.then(() => {
        expect(commit).toBeCalledWith(types.AUTH_LOGIN, { token, userId })
        done()
      })
    })
  })

  describe('Auth.loginが失敗', () => {
    it('失敗となること', done => {
      expect.assertions(2)
      const message = 'login failed'
      Auth.login.mockRejectedValue(new Error(message))
      commit = jest.fn()
      future = actions.login({ commit })
      future.catch(err => {
        expect(commit).not.toBeCalled()
        expect(err.message).toEqual(message)
        done()
      })
    })
  })
})
