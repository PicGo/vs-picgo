## :tada: 2.1.4 (2021-08-21)


### :sparkles: Features

* **error:** throw error when no url found in output ([#101](https://github.com/PicGo/vs-picgo/issues/101)) ([e141afe](https://github.com/PicGo/vs-picgo/commit/e141afe))


### :bug: Bug Fixes

* **changelog:** fix changelog ([5560298](https://github.com/PicGo/vs-picgo/commit/5560298))
* **ci:** fix release-tag.yml ([bd72133](https://github.com/PicGo/vs-picgo/commit/bd72133))


### :package: Chore

* **ci:** auto release to marketplace & update picgo core to 1.4.25 ([0940b69](https://github.com/PicGo/vs-picgo/commit/0940b69))


### :pencil: Documentation

* **changelog:** fix changelog history ([90665eb](https://github.com/PicGo/vs-picgo/commit/90665eb))



## :tada: 2.1.3 (2021-08-13)


### :sparkles: Features

* **:arrow_up:** Upgrade(picgo-core): update picgo core to 1.4.24 (#97)

## :tada: 2.1.2 (2021-07-25)


### :bug: Bug Fixes

* **dep:** bundle picgo-core to dist ([5c523ed](https://github.com/PicGo/vs-picgo/commit/5c523ed))



## :tada: 2.1.1 (2021-07-25)

### :bug: Bug Fixes

* add tencent cos path option ([606b9d4](https://github.com/PicGo/vs-picgo/commit/606b9d4))
* azure pipeline + coveralls ([c8129ed](https://github.com/PicGo/vs-picgo/commit/c8129ed))
* **ci:** github actions use yarn to lock versions ([#77](https://github.com/PicGo/vs-picgo/issues/77)) ([3347690](https://github.com/PicGo/vs-picgo/commit/3347690))
* **clipboard:** set `PICGO_ENV` to `CLI`, fixes [#75](https://github.com/PicGo/vs-picgo/issues/75) ([#78](https://github.com/PicGo/vs-picgo/issues/78)) ([9aff38e](https://github.com/PicGo/vs-picgo/commit/9aff38e))
* **proxy:** add proxy config, fixes [#79](https://github.com/PicGo/vs-picgo/issues/79) ([5cd019d](https://github.com/PicGo/vs-picgo/commit/5cd019d))


### :package: Chore

* **.vscode:** update .vscode ([65f8157](https://github.com/PicGo/vs-picgo/commit/65f8157))
* add bump version ([#32](https://github.com/PicGo/vs-picgo/issues/32)) ([4ec0218](https://github.com/PicGo/vs-picgo/commit/4ec0218))
* add coverage collector ([e8b30b7](https://github.com/PicGo/vs-picgo/commit/e8b30b7))
* azure -> github actions ([5ae4ec2](https://github.com/PicGo/vs-picgo/commit/5ae4ec2))
* migrate to standardjs ([#83](https://github.com/PicGo/vs-picgo/issues/83)) ([75c8c97](https://github.com/PicGo/vs-picgo/commit/75c8c97))
* replace tslint with eslint ([ce3fe27](https://github.com/PicGo/vs-picgo/commit/ce3fe27))

## 2.1.0

  * upgrade dependencies, support sm.ms V2

## 2.0.4

  * fix bugs when upload images from clipboard in Windows 7 ([#34](https://github.com/PicGo/vs-picgo/issues/34))
  * currect azure project name ([#33](https://github.com/PicGo/vs-picgo/issues/33)) ([7082558](https://github.com/PicGo/vs-picgo/commit/7082558))
  * add bump version ([#32](https://github.com/PicGo/vs-picgo/issues/32)) ([4ec0218](https://github.com/PicGo/vs-picgo/commit/4ec0218))
  * Setup continuous integration appveyor & azure  ([#31](https://github.com/PicGo/vs-picgo/issues/31)) ([1b6de45](https://github.com/PicGo/vs-picgo/commit/1b6de45))

## 2.0.3

  * Update README: optimize the images
  * Delete `username` property in picgo.picBed.github

## 2.0.2

  * Fix README format at vscode market.
  * Change the description, add some keywords.

## 2.0.1

  * Update README.md.

## 2.0.0

  * Upgrade PicGo-Core to 1.3.4
  * Add the data file which contains the info of images uploaded by `vs-picgo`, which can be used by [picgo-plugin-vscode-migrator](https://github.com/upupming/picgo-plugin-vscode-migrator)
  * Updated: better settings description and let user configure in settings directly.
  * Change `external configuration file property` in PicGo config object.
  * Added: custom upload name & output format [#21](https://github.com/PicGo/vs-picgo/pull/21).

## 1.0.6

  * Upgrade PicGo-Core to fix errors caused by comments in a json file.
  * Update README.

## 1.0.5

  * Fix spelling errors in README.md
  * Update the regular expression of the image name.

## 1.0.4

  * Add English docs.
  * Change the image name filters.

## 1.0.3

  * Update dependencies: PicGo-Core 1.10 -> PicGo-Core 1.16 etc.

## 1.0.2

  * Update README.

## 1.0.1

  * Fix a bug caused by settings.json with comments.

## 1.0.0

  * Change repository's url and issue's url.
  * Upgrade PicGo-Core dependency: from ^1.1.5 to ^1.1.9.
  * Add notice in README.md.

## 0.0.3

  * Display a progress bar when uploading the image(s).

## 0.0.2

  * Support uploading images from Explorer/InputBox.

## 0.0.1

  * Support uploading images from Clipboard.
