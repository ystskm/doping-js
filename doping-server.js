/**
 * [doping-js] doping-server.js
 * 制御側のアプリケーションに埋め込む。
 */
((g, parent)=>{

  const NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  const Doping = g.Doping;
  Doping.get = get;

  const DopingEmitter = Doping.emitter = new Emitter(); // global emitter
  const Event = Doping.Event, Key = Doping.Key;
  const DopeProtos = { toHead, toBody, evalJs };
  Object.assign(Doping.prototype, Emitter.prototype);
  Object.assign(Doping.prototype, DopeProtos);

  const _onmessage = g.onmessage;
  g.onmessage = e=>{
    let port = e.ports[0], data = e.data;
    if(data == Event.Start) {
      // ここを通ったあとは受け取った mother で API が利用可能
      return _newPort(new Doping(), port);
    }
    // message for others
    typeof _onmessage == 'function' && _onmessage.apply(this, arguments);
  };

  const motherlist = [ ];
  function _newPort(mother, port) {
    const ready = new Promise(rsl=>{
      mother.port = port;
      port.onmessage = e=>{
        if(e.data == 'ping') {
          // console.log('receive PONG from parent via given port (chan.port2)');
          port.postMessage('pong'), rsl();
          return;
        }
        mother.emit(Event.Incoming, e.data, e);
      };
      port.postMessage('ping');
    }).then(()=>{
      DopingEmitter.emit(Event.Start, mother, motherlist.push(mother) - 1);
      // Detect new client start: Doping.emitter.on('doping.port', ...)
      // and receiving message from Doping.port.postMessage( ... ) to detect 'incoming' event
    });
    mother.ready = ready;
  }

  // API global Doping
  function get(i) {
    return i == NULL ? motherlist: motherlist[i];
  }

  // API for each mother
  function toHead(src) {
    const mother = this, m = { };
    m[ Key.Type ] = 'doping.tohead';
    const d = m[ Key.Data ] = { }, attr = d.attr = { };
    attr.src = src, mother.port.postMessage(m);
  }

  function toBody(src) {
    const mother = this, m = { };
    m[ Key.Type ] = 'doping.tobody';
    const d = m[ Key.Data ] = { }, attr = d.attr = { };
    attr.src = src, mother.port.postMessage(m);
  }

  function evalJs(src) {
    const mother = this, m = { };
    m[ Key.Type ] = 'doping.evaljs';
    const d = m[ Key.Data ] = src;
    mother.port.postMessage(m);
  }

})(this, this.parent);
