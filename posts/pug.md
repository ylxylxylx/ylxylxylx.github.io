---
title: "Pug 模板引擎：学习与使用"
date: "2025-04-23"
categories: "other"
summary: "在前端开发中，模板引擎的使用可以极大地提高代码的可读性和可维护性。`Pug`（也称为 `Jade`）是一个流行的 `Node.js` 模板引擎，它使用简洁的语法来创建 HTML 结构。由于在`vue3`文档中看到了`Pug`的影子,便决定学习体验一番。"
---

# Pug 模板引擎：学习与使用

在前端开发中，模板引擎的使用可以极大地提高代码的可读性和可维护性。`Pug`（也称为 `Jade`）是一个流行的 `Node.js` 模板引擎，它使用简洁的语法来创建 HTML 结构。由于在`vue3`文档中看到了`Pug`的影子,便决定学习体验一番。

## 一、安装与配置

首先，确保你的项目中已经安装了 `Node.js` 和 `npm`（Node 包管理器）。然后，可以通过 `npm` 来安装 `Pug`。在命令行中执行以下命令：

```
npm install pug
```

## 二、基础语法

Pug 的语法非常简洁，它使用缩进来表示 HTML 元素的层级关系，而不是使用传统的尖括号和结束标签。以下是一些基础语法的示例：

### 1. 文档类型与 HTML 元素

```pug
doctype html
html
 head
 title My Pug Page
 body
 h1 Hello, Pug!
```

### 2. 变量与插值

```pug
- var name = 'John'
  p Hello, #{name}!
```

### 3. 条件语句

```pug

- var isLoggedIn = true
  if isLoggedIn
   p You are logged in.
  else
   p Please log in.
```

### 4. 循环

```pug
- var users = ['Alice', 'Bob', 'Charlie']
  ul
   for user in users
   li #{user}
```

## 三、混合与包含

Pug 允许你创建可重用的代码块，称为混合（mixin），以及包含其他模板文件。

### 1. 混合

```pug
mixin list
 ul
 li Item 1
 li Item 2

+list()
```

### 2. 包含

假设你有一个名为 header.pug 的模板文件，你可以在其他模板中这样包含它：

```pug
include header

body
 h1 My Page
```

## 四、在 vue3 的 template 中使用 Pug

尽管 Pug 有自己的语法，可以定义变量，可以有 if 和 case-when 条件分支和 each-in 遍历，有自己的插值方式 #{} ， 但如果在 template 里使用 Pug 语言，则不建议使用这些语法，而应该结合 Vue 的指令(如 v-if , v-for )和 mushache 插值方式。主要有以下原因：

- 一致性和可预测性：Vue 提供了自己的模板语法，该语法在 Vue 社区中广泛接受和使用。使用 Vue 的指令和插值方式可以确保代码的一致性和可预测性，这有助于其他 Vue 开发者更容易地理解和维护你的代码。

- 集成和兼容性：Vue 的指令和插值方式与 Vue 的响应式系统紧密集成。使用 Vue 的语法可以确保数据的变化能够正确地触发视图的更新。而使用 Pug 的原生语法可能会导致一些意料之外的行为或兼容性问题。

- 工具链支持：Vue 的模板语法在 Vue 的官方工具链（如 Vue CLI、Vite 等）中得到了很好的支持。这些工具可以帮助你进行代码拆分、热重载、静态分析等操作。相比之下，使用 Pug 可能会增加配置的复杂性，并可能减少与 Vue 工具链的集成度。

- 社区支持：Vue 的模板语法拥有庞大的社区支持，这意味着你可以更容易地找到相关的教程、文档和社区讨论。而 Pug 的社区虽然也很活跃，但可能与 Vue 社区不完全重合。

- 可读性和维护性：虽然 Pug 提供了一种简洁的语法来编写模板，但对于不熟悉 Pug 的开发者来说，它可能会增加阅读和维护的难度。使用 Vue 的模板语法可以使代码更加直观和易于理解。

### 1. 安装对应插件

```
npm i pug pug-plain-loader
```

### 2. 插值，属性和指令

- `mushache`插值

```pug
<script setup lang="ts">
let title = "hello world",
</script>
<template lang="pug">
div
  h1 {{ title }}
  p This is a Pug template in Vue 3!
</template>
```

这段代码中使用 `mushache` 对 `title` 进行插值

- 属性 每个元素的属性都应该写在其后面的圆括号中，除了 `id` 和 `class` 可以简写。（所有的 指定都是属性，都应写在括号中）

```pug
<script setup lang="ts">
.box(id="box")
    header(class="header")
        p(class="title") {{ title }}
</template>
```

- `v-if` 条件分支

```pug
<script setup lang="ts">
import { ref } from "vue"

const isAdd = ref(true)

</script>
<template lang="pug">
button(v-if="isAdd") 新增
button(v-else) 编辑
</template>
```

- `v-for` 遍历

```pug
<script setup lang="ts">
import { ref } from "vue"

const boxText = ref([ 1,2,3,4,5])

</script>
<template lang="pug">
ul
  li(v-for="(item, i) in boxText")
    p {{ item }}
</template>
```

- `v-bind` 和 `v-on`

