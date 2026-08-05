# 详细解释一下CommonJS和UMD

好，这两个都是 **JS 模块化历史** 里的关键角色。我按"为什么会出现 → 怎么用 → 内部原理 → 现在还要不要用"来讲，不啰嗦。

------

# 一、CommonJS（CJS）

## 1. 为什么出现

2009 年之前，JS **没有官方的模块系统**。浏览器靠 `<script>`标签顺序加载，全局变量满天飞，命名冲突是常态。

Ryan Dahl 做 Node.js 时，需要一个**服务端可用的模块规范**，于是社区制定了 CommonJS（最早叫 ServerJS）。

> 一句话：**CommonJS 是为服务端设计的同步模块规范。**

------

## 2. 基本语法

```
// math.js — 定义模块
const add = (a, b) => a + b;
const sub = (a, b) => a - b;

module.exports = { add, sub };
// 或者 exports.add = add; exports.sub = sub;

// main.js — 消费模块
const math = require('./math');
console.log(math.add(1, 2)); // 3

// 或者解构
const { add, sub } = require('./math');
```

| 关键字           | 作用                                           |
| ---------------- | ---------------------------------------------- |
| `require()`      | 同步加载并执行模块，返回 `module.exports`      |
| `module.exports` | 模块对外暴露的对象（**唯一出口**）             |
| `exports`        | `module.exports`的快捷引用（不能直接赋值覆盖） |

------

## 3. 核心特征（面试常考）

| 特征                 | 说明                                                   |
| -------------------- | ------------------------------------------------------ |
| **同步加载**         | `require()`是阻塞的——加载完才执行下一行                |
| **运行时加载**       | `require`在代码运行时才解析路径、读文件                |
| **值拷贝（浅拷贝）** | 导出的是值的**副本**，不是引用                         |
| **单例缓存**         | 同一个模块 `require`多次，只执行一次，后续直接返回缓存 |
| **循环依赖有解**     | Node 会返回"未完全加载完"的半成品对象，不会死循环      |

### ⚠️ `exports`vs `module.exports`的坑

```
// ❌ 错误：exports 被重新赋值，跟 module.exports 断开了联系
exports = { add };  // 外界拿不到 add

// ✅ 正确：往 exports 上挂属性
exports.add = add;

// ✅ 正确：直接覆盖 module.exports
module.exports = { add };
```

原因：`exports`只是 `module.exports`的一个引用变量，重新赋值只是让 `exports`指向新对象，`module.exports`没变。

------

## 4. 循环依赖是怎么解决的

```
// a.js
console.log('a start');
exports.done = false;
const b = require('./b');
console.log('a end, b.done =', b.done);
exports.done = true;

// b.js
console.log('b start');
exports.done = false;
const a = require('./a');  // ← a 还没执行完，但 Node 已经把 a 的 exports 对象缓存了
console.log('b end, a.done =', a.done); // false（半成品）
exports.done = true;
```

Node 的做法：**模块没执行完就缓存了 `module.exports`的初始空对象 `{}`**，后续代码继续跑，最后填充完整。所以循环依赖不会死循环，但拿到的是"部分完成"的值。

------

## 5. 内部实现原理（简化版）

Node.js 内部大致是这样加载一个 CJS 模块的：

```
const moduleCache = {};

function require(id) {
  // 1. 已缓存 → 直接返回
  if (moduleCache[id]) return moduleCache[id].exports;

  // 2. 创建模块对象
  const module = { exports: {} };
  moduleCache[id] = module;

  // 3. 读文件、包装、执行
  const code = fs.readFileSync(resolvePath(id), 'utf-8');
  const wrapper = `(function(require, exports, module) {\n${code}\n})`;
  const fn = vm.runInThisContext(wrapper);
  fn(require, module.exports, module); // ← 你的代码在这里跑

  // 4. 返回 exports
  return module.exports;
}
```

> 这就是为什么你能直接用 `require`、`exports`、`module`——它们是**函数参数注入的**，不是全局变量。

------

## 6. CommonJS 的致命弱点

| 弱点                             | 为什么是问题                                     |
| -------------------------------- | ------------------------------------------------ |
| 同步加载                         | 浏览器里网络 I/O 是异步的，`require()`会阻塞渲染 |
| 运行时才能确定依赖树             | 打包工具无法做 tree-shaking                      |
| 顶层 `this`指向 `module.exports` | 跟 ES Module 的顶层 `this=undefined`不一致       |
| 动态 `require()`无法静态分析     | 打包器很难知道你到底引入了哪些模块               |

------

# 二、UMD（Universal Module Definition）

## 1. 为什么出现

2010~2014 年这段时间，前端模块化**群雄割据**：

| 环境                      | 用的规范             |
| ------------------------- | -------------------- |
| Node.js                   | CommonJS (`require`) |
| 浏览器（RequireJS）       | AMD (`define`)       |
| 浏览器（直接 `<script>`） | 全局变量挂载         |

如果你写了一个**开源库**，想让它在所有环境都能用，你就得写三套代码——这显然不合理。

UMD 就是为了解决这个问题诞生的：**一套代码，三种环境通吃。**

------

## 2. UMD 长什么样

