'use strict';

function EventRegulator (subscriptions) {
  this.destroyed = false;

  var self = this;
  this.subscriptions = subscriptions.map(function (params) {

    var target = params[0];
    var event = params[1];
    var fn = params[2];
    var terminal = (params[3] === true); // booleanize it

    var listenerFn = function() {
      if (terminal) {
        self.destroy();
      }

      fn.apply(null, arguments);
    };

    target.on(event, listenerFn);

    return {
      target: target,
      event: event,
      listener: listenerFn,
      terminal: terminal
    };
  });
}

EventRegulator.prototype.destroy = function () {
  this.subscriptions.forEach(function(subscription) {
    subscription.target.removeListener(
      subscription.event, subscription.listener);
  });

  this.destroyed = true;
  this.subscriptions = [];
};

module.exports = EventRegulator;
