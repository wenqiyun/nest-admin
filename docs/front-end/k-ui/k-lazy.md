组件懒加载

> [!TIP]
> 依赖 ```intersection-observer``` 组件（低版本浏览器需 ```polyfill``` ）

#### 示例
```html
<template>
  <k-lazy>
    ...需要懒加载的内容...
  </k-lazy>
</template>
```

#### 属性
|属性|说明|类型|是否必须|默认值|
|---|---|---|---|---|
| name | transition-group 组件 name 属性， 用来定制动画  | `String` | `false` | k-lazy |
| fit | 适配父容器 | `Boolean` | `false` | false |
| timeout| 等待时间，如果指定了时间，不论可见与否，在指定时间之后，将自动加载业务组件| `Number` | `false` | -- |
| viewport | 组件所在视口，如果组件是在页面容器内滚动，视口就是该容器 | ```typeof window !== 'undefined' ? window.HTMLElement : Object``` |```false```|null |
| threshold | 预加载阈值 | `String` \ `Number` | `false` | 0 |
| direction | 视口滚动方向 vertical 垂直方向 horizontal 水平方向 | `String` | `false` | vertical |
