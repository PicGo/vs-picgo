# vs-picgo(Vscode Plugin for PicGo)

> [PicGo](https://github.com/PicGo)的vscode插件

## 功能

在VSCode里使用picgo，实现快速上传图片到远端图床并直接将URL写进Markdown文件里，极大提升Markdown贴图效率与体验。支持[PicGo](https://github.com/Molunerfinn/PicGo)原生自带的8种图床。

- 截图上传

![](https://raw.githubusercontent.com/Molunerfinn/test/master/picgo/vs-picgo-clipboard.gif)

- 文件管理器选择上传

![](https://raw.githubusercontent.com/Molunerfinn/test/master/picgo/vs-picgo-explorer.gif)

- 输入文件路径上传

![](https://raw.githubusercontent.com/Molunerfinn/test/master/picgo/vs-picgo-inputbox.gif)

## 配置

* 0配置：采用默认配置，默认配置中图床采用 SM.MS
* 自定义配置：

在vscode配置信息文件 `usersetting.json` 中加入
``` js
{
  "picgo": {
    "path": "path to your configure file" // 默认为空，则表示使用VSCode的setting.json
  },
  "picBed": {
    "current": "smms" // 默认使用 SM.MS 图床
  }
}
```

**如果你指定的`picgo`的`path`为空，那么将使用VSCode默认的`setting.json`作为配置文件。**

配置文件内容(usersetting.json文件中picgo.path路径指定的文件)里需要配置的项主要是`picBed`：
详细信息可参看[PicGo-配置](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#%E9%BB%98%E8%AE%A4%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)


``` js
{
  "picBed": {
    "current": "smms", // 代表当前的默认上传图床为SM.MS
    "weibo":{           // 微博图床配置
      "chooseCookie": true | false,
      "username": "",
      "password": "",
      "quality": "thumbnail" | "mw690" | "large",
      "cookie": ""
    },
    "qiniu": {          // 七牛图床配置
      "accessKey": "",
      "secretKey": "",
      "bucket": "",
      "url": "",
      "area": "",
      "options": ""
    },
    "upyun": {          // 又拍云图床配置
      "bucket": "",
      "operator": "",
      "password": "",
      "options": "",
      "path": "",
      "url": ""
    },
    "tcyun": {         // 腾讯云图床配置
      "secretId": "",
      "secretKey": "",
      "bucket": "",
      "appId": "",
      "area": "",
      "path": "",
      "customUrl": "",
      "version": "v5" | "v4"
    },
    "github": {       // github图床配置
      "repo": "",
      "token": "",
      "path": "",
      "customUrl": "",
      "branch": "",
      "username": ""
    },
    "aliyun": {       // 阿里云图床配置
      "accessKeyId": "",
      "accessKeySecret": "",
      "bucket": "",
      "area": "",
      "path": "",
      "customUrl": ""
    }
  }
}
```

## 键盘快捷键

1. 剪贴板图片上传：`ctrlOrCmd+alt+u`
2. 打开文件管理器上传：`ctrlOrCmd+alt+e`
3. 打开输入框输入路径上传：`ctrlOrCmd+alt+o`

以上快捷键均可重新自定义。

## 使用

* 在插件商店中查找**picgo**，并安装
* 安装完成后，可在命令面板中输入PicGo运行插件
* 推荐：为PicGo设置键盘快捷方式（自行设定）
* 选定文本再上传的话会使用选定的文本作为文件名


## Thanks

[PicGo-Core](https://github.com/PicGo/PicGo-Core)



**Enjoy!**

