/***/
// [doping-js] doping-server.js
(function(win, parent) {

  var Doping = win.Doping;
  var emitter = Doping.emitter = new Emitter();
  var Event = Doping.Event, Key = Doping.Key;

  var DopeProtos = {
    toHead: toHead,
    toBody: toBody,
    evalJs: evalJs
  };
  for( var i in DopeProtos)
    Doping.prototype[i] = DopeProtos[i];

  var _fn = win.onmessage;
  win.onmessage = onMessage;

  function onMessage() {
    var e = arguments[0], port = e.ports[0], data = e.data;
    if(data != Event.Start)
      return typeof _fn == 'function' && _fn.apply(this, arguments);
    _newPort(new Doping(), port)
  }

  var portlist = [];

  function _newPort(doper, port) {
    doper.port = port;
    emitter.emit(Event.Start, doper, portlist.push(port) - 1)
  }

  function get(i) {
    return portlist[i];
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
