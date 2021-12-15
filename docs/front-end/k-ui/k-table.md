表格组件，扩展 ```el-table``` ，兼容 ```el-table``` 写法

#### 示例
```javascript
<template>
  <k-table
    ref="userTableRef"
    v-bind="userData"
    :callback="getUserListFn"
    :loading="loading"
    border
    stripe
    current-row-key="id"
    style="width: 100%">

    <template #avatar="{row}">
      <el-avatar :src="row.avatar" shape="circle" :size="60"></el-avatar>
    </template>
    <template #status="{row}">
      <k-badge :type="row.status === 1 ? 'primary' : 'danger'" :content="row.status === 1 ? '使用中' : '已禁用'"></k-badge>
    </template>
    <template  #actions="{ row }">
      <el-button type="primary" plain>编辑</el-button>
      <el-button type="warning" plain>重置密码</el-button>
    </template>
  </k-table>

</template>


<script setup>
// 配置 k-table
const userData = ref({
  mode: 'config',
  data: { list: [], total: 0 },
  auto: true,
  isPager: true,
  columns: [
    { label: '头像', prop: 'avatar', slot: true },
    { label: '帐号', prop: 'account' },
    { label: '手机号', prop: 'phoneNum', default: '--' },
    { label: '邮箱', prop: 'email', default: '--' },
    { label: '状态', prop: 'status', slot: true, width: '90' },
    { label: '注册时间', prop: 'createDate', width: '90', formatter: (row: UserApiResult) => jsonTimeFormat(row.createDate as string) }
  ],
  index: true
})
// 接口请求
// 说明： 设置 auto = true, callback = getUserListFn 当切换分页时，自动调用 callback 回调
const getUserListFn = async ({ page, size }: Pagination) => {
  loading.value = true
  const res = await getUserList({ ...queryReq.value, page, size } as QueryUserList)
  loading.value = false
  if (res.code === 200) {
    const data = res.data as ListResultData<UserApiResult>
    userData.value.data = data
  } else {
    ElMessage({ message: res?.msg || '网络异常，请稍后重试', type: 'error' })
  }
}
</script>

```
#### 属性

|属性|说明|类型|是否必须|默认值|
|---|---|---|---|---|
|mode|组件渲染模式，config 通过配置渲染 column , render 通过 slot el-table-column 模式渲染|```String```|```false```|config|
|auto|组件创建完成时，是否马上加载 callback 函数|`Boolean`|`false`|false|
|callback|回调函数，加载数据的函数 回调参数 pager: { page, size } 对象， pege 首页从 1 开始|`Function`|`false`|-|
|loading|是否显示加载中... |`Boolean`|`false`|false|
|data|表格数据，为数组时，只作为 el-table 组件 data 属性，当为对象是 { list: [], total: 0 } list 作为 el-table 组件 data属性|`Array` /  `Object`|`false`|{"list":[],"total":0}|
|columns|列配置 类似于 [{ label: '', prop: '', type: '', children: '', ... }], 具体配置请看 [column](#column) |`Array`|`false`|[]|
|selection|是否显示多选框|`Boolean`|`false`|false|
|index|是否显示序号, 默认为 true|`Boolean`|`false`|true|
|continuousIndex|是否是连续序号，false 表示每页从 1 开始|`Boolean`|`false`|true|
|indexMethod|索引方法，回调参数 index 重写序号规则|`Function`|`false`|-|
|indexLabel|索引表头|`String`|`false`|序号|
|isPager|是否显示分页|`Boolean`|`false`|true|
|pageSize|默认每页显示条数|`Number`|`false`|10|
|pagination|分页配置，具体配置请查看 [Element Plus](https://element-plus.gitee.io/zh-CN/component/pagination.html)|`Object`|`false`|{}|

> [!TIP]
> 除了以上配置项外，完全兼容 el-table 配置，具体请查看 [el-table](https://element-plus.gitee.io/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7)

#### 方法
|方法名|说明|参数|
|---|---|---|
|refreshData|在 auto 为 true 且设置了 callback 时，调用此方法可重新加载数据|可传参数 { page, size }, 不传时 page 默认当前页||

> [!TIP]
> table 方法和事件除本文档特殊说明外，其他方法和事件则完全兼容 el-table 方法事件，具体请查看 [el-table](https://element-plus.gitee.io/zh-CN/component/table.html#table-%E4%BA%8B%E4%BB%B6)

#### column
|属性|说明|类型|是否必须|默认值|
|---|---|---|---|---|
|slot|为 true 时，表示当前 column 使用插槽模式|```Boolean```|```false```|--|
|default|当前列数据为空时显示|```String```|```false```|--|

> [!TIP]
> 其他配置项，则完全兼容 el-table-column 的配置，具体请查看 [el-table-column](https://element-plus.gitee.io/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7)


#### 插槽

|插槽|说明|
|---|---|
|$prop.header|作用域插槽，自定义列头，与 el-table-column 组件 header 插槽一致|
|$prop|作用域插槽，自定义列显示内容， $prop 是动态值，表示字段名称，即与 el-table-column 组件的 prop. 与 el-table-column 默认插槽一致|
|empty|自动无数据提示 插槽|
