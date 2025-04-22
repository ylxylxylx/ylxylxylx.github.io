/*
 * @Author: ylx
 * @Description: 
 * @Date: 2025-04-22 15:47:27
 * @LastEditors: ylx
 * @LastEditTime: 2025-04-22 15:51:51
 * @FilePath: \ylxylxylx.github.io\components\comments.tsx
 */
"use client";

import Giscus from "@giscus/react";

export default function Comments() {
  return (
    <Giscus
      repo="ylxylxylx/ylxylxylx.github.io"
      repoId="R_kgDOOdmifQ"
      category="General"
      categoryId="DIC_kwDOOdmifc4CpVl5"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="zh-CN"
    />
  );
}
