/**
 * [doping-js] doping-client.js
 * 受け側のアプリケーションに埋め込む。
 */
((g, parent)=>{

  const NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  const Doping = g.Doping;
  const Event = Doping.Event, Key = Doping.Key;
  const EventAction = {
    'doping.tohead': toHead,
    'doping.tobody': toBody,
    'doping.evaljs': evalJs
  };

  let chan, port;
  if(g === parent)
    throw new Error('Cannot execute this module.');
  
  chan = new MessageChannel;
  port = Doping.port = chan.port1;

  const ready = new Promise(rsl=>{
    port.onmessage = e=>{
      const d = e.data || '', act = EventAction[d[ Key.Type ]];
      if(d == 'ping') {
        // console.log('receive PING from parent via chan.port1');
        port.postMessage('ping');
        return;
      }
      if(d == 'pong') {
        // console.log('receive PONG from parent via chan.port1');
        rsl();
        return;
      }
      typeof act == 'function' && act(d);
    };
    parent.postMessage(Event.Start, '*', [chan.port2]);
  });
  Doping.ready = ready;

  // API global Doping
  // Doping.ready.then(()=>Doping.port.postMessage( ... ))
  
  // Event Action
  function toHead(d) {
    _dope(d, 'head');
  }

  function toBody(d) {
    _dope(d, 'body');
  }

  function evalJs(d) {
    try {
      eval(d[ Key.Data ]);
    } catch(e) {
      console.error(d);
      throw e
    }
  }

  function _dope(d, target) {
    const el = document.createElement(d.element || 'script');
    el.type = d.elementType || 'text/javascript';
    Object.assign(el, d.attr || { });
    const targ = document.getElementsByTagName(target)[0];
    targ.insertBefore(el, NULL); // dope to last TODO customizable
  }

})(this, this.parent);
