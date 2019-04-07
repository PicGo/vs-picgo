# vs-picgo (VSCode Plugin of PicGo)

[![version](https://img.shields.io/vscode-marketplace/v/Spades.vs-picgo.svg?style=flat-square&label=vscode%20marketplace)](https://marketplace.visualstudio.com/items?itemName=Spades.vs-picgo)
[![installs](https://img.shields.io/vscode-marketplace/d/Spades.vs-picgo.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=Spades.vs-picgo)
[![AppVeyor](https://img.shields.io/appveyor/ci/upupming/vs-picgo.svg?style=flat-square&label=appveyor%20build)](https://ci.appveyor.com/project/PicGo/vs-picgo)
[![GitHub stars](https://img.shields.io/github/stars/PicGo/vs-picgo.svg?style=flat-square&label=github%20stars)](https://github.com/PicGo/vs-picgo)

> The VSCode extension of [PicGo](https://github.com/PicGo).

## Overview

`vs-picgo` is a VSCode extension for uploading images to a remote image hosting service and insert the url into current active MarkDown file. It's much more efficient than other tools. And it can give us better experience of uploading images. `vs-picgo` supports 8 kinds of image hosting services supported by [PicGo-Core](https://github.com/PicGo/PicGo-Core).

<details>
<summary>Uploading an image from clipboard</summary>

![clipboard.gif](https://i.loli.net/2019/04/07/5ca9b7cd03799.gif)


</details>
<details>
<summary>Uploading images from explorer</summary>

![explorer.gif](https://i.loli.net/2019/04/07/5ca9b928ea551.gif)


</details>

<details>
<summary>Uploading images from input box</summary>

![input-box.gif](https://i.loli.net/2019/04/07/5ca9ba8de982b.gif)



</details>

<details>
<summary>
Selection as image name.
<b>Notice: These characters: <code>$</code>, <code>:</code>, <code>/</code>, <code>?</code> and newline will be ignored in the image name. </b>(Because they are invalid for file names.)</summary>

![selection.gif](https://i.loli.net/2019/04/07/5ca9c332bab12.gif)

</details>

## Settings

- out of box
  - We could use `vs-picgo` without any setting.
  - The default image hosting is [SM.MS](https://sm.ms/).
- custom

  <details>
  <summary>
  <b>BIG NEWS: from 2.0.0, We can customize the settings in VSCode settings</b>
  </summary>

    ![20190407161930.png](https://i.loli.net/2019/04/07/5ca9b296a0623.png)


  </details>

  - Use an external configuration file

    <details>
    <summary>
    Enter the path of the configuration file
    </summary>

    ![20190407162027.png](https://i.loli.net/2019/04/07/5ca9b2cfb9b2d.png)


    </details>

  - Use VSCode settings

    <details>
    <summary>
    First, choose the current PicBed
    </summary>

    ![20190406155908.png](https://i.loli.net/2019/04/06/5ca85c4f0f93e.png)

    </details>

    <details>
    <summary>
    Then, input all the info current PicBed needs
    </summary>

    ![20190406160045.png](https://i.loli.net/2019/04/06/5ca85cb35667c.png)

    </details>

    <details>
    <summary>
    Customize the name of the image to be uploaded
    </summary>

    **Notice: The text you selected will become the fileName of the image to upload.**

    ![20190407162143.png](https://i.loli.net/2019/04/07/5ca9b31b04537.png)


    </details>
    <details>
    <summary>
    Customize the output format of the uploaded image
    </summary>

    ![20190407162238.png](https://i.loli.net/2019/04/07/5ca9b351eff04.png)


    </details>

    Suggested settings for [`PicGo-electron`](https://github.com/Molunerfinn/PicGo) users (See [PicGo configuration path](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#%E9%85%8D%E7%BD%AE%E6%89%8B%E5%86%8C) for more information):

    **Notice: `YOUR_HOME_DIR` should be replaced by the path of current user path.**

    ```json
    // Windows
    {
        "picgo.configPath":"YOUR_HOME_DIR\\AppData\\Roaming\\PicGo\\data.json", 
        "picgo.dataPath": "YOUR_HOME_DIR\\AppData\\Roaming\\PicGo\\data.json" 
    }

    // macOS
    {
        "picgo.configPath": "YOUR_HOME_DIR/Library/Application Support/picgo/data.json", 
        "picgo.dataPath": "YOUR_HOME_DIR/Library/Application Support/picgo/data.json" 
    }

    // Linux
    {
        "picgo.configPath": "YOUR_HOME_DIR/.config/picgo/data.json", 
        "picgo.dataPath": "YOUR_HOME_DIR/.config/picgo/data.json" 
    }
    ```
    <details>
    <summary>
     picgo.configPath and picgo.dataPath can be set in vscode setting
    </summary>

    ![20190407162328.png](https://i.loli.net/2019/04/07/5ca9b383c8299.png)

    </details>




    In this way:

    1. `vs-picgo` will use the same configuration as `PicGo-electron`.
    2. `PicGo-electron` will display all the uploaded images by `vs-picgo` in its gallery.

## Keyboard shortcuts

**You can change all the shortcuts below as you wish.**

|OS|Uploading an image from clipboard|Uploading images from explorer|Uploading an image from input box|
|----|----|-----|---|
|Windows/Unix|<kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>U</kbd>|<kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>E</kbd>|<kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>O</kbd>
|OsX|<kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>U</kbd>|<kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>E</kbd>|<kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>O</kbd>|

### Migration

- From ^1.0.0
  - External configuration file property has changed, from `picgo.path` to `picgo.configPath`.

## Usage

- Find `vs-picgo` in the extension store, and install `vs-picgo`. You can use `vs-picgo` on installation finished.

## Contributors

- [Spades-S](https://github.com/Spades-S)
- [Molunerfinn](https://github.com/Molunerfinn)
- [upupming](https://github.com/upupming)

## Thanks

- [PicGo-Core](https://github.com/PicGo/PicGo-Core)

**Enjoy!**
