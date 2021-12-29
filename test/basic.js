/**
 * [doping-js](test) basic.js
 * 基本動作テスト
 * JSDOM が MessageChannel をサポートしたら自動化できる。
 */
const NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
const nodeunit = require('foonyah-ci');
const fs = require('fs'), jsdom = require('jsdom'), JSDOM = jsdom.JSDOM;
const f = require('foonyah');
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.sendTo(console);
let uri = 'http://127.0.0.1:58290';
let box, win, doc;
module.exports = nodeunit.testCase({
  'createWindow': function(t) {
    Promise.resolve().then(()=>{

      if(!isFunction(jsdom.env)) {
        t.ok(TRUE, '# NOTE # No jsdom.env style (' + process.version + ')');
      }
      return JSDOM.fromURL(uri, { virtualConsole,
        resources: "usable", runScripts: "dangerously"
      });

    }).then(dom=>{
      const _win_ = win = (box = dom).window, _doc_ = doc = win.document;
      let cnt = 0;
      return new Promise((rsl, rej)=>{
        const once = ()=>{
          cnt++;
          console.log('Waiting count = ' + cnt)
          if(_doc_.querySelector('iframe')) return rsl();
          if(cnt >= 10) return rej('TOO MUCH LOADING WAIT (0)');
          setTimeout(once, 800);
        };
        once();
      });
    }).then(()=>{
      t.eq(typeof win.Doping, 'function', 'doping core ready?');
      t.done();
    })['catch'](e=>{
      t.fail(e);
    });
    // [test] createWindow
  },
  'DOMWindow': function(t) {
    Promise.resolve().then(()=>{

      // Eval
      t.equals(win.eval('{ }'), NULL);

      // Function
      t.equals(typeof win.Function, 'function');
      t.equals(typeof win.Function(), 'function');
      t.equals(win.Function()(), NULL);

      // Error
      // t.deepEqual(win.Error, global.Error); => is not correct except in the foonyah environment.

      // Promise
      t.equals(typeof win.Promise, 'function');
      t.equals(typeof Promise.resolve, 'function');
      t.equals(typeof Promise.reject, 'function');

    }).then(()=>{
      t.done();
    })['catch'](e=>{
      t.fail(e);
    });
    // [test] DOMWindow
  }
}, 'basic.js');
// ---
function is(ty, x) {
  return f.is(ty, x);
}
function isFunction(x) {
  return f.isFunction(x);
}
function isArray(x) {
  return f.isArray(x);
}
