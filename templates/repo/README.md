# REPO_NAME

Creating a pattern library of web components using [PaDL](https://github.com/britishgas-engineering/padl)

## Setup

```
npm i -g padl
npm i
```

## Commands

- padl g [component-name]
- padl d [component-name]
- padl serve
- padl test

## Creating new components

Using the command:

```
padl g [component]
```

It will create 3 files in `src` within a folder of the component's name:

 - component.js
 - story.js
 - styles.less

It will also create 2 files in `test` also in the component's name folder. These are a `html` and a `js` files.

## Writing tests

Using [WCT](https://github.com/Polymer/tools/tree/master/packages/web-component-tester). When creating a new component, padl will add 2 tests that will pass against 2 `test-fixture`.

## Development environment

Using [storybook HTML](https://storybook.js.org) to serve the components and the different states. Each component has a `story.js` with a preinstalled addon `knobs`.

To have more addons, check which ones are supported for [HTML here](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md).

By default the development environment will be served on `http://localhost:9001/`

## Distribution

On the command:

```
padl build
```

In the `dist` folder it will create the file `components.min.js`. Adding this script to your project/website will allow you to use your components.
Included in this file is the polyfills require for webcomponents.
