const registry = Symbol('registry');
const paused = Symbol('paused');
const loop = Symbol('loop');
const running = Symbol('running');

function notFound(sym) {
  return error(`Key [${sym.description}] not found`);
}

function error(msg) {
  return console.error(new Error(`onPaint: ${msg}`));
}

function runFn(pair, logPerformance = false) {
  logPerformance ? logTime(pair) : pair[1]();
}

function logTime(pair) {
  console.time(pair[0].description);
  pair[1]();
  console.timeEnd(pair[0].description);
}

export default {
  // Private variables/functions.
  [registry]: new Map(),
  [paused]: new Map(),
  [running]: false,
  [loop]: function () {
    if (!this[registry].size) return this.stop();

    requestAnimationFrame(() => {
      if (this[running]) {
        let entry;
        for (entry of this[registry].entries()) {
          runFn(entry, this.logPerformance);
        }
        this[loop]();
      }
    });
  },

  // User settings.
  logPerformance: false,

  // Set a function to execute on every frame.
  set: function (fn, isPaused = false) {
    if (typeof fn !== 'function') return error('Can only set a function.');

    const sym = Symbol(fn);
    if (isPaused) {
      this[paused].set(sym, fn);
    } else {
      this[registry].set(sym, fn);
      this.run();
    }
    return sym;
  },

  // Delete a particular function from the queue.
  delete: function (sym) {
    this[paused].delete(sym);
    this[registry].delete(sym);
  },

  // Pause the execution of a particular function.
  pause: function (sym) {
    const fn = this[registry].get(sym);
    if (!fn) return notFound(sym);
    this[paused].set(sym, fn);
    this[registry].delete(sym);
  },

  // Resume the execution of a particular function.
  resume: function (sym) {
    const fn = this[paused].get(sym);
    if (!fn) return notFound(sym);
    this[registry].set(sym, fn);
    this[paused].delete(sym);
    this.run();
  },

  // Execute all functions in the queue.
  run: function () {
    if (!this[running]) {
      this[running] = true;
      this[loop]();
    }
  },

  // Pause all execution of functions.
  stop: function () {
    this[running] = false;
  },

  // Clear all functions from the queue.
  clear: function () {
    this.stop();
    this[paused].clear();
    this[registry].clear();
  },

  // Common functions.
  fns: {
    tether: (anchorElem, targetElem) => () => {
      const { top, left, width, height } = anchorElem.getBoundingClientRect();
      targetElem.style.cssText = `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px`;
    },
  },
};
