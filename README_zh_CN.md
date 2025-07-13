


使用
```js
pnpm install
pnpm run dev
```

参考：https://github.com/siyuan-note/plugin-sample-vite-svelte/ 

我的改进点

- 使用`make_dev_copy.js`来直接复制插件代码到思源工作空间的plugins，不使用软链接的原因是因为软链接无法同步，会导致多端同步造成插件被禁用。
- api.ts 丰富更多使用的API
- 默认使用多Tab设置页面