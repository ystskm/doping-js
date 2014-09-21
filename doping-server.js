/***/
// [doping-js] doping-server.js
(function(win, parent) {

  var Doping = win.Doping;
  Doping.get = get;

  var emitter = Doping.emitter = new Emitter(); // global emitter
  var Event = Doping.Event, Key = Doping.Key;

  var DopeProtos = {
    toHead: toHead,
    toBody: toBody,
    evalJs: evalJs
  };

  for( var i in Emitter.prototype)
    Doping.prototype[i] = Emitter.prototype[i];
  for( var i in DopeProtos)
    Doping.prototype[i] = DopeProtos[i];

  var _fn = win.onmessage;
  win.onmessage = onMessage;

  function onMessage() {
    var e = arguments[0], port = e.ports[0], data = e.data;
    if(data == Event.Start)
      return _newPort(new Doping(), port);

    // message for others
    typeof _fn == 'function' && _fn.apply(this, arguments);
  }

  var motherlist = [];
  function _newPort(mother, port) {
    mother.port = port, port.onmessage = function(e) {
      mother.emit('incoming', e.data, e);
    };
    emitter.emit(Event.Start, mother, motherlist.push(mother) - 1)
  }

  function get(i) {
    return i == null ? motherlist: motherlist[i];
  }

  function toHead(src) {
    var m = {};
    m[Key.Type] = 'doping.tohead';

    var d = m[Key.Data] = {}, attr = d.attr = {};
    attr.src = src, this.port.postMessage(m);
  }

  function toBody(src) {
    var m = {};
    m[Key.Type] = 'doping.tobody';

    var d = m[Key.Data] = {}, attr = d.attr = {};
    attr.src = src, this.port.postMessage(m);
  }

  function evalJs(src) {
    var m = {};
    m[Key.Type] = 'doping.evaljs';

    var d = m[Key.Data] = src;
    this.port.postMessage(m);
  }

})(window, window.parent);
