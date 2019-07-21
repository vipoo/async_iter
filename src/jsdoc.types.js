/**
 * Indicate if a batched buffer iteration should be emitted
 *
 * @callback triggerCallback
 * @param {*} value - the value of the current source item
 * @param {Array} currentBatch the current array of collected items - the last item will be `value`
 */

/**
 * Callback to get description of an overflow event.
 * @callback overFlowEventCallback
 * @return {*} The item to emit when we persistent buffer overflows.  If underfined no overflow event will be emitted
 */

/**
 * @typedef PersistedItem
 * @type {object}
 * @property {string} value - the emitted value from the persisted store as a <code>Buffer</code> (ie: you may need to apply, toString())
 * @property {Function} completed - A function that must be called to removed the item
 */

