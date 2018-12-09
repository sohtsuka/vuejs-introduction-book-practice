import Vue from 'vue'
import App from './App.vue'
import ErrorBoundary from './ErrorBoundary.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.config.performance = true

Vue.component(ErrorBoundary.name, ErrorBoundary)

Vue.config.errorHandler = (err, vm, info) => {
  console.error('errorHandler err: ', err)
  console.error('errorHandler vm: ', vm)
  console.error('errorHandler info: ', info)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
