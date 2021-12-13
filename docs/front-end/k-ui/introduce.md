封装扩展了 一些 ```Element Plus``` 组件，比如 表格、表单等


全局引入
```javascript
import ELementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import KUI from './plugins/k-ui'

...
...

app.use(ELementPlus, {
  locale: zhCn,
  size: 'small'
}).use(store, key).use(router)

app.use(KUI)
```

#### 组件
* [Table](/front-end/k-ui/k-table.md) 表格
* [Form](/front-end/k-ui/k-form.md) 表单
* [badge](/front-end/k-ui/k-badge.md) 状态点
* [Lazy](/front-end/k-ui/k-lazy.md) 懒加载
