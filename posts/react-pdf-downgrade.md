---
title: "全面解析 React-PDF 的浏览器兼容性及其解决策略"
date: "2024-10-25"
categories: "Solution"
summary: "浏览器兼容问题，一直都是前端绕不过的坎，开发过程中，往往我们会遇到很多类似问题。其实最简单最直接的方法就是让客户升级浏览器版本，不过大多数情况是，各方面安全原因，客户系统无法升级，浏览器版本也无法升级。所以我们不得不采用降级兼容的方案，来解决此类问题。处理此类问题的大致流程如下："
---

## 背景

最近使用 `react-pdf` 进行 pdf 文件预览。上线后很长时间都没啥异常，不过一个突然下午，一个同事联系到我，说客户公司使用过程中发现文件预览页面无法打开。最初我也很纳闷，这么多客户使用了，都没问题，怎么现在突然有问题了。通过询问现场同事，才发现由于该客户的浏览器版本较低，项目中使用 react-pdf 预览 pdf 文件时，控制台提示语法错误 ：`# SyntaxError: Unexpected token '||=' on version`，报错来源 `pdf.worker.min.js` 文件。

## 一、问题复现

客户现场的机器没办法调试， 所以首先要能在本地复现这个错误才行，由于我本地用的是最新的 Chrome 浏览器，版本是 v123.0.6312.87 ，不会存在这个问题，也没法复现。所以考虑安装一个旧版本 Chrome 浏览器。因为之前遇到过 Chrome 79 下兼容问题，所以决定再下载一个测试试试。

安装旧版本 Chrome 教程参考：

