# PaDL - Pattern Design Library System

## Installation

Use [npx](https://nodejs.dev/learn/the-npx-nodejs-package-runner) to run PaDL instead of installing globally.

## About

 This is a project that allows you to easily create pattern libraries, with pure webcomponents using polymer (or lit). It bundles all of your components together with the needed polyfills so that you only require one js file.

## Why use?

PaDL does a few things that makes developing webcomponents easier:

  1. 🎉 Generates all the files that you need, when creating a pattern library and when creating a new component.
  2. 👩‍💻 Creates a kickass development environment, using Storybook.
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

```bash
 npx padl new hello-world
 cd hello-world && npm i
 padl g primary-button
 padl build
```

## Integration

  As seen in the example, `hello-world.min.js` file is created.

  This will add all the polyfills, components, lit-element and can inline your global styles. This is in an effort to reduce the amount of blocking, while keeping the file as small as possible.

  > Note: Our browser coverage is `last 2 browsers`.

## How to

```bash
Usage: padl [options] [command]

Options:
  -v, --v, --version      Output the current version
  -h, --help              output usage information

Commands:
  build [options]         Build padl web component files
  analysis                Analyse padl web component files
  delete|d [component]    Delete specific component
  generate|g [component]  Create new web component
  new [options] [name]    Create new library
  serve|s [options]       Serve web components using Storybook
  test|t [options]        Run tests
```


### Create a new pattern library

```bash
npx padl new [name]
```

#### Options

```bash
Options:
  --no-styles  Create a new library that does not need styles in the component
  -h, --help   output usage information
```

### Create a new component

 Inside your pattern library

 ```bash
npm run padl -- generate [component]
 ```

 ```bash
npm run padl -- g [component]
 ```

 This will create a lit component and also generate the `story.js`, `styles.less` with the test files.

### Delete a component

Inside your pattern library

 ```bash
npm run padl -- delete [component]
 ```

 ```bash
npm run padl -- d [component]
 ```

This will delete all the related files to the component including the test files.

### Build your library

Inside your pattern library

```bash
npm run build
```

#### Options

```bash
Options:
  --storybook  Creates static storybook with build
  -h, --help   output usage information
```

In your `dist` folder will find the `components.min.js`

| Files                  | Notes                                                        |
| ---------------------- | ------------------------------------------------------------ |
| components.js          | All components bundled together.                             |
| polyfill.js            | All polyfills bundled together.                              |
| components.min.js      | Components and polyfills bundled together and minified.      |
| only.components.min.js | Only components minified.                                    |
| hello-world.js         | Bundled components with side loading of polyfills and inline styling (if option turned on). Name based on repository or name in config. |
| hello-world.min.js     | Minfied version. **Recommend to use in production**.         |

### Serve a component

 Inside your pattern library

 ```bash
npm start
 ```

 This will generate a storybook of all your component stories at `localhost:9001`

 #### Options

```bash
Options:
  -p, --port <port>  Change port number
  --no-open          Stops serve from automatically opening in browser after loading
  --no-reload        Stops Storybook from automatically reloading to changes
  -h, --help         output usage information
```

### Config file

| Name         | Type                    | Default | Notes                                   |
| ------------ | ----------------------- | ------- | --------------------------------------- |
| type         | String                  | lit     |                                         |
| watch        | Object                  |         | Ability to watch changes in directories |
| └─ watchGlob | Array                   |         |                                         |
| └─ commands  | Array                   |         |                                         |
| static       | Array                   |         | Copy files into dist                    |
| globalStyle  | Object                  |         | Global less styles                      |
| └─ input     | String                  |         |                                         |
| └─ output    | String                  |         |                                         |
| └─ watch     | String \| Array \| Glob |         |                                         |
| └─ inline    | Boolean                 | false   | Add inline styles to bundle file        |

#### Example

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

```bash
npm t
```

 ```bash
npm run padl -- test
 ```

 #### Options

```bash
Options:
  -h, --headless    Run tests headlessly
  -p, --persistent  Keep tests open after running
  -h, --help        output usage information
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

## Dependencies

 This uses a variety of other resources:

 - [Lit Element](https://lit-element.polymer-project.org/)
 - [Storybook](https://storybook.js.org/)
