# Event Regulator

Small module that exports a `EventRegulator` object which is used for creating
and tracking event subscriptions as groups. When a terminal event happens, all
event subscriptions are cleaned up ensuring deterministic behavior inside your
system.

### Example

```

// Subscribe to events on the socket, if error or close is emitted
// call onError or onClose and then remove all event listeners managed
// by this instance of the regulator object
var regulator = new EventRegulator([
  [mysocket, 'data', onData],
  [mysocket, 'connect', onConnect],
  [mysocket, 'timeout', onTimeout],
  [mysocket, 'error', onError, true], // terminal event
  [mysocket, 'close', onClose, true] // terminal event
]);

function onData (data) {
  // If we're going away, then destroy the regulator (removing all listeners)
  // and close the socket
  if (data === 'bye now') {
    regulator.destroy();
    mysocket.end('ok');
  }
}
```

### Install

You can install the `event-regulator` module from npm using:

```
npm install event-regulator
```

### License

MIT Licensed, full license in the `LICENSE` file.