```
(function (root, factory) {
  // 情况 1：AMD（RequireJS / 浏览器异步加载）
  if (typeof define === 'function' && define.amd) {
    define(['dependency'], factory);

  // 情况 2：CommonJS（Node.js / Browserify）
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('dependency'));

  // 情况 3：全局变量（浏览器直接 <script> 引入）
  } else {
    root.MyLibrary = factory(root.Dependency);
  }
})(typeof self !== 'undefined' ? self : this, function (dependency) {

  // ===== 你的库代码 =====
  function hello() { return 'Hello!'; }

  return { hello };
});
```

### 逐行解读

| 代码段                                         | 干什么                                         |
| ---------------------------------------------- | ---------------------------------------------- |
| `(function(root, factory) { ... })(...)`       | 立即执行函数（IIFE），防止污染全局             |
| `typeof define === 'function' && define.amd`   | 检测是不是 RequireJS 环境                      |
| `typeof module === 'object' && module.exports` | 检测是不是 Node/Browserify 环境                |
| `root.MyLibrary = factory(...)`                | 兜底：浏览器 `<script>`直接引，挂到 `window`上 |
| `factory`函数                                  | 真正的库逻辑，接收一个依赖参数，返回对外 API   |

------

## 3. 编译后的实际效果

假设你在浏览器里直接 `<script src="mylib.umd.js">`：

```
<script src="dependency.js"></script>
<script src="mylib.umd.js"></script>
<script>
  MyLibrary.hello(); // 'Hello!' — 挂在 window 上
</script>
```

在 Node.js 里：

```
const lib = require('mylib'); // factory 被调用，返回 { hello }
lib.hello();
```

在 RequireJS 里：

```
require(['mylib'], function(lib) {
  lib.hello();
});
```

------

## 4. UMD 的变体

### 无依赖的简化版（你之前项目里可能见过）

```
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MyLibrary = factory();
  }
})(this, function () {
  return { hello: 'world' };
});
```

### jQuery 当年用的 UMD（经典）

```
(function (global, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(global, true);
  } else {
    factory(global);
  }
})(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {
  // jQuery 本体
  return jQuery;
});
```

------

## 5. UMD 的问题

| 问题                                    | 说明                             |
| --------------------------------------- | -------------------------------- |
| 样板代码又臭又长                        | 每个文件都要写一遍那个 IIFE 判断 |
| 不支持 ES Module 的 `import/export`语法 | 只是"兼容层"，不是新标准         |
| 无法 tree-shake                         | 跟 CJS 一样是运行时加载          |
| 依赖声明藏在函数体里                    | 打包工具只能猜测依赖关系         |

------

# 三、CommonJS vs UMD vs ESM 全景对比

| 维度           | CommonJS              | UMD           | ES Module                      |
| -------------- | --------------------- | ------------- | ------------------------------ |
| 提出者         | 社区（Kevin Dangoor） | 社区共识      | TC39（JS 官方标准）            |
| 年份           | 2009                  | ~2011         | 2015（ES6）                    |
| 加载方式       | 同步                  | 取决于环境    | 异步（浏览器）/ 同步（Node）   |
| 静态分析       | ❌ 不行                | ❌ 不行        | ✅ 可以（tree-shaking）         |
| 浏览器原生支持 | ❌                     | ✅（全局模式） | ✅（`<script type="module">`）  |
| Node.js 支持   | ✅ 原生                | ✅ 通过打包    | ✅（`.mjs`/ `"type":"module"`） |
| 循环依赖       | 返回半成品对象        | 同 CJS        | ✅ 更好的支持（live binding）   |
| 现在还用吗     | ✅ Node 生态主力       | ⚠️ 老库兼容    | ✅ 新项目首选                   |

------

# 四、你现在应该怎么选

| 场景                   | 用什么                                                       |
| ---------------------- | ------------------------------------------------------------ |
| 新项目（前端/全栈）    | **ES Module**（`import/export`）                             |
| Node.js 后端维护老代码 | CommonJS 继续用，新文件可混用 ESM                            |
| 写开源库要兼容所有人   | 构建时输出 **双产物**：`dist/lib.esm.js`+ `dist/lib.cjs.js`，`package.json`配 `"module"`+ `"main"` |
| 写浏览器直接引用的 SDK | 输出 UMD 或 ESM，UMD 做兜底                                  |
| 魔笔/低代码平台        | 通常跑在 Node 环境 → CommonJS                                |

------

# 五、一个常见面试题

> **CommonJS 和 ES Module 最大的区别是什么？**

| 区别点                  | CommonJS                 | ES Module                      |
| ----------------------- | ------------------------ | ------------------------------ |
| 加载时机                | 运行时                   | 编译时（静态）                 |
| 导出的值                | 值拷贝（副本）           | **活绑定（引用）**             |
| `import`位置            | 可以写在条件里           | **必须顶层**                   |
| `require`可以动态拼路径 | ✅ `require('./' + name)` | ❌ `import()`可以但返回 Promise |
| Tree-shaking            | ❌                        | ✅                              |



```
// CJS：导出的是值的快照
let count = 0;
setTimeout(() => count = 1, 100);
module.exports = { count };
// 消费者拿到的是 { count: 0 }，永远不会变成 1

// ESM：导出的是活绑定
export let count = 0;
setTimeout(() => count = 1, 100);
// 消费者 import { count } 后，100ms 后 count 变成 1 ✅
```
