# PaDL - Pattern Design Library System

## Installation

```
npm i -g padl
```

## About

 This is a project that allows you to easily create pattern libraries, with pure webcomponents using polymer (or lit). It bundles
 all of your components together with the needed polyfills so that you only require one js file.

## Why use?

Padl does a few things that makes developing webcomponents easier:

  1. 🎉 Generates all the files that you need, when creating a pattern library and when creating a new component.
  2. 👩‍💻 Creates a kickass development environment, using storybook.
  3. 🚀 Bundles and tree shakes all the needed files together.

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
    ├── hello-world.min.js
    └── components.min.js

```

To create this example:

```sh
 npm i -g padl
 padl new hello-world
 cd hello-world && npm i
 padl g primary-button
 padl build
```

## Integration

  As seen in the example, `hello-world.min.js` file is created.

  This will add all the polyfills, components, lit-element and can inline your global styles. This is in an effort to reduce the amount of blocking, while keeping the file as small as possible.

  > Note:

  Our browser coverage is `last 2 browsers` + IE11. For this reason we aren't moving forward with ES modules,
  however with this setup it will allow us to start to look into how to implement.



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

### Config file

- type polymer/lit (String, Default: polymer, prefilled on setup)
- watch (Object)
  - watchGlob (Array)
  - commands (Array)
- static (Array)
- globalStyle
  - input (String)
  - output (String)
  - watch (String|Array|Glob)

```javascript
{
  "type": "lit",
  "watch": {
    "watchGlob": ["styles/**", "dist/*"],
    "commands": ["npm run less:watch"]
  },
  "static": ["./styles/fonts"],
  "globalStyle": {
    "inline": true,
    "input": "./styles/base/all.less",
    "output": "./dist/styles.min.css",
    "watch": "./styles/**"
  }
}
```

### Test your components

 Inside your pattern library

 ```
  padl test
 ```

 #### Options

  - persistent (default: false)
  - headless (default: false)

##### Persistent

  ```
   padl test --persistent
   padl test -p
  ```

##### Headless

 For headless testing to work you need a config file in your project root called `wct.headless.config.json`.

 An example of how this file could be:

  ```json
  {
    "plugins": {
      "local": {
        "browsers": ["chrome", "firefox"],
        "browserOptions": {
          "chrome": [
            "headless"
          ],
          "firefox": [
            "-headless"
          ]
        }
      }
    }
  }
  ```

  ```
   padl test --headless
   padl test -h
  ```

### Create sketch files of components (ALPHA - WIP)

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
