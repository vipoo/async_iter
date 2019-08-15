/**
 * Evaluate the supplied item returning a boolean
 *
 * @callback itemTest
 * @param {*} value - the value of the current source item
 * @param {Number} index the index of the item as per the source iteration
 * @return {boolean}
 */

/**
 * Evaluate the supplied item returning a boolean
 *
 * @callback evaluateItem
 * @param {*} value - the value of the current source item
 * @return {boolean}
 */

/**
 * Indicate if a batched buffer iteration should be emitted
 *
 * @callback triggerCallback
 * @param {*} value - the value of the current source item
 * @param {Array} currentBatch the current array of collected items - the last item will be `value`
 * @return {boolean} Returning true indicate that item can be emitted
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

/**
 * The callback function invoked to generate an push based async iterator
 *
 * @callback pumpCallback
 * @param {iterator} target - The target iterator object (supports next, return and throw)
> * target.next - call this function to push a value into the iteration - returns a promise when the consumer
has consumed this item.  Returns a promise that resolves to `{value, done}`
> * target.return - call this function when there are no more items to be pushed.  Signal to consumer that
the iteration has completed
> * target.throw - call this function when an error has been generated - raises the error within the consuming
iteration
 * @param {promise} hasStopped - a promise that resolves, when the consumer has stopped iterating.  This is an alternative
mechanism to identify a stopped iteration
> * `hasStopped.now()` - promise additonally supports a now() that returns true, when the consumer has stopped iterating
 */
