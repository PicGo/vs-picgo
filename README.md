# vs-picgo

> The VSCode extension of [PicGo](https://github.com/PicGo).

[![version](https://img.shields.io/vscode-marketplace/v/Spades.vs-picgo.svg?style=flat-square&label=vscode%20marketplace)](https://marketplace.visualstudio.com/items?itemName=Spades.vs-picgo)
[![installs](https://img.shields.io/vscode-marketplace/d/Spades.vs-picgo.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=Spades.vs-picgo)
[![Azure DevOps builds (branch)](https://img.shields.io/azure-devops/build/PicGo/9bbe4cd2-a9fe-4547-b13a-60ee81f12932/1/dev.svg?label=azure%20pipeline&style=flat-square)](https://dev.azure.com/PicGo/vs-picgo/_build?definitionId=1)
[![GitHub stars](https://img.shields.io/github/stars/PicGo/vs-picgo.svg?style=flat-square&label=github%20stars)](https://github.com/PicGo/vs-picgo)
[![PicGo Convention](https://img.shields.io/badge/picgo-convention-blue.svg?style=flat-square)](https://github.com/PicGo/bump-version)

## Overview

`vs-picgo` is a VSCode extension for uploading images to a remote image hosting service and insert the url into the current editing file. It's much more efficient than other tools. And it can give us the better experience of uploading images. `vs-picgo` supports 8 kinds of image hosting services: [weibo](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#%E5%BE%AE%E5%8D%9A%E5%9B%BE%E5%BA%8A), [qiniu](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#%E4%B8%83%E7%89%9B%E5%9B%BE%E5%BA%8A), [tcyun](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#%E8%85%BE%E8%AE%AF%E4%BA%91cos), [upyun](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#%E5%8F%88%E6%8B%8D%E4%BA%91), [github](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#github%E5%9B%BE%E5%BA%8A), [aliyun](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#%E9%98%BF%E9%87%8C%E4%BA%91oss), [imgur](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#imgur%E5%9B%BE%E5%BA%8A) and [SM.MS](https://sm.ms/), which are supported by [PicGo-Core](https://github.com/PicGo/PicGo-Core). And the plugin feature of PicGo-Core is working in progress.

## Features

<details>
<summary>Uploading an image from clipboard</summary>
<img src="https://i.loli.net/2019/04/09/5cac17d2d2265.gif" alt="clipboard.gif">
</details>

<details>
<summary>Uploading images from explorer</summary>
<img src="https://i.loli.net/2019/04/09/5cac17eea0d65.gif" alt="explorer.gif">
</details>

<details>
<summary>Uploading images from input box</summary>
<img src="https://i.loli.net/2019/04/09/5cac17fe52a86.gif" alt="input box.gif">
</details>

<details>
<summary>Use selection text as the uploaded `fileName`</summary>
<img src="https://i.loli.net/2019/04/09/5cac180fb1dc7.gif" alt="selection.gif">
<b>Notice: These characters: <code>\$</code>, <code>:</code>, <code>/</code>, <code>?</code> and newline will be ignored in the image name. </b>(Because they are invalid for file names.)
</details>

## Keyboard shortcuts

**You can change all the shortcuts below as you wish.**

| OS           | Uploading an image from clipboard               | Uploading images from explorer                  | Uploading an image from input box               |
| ------------ | ----------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| Windows/Unix | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>U</kbd> | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>E</kbd> | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>O</kbd> |
| OsX          | <kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>U</kbd>  | <kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>E</kbd>  | <kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>O</kbd>  |

## Settings

- out of box
  - We could use `vs-picgo` without any settings.
  - The default image hosting is [SM.MS](https://sm.ms/).
- custom

    <details>
    <summary><b>BIG NEWS: from 2.0.0, We can customize the settings in VSCode settings</b></summary>
    <img src="https://i.loli.net/2019/04/09/5cac1821b6621.png" alt="vscode-setting.png">
    </details>

  - Use an external configuration file

    <details>
    <summary>Enter the path of the configuration file</summary>
    <img src="https://i.loli.net/2019/04/09/5cac1836598a8.png" alt="external-config.png">
    </details>

  - Use VSCode settings

    <details>
    <summary>First, choose the current PicBed</summary>
    <img src="https://i.loli.net/2019/04/09/5cac1847b5907.png" alt="current-picbed.png">
    </details>

    <details>
    <summary>Then, input all the info the current PicBed needs</summary>
    <img src="https://i.loli.net/2019/04/09/5cac4950d176b.png" alt="picbed-info.png">
    </details>

    <details>
    <summary>Customize the name of the image to be uploaded</summary>
    <b>Notice: If you selected some text before uploading, the selection will become the <code>fileName</code> of the image to be uploaded.</b>
    <img src="https://i.loli.net/2019/04/09/5cac189446749.png" alt="image-name.png">
    </details>

    <details>
    <summary>Customize the output format of the uploaded image</summary>
    <img src="https://i.loli.net/2019/04/09/5cac18a5c9def.png" alt="output-format.png">
    </details>

    Suggested settings for [`PicGo-electron`](https://github.com/Molunerfinn/PicGo) users (See [PicGo configuration path](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#%E9%85%8D%E7%BD%AE%E6%89%8B%E5%86%8C) for more information):

    <details>

    **Notice: `YOUR_HOME_DIR` should be replaced by the path of your current user path.**

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
    <summary><code>picgo.configPath</code> and <code>picgo.dataInfoPath</code> can be set in vscode settings</summary>
    <img src="https://i.loli.net/2019/04/09/5cac19421ddf5.png" alt="for-picgo-user.png">
    </details>

    In this way:

    1. `vs-picgo` will use the same configuration as `PicGo-electron`.
    2. `PicGo-electron` will display all the uploaded images by `vs-picgo` in its gallery.

    </details>

## Migration

- From ^1.0.0 to ^2.x
  - External configuration file property has changed, from `picgo.path` to `picgo.configPath`.

## Versioning

For the versions available, see the [tags on PicGo/vs-picgo](https://github.com/PicGo/vs-picgo/tags). ChangeLogs can be found at [CHANGELOG.md](CHANGELOG.md). All the dev builds can be found on [Azure](https://dev.azure.com/upupming/vs-picgo/_build?definitionId=1), and you can just open the build of a specific commit, and go to the Summary tab to download the artifacts.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Contributors

- [Spades-S](https://github.com/Spades-S)
- [Molunerfinn](https://github.com/Molunerfinn)
- [upupming](https://github.com/upupming)

## Thanks

- [PicGo-Core](https://github.com/PicGo/PicGo-Core)

**Enjoy!**
