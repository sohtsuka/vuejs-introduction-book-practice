import auth from '@/api/auth'
import client from '@/api/client'

jest.mock('@/api/client', () => {
  return {
    post: jest.fn()
  }
})

describe('Auth APIモジュール', () => {
  describe('login', () => {
    const address = 'foo@example.com'
    const password = '12345678'

    describe('成功', () => {
      it('token、userIdが取得できること', done => {
        expect.assertions(2)
        const token = '123467890abcdef'
        const userId = 1
        client.post.mockResolvedValue(
          { data: { token, userId }, status: 200 }
        )
        auth.login({ address, password })
          .then(res => {
            expect(res.token).toEqual(token)
            expect(res.userId).toEqual(userId)
          })
          .then(done)
      })
    })

    describe('失敗', () => {
      it('エラーメッセージを取得できること', done => {
        expect.assertions(1)
        const message = 'failed login'
        const err = new Error(message)
        err.response = { data: { message }, status: 401 }
        client.post.mockRejectedValue(err)
        auth.login({ address, password })
          .catch(err => {
            expect(err.message).toEqual(message)
          })
          .then(done)
      })
    })
  })
})