```pug
<script setup lang="ts">
import { ref } from "vue"

const isAdd = ref(true)

const boxText = ref(['x','xx','xxx','xxxx','xxxx'])

const add = () => {}

const edit = () => {}

</script>
<template lang="pug">
ul
  li(v-for="(item, i) in boxText")
    p(:class="['p' + index]") {{ item }}

button(v-if="isAdd" @click="add") 新增
button(v-else @click="edit") 编辑
</template>
```

- `v-model` 双向绑定

```pug
<script setup lang="ts">
import { ref } from 'vue'
const username = ref('');
</script>

<template lang="pug">
input(v-model="username" placeholder="请输入用户名")
</template>
​
```

### 3. 插槽

- 创建子组件（ChildComponent.vue）

在子组件中，可以定义默认插槽或具名插槽。例如：

```pug
<!-- ChildComponent.vue -->

<script setup lang="ts">
// 定义组件的逻辑部分...
</script>

<template lang="pug">
div
  h2 Child Component
  slot() // 默认插槽
  slot(name="namedSlot") // 具名插槽
</template>
```

- 在父组件中使用子组件的插槽 (ParentComponent.vue)

在父组件中，可以使用 `<template>` 标签和 `v-slot` 指令来定义插槽内容

```pug
<!-- ParentComponent.vue -->

<script setup lang="ts">
import ChildComponent from './ChildComponent.vue';
</script>

<template lang="pug">
div
  h1 Parent Component
  ChildComponent
    template(v-slot) // 默认插槽内容
      p This is the default slot content.
    template(v-slot:namedSlot) // 具名插槽内容
      p This is the named slot content.
</template>
```

在上面的例子中，父组件 `ParentComponent` 使用了 `ChildComponent`，并通过 `<template>` 标签和 `v-slot` 或 `v-slot:namedSlot` 来定义插槽内容。

- 使用作用域插槽

> 对于作用域插槽，你可以在子组件的 slot 标签上绑定属性，然后在父组件的插槽模板中通过 v-slot 的值来接收这些属性。

子组件中定义作用域插槽：

```pug
<!-- ChildComponent.vue -->

<script setup lang="ts">
import { ref } from 'vue';

const someItem = ref({ name: 'Example', value: 123 });
</script>

<template lang="pug">
div
  slot(name="scopedSlot" :item="someItem") // 传递数据的作用域插槽
</template>
```

父组件中使用作用域插槽：

```pug
<!-- ParentComponent.vue -->

<script setup lang="ts">
import ChildComponent from './ChildComponent.vue';
</script>

<template lang="pug">
div
  h1 Parent Component
  ChildComponent
    template(v-slot:scopedSlot="{ item }") // 接收作用域插槽的数据
      p {{ item.name }}: {{ item.value }}
</template>
```

在这个作用域插槽的例子中，子组件通过 `slot` 标签的 `:item="someItem"` 传递了一个响应式对象 `someItem` 到作用域插槽。父组件通过 `v-slot:scopedSlot="{ item }"` 来接收这个对象，并在模板中使用它。

## 五、总结

在 Vue 3 中使用 Pug（也称为 Jade）作为模板引擎，具有一些明显的优点和潜在的缺点。

### 1. 优点:

- 简洁的语法：Pug 的语法非常简洁，通过缩进和换行来表示元素之间的层级关系，减少了模板中的冗余代码。这使得代码更加清晰易读，也更容易编写和维护。
- 提高开发效率：由于 Pug 的语法简洁，开发者可以更快地编写模板，提高开发效率。同时，Pug 还支持混合（mixin）功能，允许开发者定义可重用的代码块，进一步减少重复代码。
- 强大的功能：Pug 提供了丰富的功能，如条件语句、循环、过滤器等，使得开发者能够在模板中实现复杂的逻辑。这些功能使得 Pug 在处理复杂页面布局和交互时具有很大的灵活性。
- 与 Vue 3 的良好集成：Vue 3 支持使用不同的模板引擎，包括 Pug。Pug 可以与 Vue 3 的响应式系统、组件系统等无缝集成，使得开发者能够充分利用 Vue 3 的功能和特性。

### 2. 缺点:

- 学习成本：对于没有使用过 Pug 的开发者来说，需要花费一定的时间来学习其语法和特性。虽然 Pug 的语法相对简洁，但与 HTML 相比仍有一定的差异，这可能会增加学习成本。
- 社区支持：虽然 Pug 是一个流行的模板引擎，但相对于 HTML 来说，其社区规模可能较小。这意味着在遇到问题时，可能难以找到足够的资源和支持。
- 浏览器兼容性：由于 Pug 在编译时会转换为 HTML，因此在浏览器兼容性方面通常不会有问题。但是，如果开发者在 Pug 中使用了某些非标准的特性或语法，可能会导致在某些浏览器中出现问题。
- 工具链集成：虽然 Vue 3 支持 Pug，但某些 Vue 生态中的工具链（如 Vue CLI 插件、构建工具等）可能不完全支持 Pug 或需要额外的配置。这可能会增加项目的复杂性和配置成本。

因此，在选择是否使用 Pug 时，需要根据项目的需求和团队的实际情况进行权衡。
