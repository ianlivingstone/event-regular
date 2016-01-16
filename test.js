'use strict';
/*global describe:false it:false*/

var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var sinon = require('sinon');

var EventRegulator = require('./index').EventRegulator;
var subscribe = require('./index').subscribe;

describe('subscribe', function() {
  it('returns a regulator', function() {
    var emitter = new EventEmitter();
    var subscriptions = [
      [emitter, 'hello', function () {}]
    ];

    var returned = subscribe(subscriptions);
    assert.ok(returned instanceof EventRegulator);
    assert.strictEqual(returned.subscriptions.length, subscriptions.length);
  });
});

describe('EventRegulator', function() {
 
  var emitter;
  beforeEach(function() {
    emitter = new EventEmitter();
  });

  it('subscribes to events', function() {
    var regulator = new EventRegulator([
      [emitter, 'hello', function () {}],
      [emitter, 'haha', function () {}]
    ]);


    assert.strictEqual(regulator.subscriptions.length, 2);
    assert.strictEqual(emitter.listeners('hello').length, 1);
    assert.strictEqual(emitter.listeners('haha').length, 1);
  });

  it('removes subscriptions on terminal event', function() {
    var helloFn = sinon.stub();
    var dieFn = sinon.stub();
    var regulator = new EventRegulator([
      [emitter, 'hello', helloFn],
      [emitter, 'die', dieFn, true]
    ]);

    emitter.emit('die', 'woo');

    sinon.assert.calledOnce(dieFn);
    sinon.assert.callCount(helloFn, 0);

    assert.strictEqual(emitter.listeners('hello').length, 0);
    assert.strictEqual(emitter.listeners('die').length, 0);
    assert.strictEqual(regulator.subscriptions.length, 0);
    assert.strictEqual(regulator.destroyed, true);
  });

  it('can be destroyed', function () {
    var regulator = new EventRegulator([
      [emitter, 'hello', sinon.stub()]
    ]);

    regulator.destroy();

    assert.strictEqual(emitter.listeners('hello').length, 0);
    assert.strictEqual(regulator.subscriptions.length, 0);
    assert.strictEqual(regulator.destroyed, true);
  });
});
