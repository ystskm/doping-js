/**
 * [doping-js] doping.js
 * 基本名前空間 Class:Doping を作成する。server / client 共通
 * このクラスは server で Event.Start = "doping.port" イベントを受け取ると、create instance される。
 */
(g=>{ // g === window

  const doperlist = [ ];
  const Doping = g.Doping = function(i) {
    if(!(this instanceof Doping))
      return doperlist[i];
    if(typeof Emitter != 'undefined')
      Emitter.call(this);
    doperlist.push(this);
  };

  Doping.Event = {
    Start: 'doping.port',
    Incoming: 'incoming'
  };

  Doping.Key = {
    Type: 'type',
    Data: 'data'
  };

})(this);
