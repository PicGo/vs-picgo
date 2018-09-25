# vs-picgo(Vscode Plugin for PicGo)

> [PicGo](https://github.com/PicGo)的vscode插件

## 功能
利用vs-picgo可以直接将剪切板中的图片插入到markdown文件中，可极大提升markdown的编写效率
## 配置

* 0配置：采用默认配置，默认配置中图床采用SM.MS
* 自定义配置：
在vscode配置信息文件usersetting.json中加入
``` json
{
	"picgo": {
		"path": "path to your configure file"
	}
}
```
配置文件内容(usersetting.json文件中picgo.path路径指定的文件)：
详细信息可参看[PicGo-配置](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#%E9%BB%98%E8%AE%A4%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
``` json
{
  "picBed": {
	"uploader": "smms", // 代表当前的默认上传图床为SM.MS
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


## 使用
* 在插件商店中查找**picgo**，并安装
* 安装完成后，可在命令面板中输入PicGo运行插件
* 推荐：为PicGo设置键盘快捷方式（自行设定）


## Thanks
[PicGo-Core](https://github.com/PicGo/PicGo-Core)



**Enjoy!**

