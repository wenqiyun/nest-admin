#### 图标

如果你没有在本项目 ```src/icons``` 找到需要的图标，可以到 [iconfont.cn](https://www.iconfont.cn/) 上选择并生成自己的业务图标库，再进行使用。或者其他 svg 图标网站，下载 svg 并放入 ```src/icons/svg``` 文件夹中就可以了。

> [!TIP]
> 本站没有引入 element-plus 图标库，如果需要引入的话，可以按照 [element-plus][https://element-plus.gitee.io/zh-CN/component/icon.html] 官网进入引入和使用


#### 使用方式
```javascript
<svg-icon icon-class="system"></svg-cion>
```

> [!TIP]
> 改变颜色
>
> ```svg-icon``` 默认会读取其父级的 color ，你可以改变父级 ```color``` 或者直接改变 ```fill``` 的颜色
