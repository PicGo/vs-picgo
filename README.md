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
- custom  **BIG NEWS  From 2.0.0, We can customize the settings in `vscode settings`**
  ![20190406155436.png](https://i.loli.net/2019/04/06/5ca85b3f1b952.png)

  * Use external configuration file
    * Enter the path of the configuration file 
    ![20190406155620.png](https://i.loli.net/2019/04/06/5ca85ba6c5858.png)

  * Use vscode settings
    * First, choose the current PicBed
    ![20190406155908.png](https://i.loli.net/2019/04/06/5ca85c4f0f93e.png)
    * Input all the info current PicBed need
    ![20190406160045.png](https://i.loli.net/2019/04/06/5ca85cb35667c.png)


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



#### Migration

* From ^1.0.0
  * External configuration file property has changed, from `picgo.path` to `picgo.configPath`.

## Usage

- Find `vs-picgo` in the extension store, and install `vs-picgo`. You can use `vs-picgo` on installation finishes. 

## Contributers

- [Spades-S](https://github.com/Spades-S)
- [Molunerfinn](https://github.com/Molunerfinn)
- [upupming](https://github.com/upupming)

## Thanks

- [PicGo-Core](https://github.com/PicGo/PicGo-Core)

**Enjoy!**
