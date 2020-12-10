# on-paint

A [tiny library](https://bundlephobia.com/result?p=on-paint) (approximately 684 bytes) to run any number of actions on every animation frame, meaning these actions will run as fast as your web browser is capable of running them.

## Installation

```
npm install on-paint
```

or

```
yarn add on-paint
```

or

```
pnpm add on-paint
```

## Usage

See [an example](https://stackblitz.com/edit/on-paint-example?file=index.html) for details.

An example action called `tether` is included in the library to give you an idea what's possible. All included example actions can be viewed by inspecting `onPaint.fns`.

The `tether` action can be used to keep an element pinned to the same position as a different reference element.

Why include example code in the library? It's the only example I could think of where using this library is the best way to accomplish shomething, so it's entirely possible that it'll be the only function you ever need or use.

```
import onPaint from 'onpaint';

const originalElement = document.getElementById('original');

const placeholderElement = document.getElementById('placeholder');

// Use "tether" function 
onPaint.set(onPaint.fns.tether)
```

## API

### `set(action, paused)`

Sets an action to be run. An action must be a function.

If `paused` is set to true, then the action will not immediately be run, otherwise an action will be run as soon as it is set, and will continue to run until otherwise specified.

Calling `set(action, paused)` will return a unique identifier that can be used to selectively pause/resume/delete this particular action.

### `delete(actionID)`

Deletes an action from the queue. When called, it must be passed the unique identier that is returned from the `set` action above.

Automatically pauses the execution of `onPaint` if there are no longer any active actions.

### `pause(actionID)`

Pauses an action, as specified by the unique identifier that is returned from the `set` action above.

Automatically pauses the execution of `onPaint` if there are no longer any active actions.

### `resume(actionID)`

Resumes an action, as specified by the unique identifier that is returned from the `set` action above.

### `run()`

Runs all the actions.

### `stop()`

Stops all the actions from executing, and pauses the execution of `onPaint`.

### `clear()`

Clears all the actions from memory. Automatically pauses the executionof `onPaint`.

### `fns`

Returns a object of all the example actions included with the onPaint library.

### `logPerformance`

When set to true, onPaint will log the performance characteristics of every action as it is run and give an average of how long each action takes to perform. 

 
## Performance

Wait, so we're running these actions _every single frame?_ Isn't that terrible for overall browser performance?

**PROBABLY.**

If your actions take too long to run, it's entirely possible that you'll encounter negative effects.

These negative effects can range from:
  * _Trivial:_  Dropping some frames, leading to jank
  * _Serious:_ Tying up the main thread, causing lag between user input and effect
  * _Catastrophic:_ Freezing your browser

**_In other words, use this library at your own risk._**

Ideally you should write performant enough actions that _all_ of them are capable of being run in less than 1/60th of a second (or approximately 16ms).

You should also ensure that you either `pause` or `delete` every action that you are not actively using so as to avoid any unnecessary performance hits.


## If using this library can hurt performance, why make it at all?

Because sometimes ... *very, very rarely* ... it's actually the best way to accomplish something.

See [an example](https://stackblitz.com/edit/on-paint-example?file=index.html) for details.

