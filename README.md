# Baseball Field Component

This is a react component used to draw and react fielders and runners on baseball field.

## Component Properties

### Field Size
There are optional width and height props both with type `number` (unit: px)
It will be fit into the container size if not provided.
- width (optional)
- height (optional)

### Display Fielders and Runners
Three optional `boolean` type is provided with default `true` value:
- isShowFielders (optional)
- isShowRunners (optional)
- isShowBatter (optional)

### Trigger Function
- resetFieldersBtn (optional): an `object` type with `button HTMLElement`, its `onclick` event will be rewrite as reseting fielders position.

### Runners Update
- setRunner (optional): this `object` type is composed by `{ pos: RUNNER_POSITION (1~4), runto (optional): FINAL_POSITION (1~x) }`
  - pos: required, the runner's position
  - runto: optional, runner will run if the property is provided

### Fielders Callback function after move
- onFieldersMove (optional): `func` type, it will be called with an `object` type argument after any fielders is moved. The argument will be passed as `{ pos: FIELDER_POSITION (1~9), x: X_AXIS, y:Y_AXIS }`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `example/dist` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run transpile`

The transpiled files will be created into `dist` folder.

### `npm run deploy`

It will deploy the app into remote server `gh-pages` branch.

