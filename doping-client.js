/***/
// [doping-js] doping-client.js
(function(win, parent) {

  var Doping = win.Doping;
  var Event = Doping.Event, Key = Doping.Key;

  var EventAction = {
    'doping.tohead': toHead,
    'doping.tobody': toBody,
    'doping.evaljs': evalJs
  };

  var chan, port;
  if(win === parent)
    throw new Error('Cannot execute this module.');
  
  chan = new MessageChannel;
  port = Doping.port = chan.port1;

  port.onmessage = onMessage;
  parent.postMessage(Event.Start, '*', [chan.port2]);

  function onMessage(e) {
    var d = e.data || '', fn = EventAction[d[Key.Type]];
    typeof fn == 'function' && fn(d);
  }

  function toHead(d) {
    _dope(d, 'head');
  }

  function toBody(d) {
    _dope(d, 'body');
  }

  function evalJs(d) {
    try {
      eval(d[Key.Data]);
    } catch(e) {
      console.error(d);
      throw e
    }
  }

  function _dope(d, target) {
    var el = document.createElement(d.element || 'script');
    el.type = d.elementType || 'text/javascript';
    for( var i in (d.attr || {}))
      el[i] = d.attr[i];
    var targ = document.getElementsByTagName(target)[0];
    targ.insertBefore(el, null); // dope to last TODO customizable  
  }

})(window, window.parent);
