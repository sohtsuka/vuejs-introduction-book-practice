module.exports = {
  'ログイン': browser => {
    const devServerUrl = process.env.VUE_DEV_SERVER_URL
    browser
      .url(devServerUrl)
      .waitForElementVisible('#app', 1000)
      .enterValue('input#email', 'foo@example.com')
      .enterValue('input#password', '12345678')
      .waitForElementPresent('form > .form-actions > button', 1000)
      .click('form > .form-actions > button')
      .waitForElementPresent('#app > p', 1000)
      .assert.containsText('#app > p', 'ボードページ')
      // ポート 8081 などになる場合もあるため
      .assert.urlEquals(devServerUrl + '#/')
      .end()
  }
}
