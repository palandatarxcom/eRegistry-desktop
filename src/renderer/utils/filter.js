import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatDate', function(val, pattern) {
  return moment(val).format(pattern)
})