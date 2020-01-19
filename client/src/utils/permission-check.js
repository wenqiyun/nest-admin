import store from '../store'

export default function hasPermission ({ prop = 'btn', code }) {
  if (['tab', 'btn'].includes(prop)) {
    return store.getters[`${prop}Menu`].findIndex(v => v === code) > -1
  } else {
    console.error('need Object! Like v-permission="{ prop: \'but\', code: \'....\' }"')
    return false
  }
}
