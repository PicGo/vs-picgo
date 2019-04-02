# vs-picgo(Vscode Plugin for PicGo)

> The VSCode extension of [PicGo](https://github.com/PicGo)

## OverView

`vs-picgo` is a VSCode extension to upload images to a remote image hosting and insert the url into current active MarkDown file. It's more efficient. And it can give us a better experience of uploading images. `vs-picgo` supports 8 kinds of image hostings supported by [PicGo](https://github.com/PicGo).

- Uploading an image from clipboard
![clipboard.gif](https://i.loli.net/2019/03/21/5c93900712842.gif)
- Uploading images from explorer
![explorer.gif](https://i.loli.net/2019/03/21/5c9390959d7a1.gif)
- Uploading an image from input box
![inputbox.gif](https://i.loli.net/2019/03/21/5c939163807b6.gif)
- Select characters as image name
**Note: These characters, `$`, `:`, `/`, `?`, will be ignored in the image name.**
![image name.gif](https://i.loli.net/2019/03/21/5c9392c749d99.gif)

## Settings

- out of box
	* We could use `vs-picgo` without any setting.
	* The default image hosting is [SM.MS](https://sm.ms/).
- custom
	* insert the content below into `usersetting.json` of VSCode. [Detail information about custom setting](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#%E9%BB%98%E8%AE%A4%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)

**NOTE: picgo.path is prior to picBed, which means if picgo.path is not empty string, vs-picgo will use the configuration file defined by picogo.path.**

```js
{
  "picgo": {
    "path": "" // path to your external configure file, default value is "", which means that vs-picgo will use "picBed" info below. External configure file should be a JSON file containing all the "picBed" info below.,
    "logPath": ""  // path to the json log file which records all uploaded images, default to your_home_dir/vs-picgo-log.json
  },
  "picBed": {
    "current": "smms",  // current image hosting, default value is "smms"
    "weibo":{           // weibo image hosting
      "chooseCookie": true | false,
      "username": "",
      "password": "",
      "quality": "thumbnail" | "mw690" | "large",
      "cookie": ""
    },
    "qiniu": {          // qiniu image hosting
      "accessKey": "",
      "secretKey": "",
      "bucket": "",
      "url": "",
      "area": "",       // "z0" -> 华东, "z1" -> 华北, "z2" -> 华南, "na0" -> 北美, "as0" -> 东南亚
      "options": "" 		// prefix of url
      "path":"" 				// postfix of path
    },
    "upyun": {          // upyun image hosting
      "bucket": "",
      "operator": "",
      "password": "",
      "options": "",
      "path": "",
      "url": ""
    },
    "tcyun": {          // tcyun image hosting
      "secretId": "",
      "secretKey": "",
      "bucket": "",
      "appId": "",
      "area": "",
      "path": "",
      "customUrl": "",
      "version": "v5" | "v4"
    },
    "github": {         // github image hosting
      "repo": "",
      "token": "",
      "path": "",
      "customUrl": "",
      "branch": "",
      "username": ""
    },
    "aliyun": {         // aliyun image hosting
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

## KeyMap

**You can change all the keymaps below as you wish.**

- Uploading an image from clipboard
	* Windows/Unix: `Ctrl + Alt + u`
	* OsX: `Cmd + Opt + u`
- Uploading images from explorer
	* Windows/Unix: `Ctrl + Alt + e`
	* OsX: `Cmd + Opt + e`
- Uploading an image from input box 
	* Windows/Unix: `Ctrl + Alt + o`
	* OsX: `Cmd + Opt + 0`

## Usage

- Find `vs-picgo` in the extension store, and install `vs-picgo`. You can use `vs-picgo` on installation finishes. 

## Contributers

- [Spades-S](https://github.com/Spades-S)
- [Molunerfinn](https://github.com/Molunerfinn)
- [upupming](https://github.com/upupming)

## Thanks

- [PicGo-Core](https://github.com/PicGo/PicGo-Core)

**Enjoy!**
