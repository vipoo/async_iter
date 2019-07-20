<a name="fromStream"></a>

## fromStream(eventSource, dataEvent, closeEvent) ⇒ <code>iteration</code>
Returns an iterator, that emits as per the `dataEvent` of the `eventSource`

**Kind**: global function  
**Returns**: <code>iteration</code> - An iterable source  

| Param | Type | Description |
| --- | --- | --- |
| eventSource | <code>EventEmitter</code> | An object that supports the 'on' and 'removeListener' function |
| dataEvent | <code>String</code> | The main dataEvent name to listen to |
| closeEvent | <code>String</code> | When this event emits, the iteration is stopped |

