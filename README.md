<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Contents**

- [Admin boilerplate](#admin-boilerplate)
- [Instructions](#instructions)
  - [Useful commands](#useful-commands)
    - [Bootstrap project](#bootstrap-project)
    - [List available packages](#list-available-packages)
    - [Add new packages](#add-new-packages)
    - [Install dependencies](#install-dependencies)
    - [Build](#build)
  - [Development](#development)
  - [Note for releasing](#note-for-releasing)
    - [Sample](#sample)
    - [Explain](#explain)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Admin boilerplate

Require install: node (>10), yarn, lerna

# Instructions

## Useful commands

### Bootstrap project

```bash
yarn
lerna bootstrap
```

### List available packages

```bash
lerna list -a
```

### Add new packages

```bash
lerna create <package name>
```

### Install dependencies

```bash
lerna add --help
```

### Build

```bash
yarn build
```

## Development

You can open project at root `admin-boilerplate` or single package `packages/<package-name>`.

## Note for releasing

- [ ] You need to navigate to the master branch because we only make release on the newest of master branch.

You run the script [release.sh](./release.sh) for releasing new version.
You need to set `GL_TOKEN` so that the script can access the gitlab.
The script will do:

- [x] Choose version bumps
- [x] Generate change logs
- [x] Create commit and tags for the release
- [x] Push new release to the remote
- [x] Create relase on the git system (gitlab)

More detail [here](https://github.com/lerna/lerna/tree/main/commands/version#lifecycle-scripts).

### Sample

```bash
export GL_TOKEN=<your gitlab token>
./release.sh
```

### Explain

The script does:

```bash
# this is require for create release on the gitlab
export GL_API_URL=https://git.baikal.io/api/v4
export GL_TOKEN=<your gitlab token>

lerna version
```

For the GL_TOKEN, you can follow [this document](https://git.baikal.io/help/user/profile/personal_access_tokens.md#creating-a-personal-access-token) to genrate it.