> mac 安装`Chrome` 79 参考了：[Mac 上如何安装低版本 chrome 浏览器\_谷歌浏览器低版本下载安装包 mac-CSDN 博客](https://blog.csdn.net/zjuwwj/article/details/139114749)
>
> ./Google\ Chrome --user-data-dir=\$HOME/chrome-profile --chrome-version=79.0.3945.88
>
> 禁止 mac Chrome 更新：
>
> cd \~/Library/Google
>
> sudo chown root:whell GoogleSoftwareUpdate

下载完后 Chrome 79，果然，报错出现了，能复现就好办多了。

## 二、问题分析

### 1、兼容性查询

从报错信息可知，是 `||=` 语法不支持，查询发现，确实，只能兼容到 85 版本

> <https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment>

![](https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/image.png)

### 2、官网查询

接下来想到到 react-pdf github 官网找答案。很快，就发现官方有提及：就是将原来的 build 文件夹下的文件换成 legacy 下文件。从而兼容旧浏览器版本。

[GitHub - wojtekmaj/react-pdf: Display PDFs in your React app as easily as if they were images.](https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file#legacy-pdfjs-worker)

![](https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/image-1.png)

替换以后，**还是不行！** 同样的报错依然存在！

> 一度让我怀疑是不是文件没换成功！结果多次确认确实换了。

### 3、源码定位问题

这样看来很有可能是 pdfjs-dist/`legacy/`build/pdf.worker.min.js 这个文件兼容版本不够低呀，导致还是无法兼容 Chrome 79。

索性直接看源码，这样定位问题无疑最快。在 github 找到 pdfjs-dist 库（pdf.js:）的源码，先看看它怎么打包的，在 \~/gulpfile.mjs 打包文件里发现了问题！

[GitHub - mozilla/pdf.js: PDF Reader in JavaScript](https://github.com/mozilla/pdf.js)

![](https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/image-2.png)

可以看到，仅 pdfjs-dist 采用 webpack 进行打包，其中代码向下兼容仅支持到 Chrome >= 98。这就是为什么不支持 Chrome 79。

## 三、解决问题

到此为止，问题就很清晰了，官方的 legacy worker 文件仅支持到 Chrome 98！现在我们就要想办法让它支持更低的浏览器版本。我们只需将 pdfjs-dist/`legacy/`build/pdf.worker.min.js 引入项目再次打包（因为项目配置是支持到 chrome 52 的）。

我是 vite 项目，之前的 worker 文件引入方式是这样的：

- 改动之前

```js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.js",
  import.meta.url
).toString();
```

这样不会参与到 vite 的构建流程中，只会原样 copy 到 public 目录下。

> 原因可以参考：[静态资源处理 | Vite 官方中文文档](https://cn.vitejs.dev/guide/assets.html)

- 引文文件修改成

```js
// 加入打包
import "pdfjs-dist/legacy/build/pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.js",
  import.meta.url
).toString();
```

- vite confg 文件修改

```ts
config = {
  plugins: [
    react(),
    legacy({
      targets: ["chrome 52"], // 这是关键
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      renderLegacyChunks: true,
    }),
  ],
  optimizeDeps: {
    include: ["pdfjs-dist/legacy/build/pdf.worker.min.js"], // 强制构建
  },
};
```

这样就能将 pdfjs-dist/legacy/build/pdf.worker.min.js 再次构建成更低的版本支持。测试后，页面正常渲染！

## 四、预构建

问题是解决了，不过 pdfjs-dist/legacy/build/pdf.worker.min.js 再次参与打包，明显增加了构建时间！大概多了一分钟，这个不能忍！是不是可以预构建一次，后续除了 react-pdf 版本升级，不然就不需要重新构建了。说干就干。

### rollup 打包（放弃）

一开始我使用 采用一个新的 vite.worker.confg 去单独打包 worker 文件，因为 vite 底层打包用的 rollup。

```ts
import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import { legacyConfig } from "./vite.config";

export default defineConfig({
  build: {
    rollupOptions: {
      input: "node_modules/pdfjs-dist/build/pdf.worker.js",
      output: {
        dir: "public/worker",
        format: "iife",
        entryFileNames: "pdf.worker.js",
      },
    },
    copyPublicDir: false,
  },
  plugins: [legacy(legacyConfig)],
});
```

package.json 中添加一下命令：

```json
"build:worker": "vite build --config vite.worker.config.ts",
```

不过打包完又一些问题

1.  会多生成一些 legacy 文件。

2.  打包需要指定 format: "module",原来的 pdf.worker.js 已经被打包成一个 iife,再次进行打包后，运行时发生某些错误。

基于上面的各种不确定性问题，确定放弃这种方式。

### gulp 打包（最终方案）

回想我最初的目的，仅仅是想转换下 pdf.worker.js 的一些不兼容语法，脑海中突然浮现了 gulpjs ，一个流式的代码处理工具，做这个事情不就刚刚好！不会像 webpack 或者 rollup 这种封装过高的生产打包工具。

实现：

1、我们在根目录下新建一个 build 文件夹。执行以下命令：

```shell
mkdir build
cd build
pnpm init
npm install --save-dev gulp gulp-babel @babel/core @babel/cli @babel/preset-env
```

2、新建 gulpfile.js 文件

```js
const gulp = require("gulp");
const babel = require("gulp-babel");

const ENV_TARGETS = [
  "last 2 versions",
  "Chrome >= 52",
  "Firefox ESR",
  "Safari >= 16.4",
  "Node >= 18",
  "> 1%",
  "not IE > 0",
  "not dead",
];

function transpilePdfWorker() {
  return (
    gulp
      // 输入
      .src("../node_modules/pdfjs-dist/build/pdf.worker.js")
      .pipe(
        // 兼容旧浏览器
        babel({
          presets: ["@babel/preset-env"],
          targets: ENV_TARGETS,
        })
      )
      // 输出
      .pipe(gulp.dest("../public/worker", { overwrite: true }))
  );
}

// 导出默认任务
exports.default = transpilePdfWorker;
```

我们将 `../node_modules/pdfjs-dist/build/pdf.worker.js` 文件输入，并经过 babel 转换，最终输出到 `../public/worker` 文件夹里。

3、接下来 替换 PdfPreviewer.tsx 组件里的引用方式

```ts
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "/worker/pdf.worker.js", // 从 public/worker 目录里读
  import.meta.url
).toString();
```

经过测试，新的文件完美支持！

## 五、css 文本显示层位置偏移解决

目前为止，pdf 文件是能正常预览了，不过，里面的 css 样式却不太对，具体表现为文字层与背景层没法对齐，错乱。经过分析，发现是引入的的 react-pdf 中的两个 css 文件也存在样式不兼容问题。

```tsx
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
```

里面使用 css 的 `:is` ,这个方法仅支持到 Chrome 88，看来还得降级。
![](https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/image-3.png)

降级方法和上的 js 类似，利用 gulp 和 postcss

```js
const postcss = require("gulp-postcss");
const postcssPresetEnv = require("postcss-preset-env");

function genTranspileReactPdfCss() {
    gulp
      .src('../node_modules/react-pdf/dist/esm/Page/TextLayer.css')
      .pipe(
        postcss([
          postcssPresetEnv({
            features: {
              "custom-media-queries": true,
              "nesting-rules": true,
              "custom-selectors": true, // 包括 :is() 支持
              "custom-properties": true,
            },
            browsers: [
              "last 2 versions",
              "Chrome >= 52",
              "Firefox ESR",
              "Safari >= 16.4",
              "Node >= 18",
              "> 1%",
              "not ie <= 11",
              "not dead",
            ],
          }),
        ]),
      )
      .pipe(gulp.dest('../src/assets/pre-built', { overwrite: true }));
  };
}
```

然后项目更新一下引用的地址，指向预构建文件即可。到此为止，问题得以彻底解决！

## 六、总结

浏览器兼容问题，一直都是前端绕不过的坎，开发过程中，往往我们会遇到很多类似问题。其实最简单最直接的方法就是让客户升级浏览器版本，不过大多数情况是，各方面安全原因，客户系统无法升级，浏览器版本也无法升级。所以我们不得不采用降级兼容的方案，来解决此类问题。处理此类问题的大致流程如下：

1.  询问到尽可能多的用户环境信息：系统、屏幕分辨率、电脑型号、浏览器版本（重要）、网络环境。

2.  复现问题：拿到信息以后，尽量能在本地复现，这样方便调试，更快的定位和解决问题。否则，只能看看能否远程操作客户浏览器。

3.  定位问题：复现以后，通过控制台报错信息，网络请求里进行定位，可以根据常见问题依次排查定位。我一般的排查顺序如下：

    - 前端静态文件是否正常加载？

    - 客户网关是否正常配置，页面内容是否正常返回？有时候 js 内容返回的是 html, 这就是网关没配对。

    - 接口是否有报错？

    - 是否出现跨域？

4.  根据上面的定位，基本能发现具体问题，如果是兼容问题。可以参考以上方案就行降级操作。
