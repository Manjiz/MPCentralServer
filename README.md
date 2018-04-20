## 微信中控服务器（MP Central Server）

要求 `node >= 7.10.1`

功能点：

- 获取 access_token
- 获取签名
- 定时任务提前刷新 access_token

### 开发调试

在 `./config` 目录，补全 `default.yml` ，或者，补充配置文件 `development.yml` 和 `production.yml`

```bash
npm run dev
```

### 生产环境

```bash
npm start
```

### 参考

- [MPDOC:获取access_token](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183)
- [MPDOC:微信JS-SDK说明文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)
