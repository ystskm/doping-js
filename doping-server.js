/***/
// [doping-js] doping-server.js
(function(win, parent) {

  var Doping = win.Doping;
  Doping.get = get;

  var Event = Doping.Event;
  var Key = Doping.Key;

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
    if(data != Event.Start) // message for others
      return typeof _fn == 'function' && _fn.apply(this, arguments);
    _newPort(new Doping(), port)
  }

  var motherlist = [];
  function _newPort(mother, port) {
    mother.port = port;
    mother.emit(Event.Start, mother, motherlist.push(mother) - 1)
  }

  function get(i) {
    return motherlist[i];
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
