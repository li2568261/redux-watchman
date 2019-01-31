# redux-watchman

`redux-watchman` 是一个基于`async + await`用于管理异步数据流的redux中间件。api的设计灵感来源于[redux-saga](https://redux-saga.js.org/)，但是他：

* 轻便 —— 经过转义压缩后仅 **3KB**。
* 实用 —— 根据`saga`常用的api进行设计，在`async + await` 普及的今天，它能带来不一样的开发体验。
* 简易 —— 如果您是`saga`的用户，且熟悉`async+await`语法那可以说是`0`学习成本，如果您是新手，简易的demo也能让你快速入手。
* 可靠 —— 作者已将其用在公司若干个项目中，线上稳定运行。
* 友好 —— `redux-watchman`使用 typescript 编写，且配置好 d.ts文件，能提供良好的编码提示。

如果你是 `redux` 的使用者，且在项目中习惯使用异步流管理数据交互，`redux-watchman`将会是你不错的选择。

## 开始

### 安装

```bash
$ npm install redux-watchman -S
```

或者你可以在[github](https://github.com/li2568261/redux-watchman)上`clone`下本项目然后：

```bash
$ npm i
$ npm run build:umd
```

通过script标签引入umd文件夹下的js文件。

### 使用示例

下面我们通过一个[通讯录](https://github.com/li2568261/redux-watchman/tree/master/example/src)的部分`crud`来描述:

```js
// reducer.js

// 设置通讯录列表
const set = (state,action)=>{
  return {
    contacts: action.payload
  }
}
// 新增/修改联系人
const edit = (state,action)=>{
  const contacts = state.contacts;
  const index = contacts.findIndex(contact=>contact.id === action.payload);
  if(index !== -1) {
    contacts.splice(index, 1, action.payload);
    return {
      contacts: [...contacts]
    }
  }
  return {
    contacts: [...contacts, action.payload]
  }
}
// ... 省略del
const reducer = (state,action)=>{
  const handler = {
    set,
    edit,
    del
  }
  if(handler[action.type]) return handler[action.type](state,action);
  return state
}
export default reducer;
```



```js
// watchman.js
import { all, put, select, take, takeEvery } from 'redux-watchman';
// 用来模拟异步请求
const requestMock = function(data){
  return Promise.resolve(data);
}
// 用来生成单个人员
const contactFactory = function(name = 'lee', phone = '123'){
  return {
    id: Math.random() * 100,
    name,
    phone
  }
}
// 下面开始定义监听的各个action
// 查询联系人
const query = async function(){
  // 仅监听一次type为query的action。因为大列表的数据一般只需要查询一次
  await take('query');
	
  // 模拟异步过程
  const mock = [
    contactFactory('lee', '123'),
    contactFactory('zhao', '123')
  ]
  const payload = await requestMock(mock);
  // 往reducer上抛
  await put({ type: 'set', payload})
}
// 新增/修改联系人
const edit = async function(){
  // 多次监听type为editAsync的action，因为这个会频繁操作，监听回调会接收当前action作为参数
  await takeEvery('editAsync', async function(action){
    let mockData = action.payload;
    // 根据id判断新增还是修改
    if(!action.payload.id){
      mockData = {...mockData, id: Math.random()}
    }
    // 模拟异步
    const payload = await requestMock(mockData);
    // 同上
    await put({ type: 'edit', payload})
  })
}
// 异步删除操作
const del = async function(){
  await takeEvery('delAsync', async function(action){
    if(!action.payload.id)return
    const result = await requestMock(true);
    if(result)await put({ type: 'del', payload: action.payload.id})
  })
}
// 删除最后一个
const pop = async function(){
  await takeEvery('popAsync', async function(action){
    // 先找到最后一个然后删除
    const contacts = await select(function(state){return state.contacts});
    const last = contacts[contacts.length - 1];
    const result = await requestMock(true);
    if(result)await put({ type: 'del', payload: last.id})
  })
}

// 把响应的方法整合，通过一个接口导出
const root = async function(){
  await all([ query, edit, del, pop ])
}

export default root;


```



```js
import { createStore, applyMiddleware } from 'redux';
import { createWatchman } from 'redux-watchman';
import reducer from './reducer';
import root from './watchman';
// 先创建一个watchman
const watchman = createWatchman();
const store = createStore(
  reducer,
  {
    contacts: []
  },
  applyMiddleware(
    watchman.watchmanMiddleware // 加入middleware
  )
)
// run之前定义的所有方法
watchman.run(root);


// 接下来描述这样一个过程
// 定义一个数据打印方法，方便查看每个dispatch后的数据变化。
const withStoreShow = (f)=>{
  f();
  return new Promise(resolve=>{
    setTimeout(()=>{
      console.log('state');
      console.log(JSON.stringify(store.getState()));
      console.log('-----------------------')
      resolve()
    }, 200);
  })
}

const run = async function(){
  // query
  await withStoreShow(()=>{
    console.log('query');
    store.dispatch({ type: 'query' })
  });
  // 新增
  await withStoreShow(()=>{
    console.log('editAsync');
    store.dispatch({ type: 'editAsync', payload: {name: 'wang', phone: '333'}})
  });
  // 修改
  await withStoreShow(()=>{
    console.log('editAsync');
    const state = store.getState();
    store.dispatch({ type: 'editAsync', payload: {id: state.contacts[0].id, name: 'll', phone: '773'}})
  });

  // 删除
  await withStoreShow(()=>{
    console.log('delAsync');
    const state = store.getState();
    store.dispatch({ type: 'delAsync', payload: state.contacts[0].id})
  });
  // 删除最后一个
  await withStoreShow(()=>{
    console.log('pop');
    store.dispatch({ type: 'popAsync' })
  });
}

run();
```

#### 文档

以下均为函数

|      名称      |             参数              | 描述                                                         |
| :------------: | :---------------------------: | :----------------------------------------------------------- |
|      take      |            string             | 接收一个字符串，作为参数，仅监听一次`type`值为该字符串的`action`。返回一个`promise`，当该`type`值的`action`被`dispatch`时，`promise`变为`resolved`状态，`Promise`值为当前`action` |
|   takeEvery    | string，        asyncFunction | 多次take；当监听到对应`action`时，调用传入的`async`方法，在当前`async`方法返回的`promise`状态变更之前，再次`dispatch`相同`type`的`action`，方法不会响应。返回一个状态永远为`pendding`的`Promise`。 |
|      put       |            action             | 可以简单的理解为`store.dispath`，返回一个`Promise`，`Promise`值为当前`action` |
|     select     |          (state)=>{}          | `select`接收一个函数`f`，`f`能拿到当前`state`作为参数，`select`返回一个`Promise`,该`Promise`的值为函数`f`的返回值。 |
|      all       |        asyncFunction[]        | 可以简单的理解为`Promise.all`                                |
| createWatchman |               /               | 不需要传参，调用后返回{ run, watchmanMiddleware }，需要将`watchmanMiddleware`加入到`redux middleware`中并初始化`redux`。`run`接收一个`asyncFunction`，用于启动上面定义的effect。 |

## License

MIT