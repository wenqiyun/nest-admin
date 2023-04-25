import type { App } from 'vue'

import perm from './perm'

export function loadDirectives(app: App) {
  app.directive('perm', perm)
}
