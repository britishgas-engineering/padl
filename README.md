# PaDL - Pattern Design Library System

## Installation

```
npm i -g padl
```

## About

 This is a project that allows you to easily create pattern libraries, with pure webcomponents using polymer (or lit). It bundles
 all of your components together with the needed polyfills so that you only require one js file (`dist/components.min.js`).

### Example structure

If we create a `hello-world` pattern library with a `primary-button` web component:

```
├─┬ hello-world
  ├─┬ src
  | └─┬ primary-button
  |   ├── component.js
  |   ├── story.js
  |   └── styles.less
  ├─┬ test
  | ├─┬ primary-button
  | | ├── primary-button_test.js
  | | └── primary-button_test.html
  | └── index.html
  └─┬ dist
    └─ components.min.js
```

To create this example:

```sh
 npm i -g padl
 padl new hello-world
 cd hello-world && npm i
 padl g primary-button
 padl build
```

## How to

### Create a new pattern library

```
  padl new [name]
```

#### Options

 - type: polymer, lit (default: polymer)

 ```
  padl new [name] --type lit
 ```

 After creating a new pattern library you can:

 ```
  cd [name] && npm i
 ```

### Create a new component

 Inside your pattern library

 ```
  padl g [component-name]
 ```

 This will create a polymer or lit component (based on your `.padl` type).
 It will also generate the `story.js`, `styles.less` and the test files.

### Delete a component

Inside your pattern library

 ```
  padl d [component-name]
 ```

### Build your library

Inside your pattern library

```
 padl build
```

In your `dist` folder will find the `components.min.js`

### Serve a component

 Inside your pattern library

 ```
  padl serve
 ```

 This will generate a storybook of all your component stories at `localhost:9001`

 #### Options

  - port: 8080 (default: 9001)

  ```
   padl serve --port 8080
  ```

### Test your components

 Inside your pattern library

 ```
  padl test
 ```

 #### Options

  - persistent (default: false)
  - headless (default: false)

  ```
   padl test --persistent
   padl test -p
  ```

  ```
   padl test --headless
   padl test -h
  ```

### Create sketch files of components

Inside your pattern library

```
 padl sketch
```

This will output a `stories.asketch.json` file. You will need to install this sketch plugin [`asketch2sketch.sketchplugin`](https://github.com/brainly/html-sketchapp/releases/download/v3.3.1/asketch2sketch-3-3-1.sketchplugin.zip)

## Dependencies

 This uses a variety of other resources:

 - Polymer
 - Lit Element
 - Storybook
 - Story2sketch
 - Html-sketchapp
