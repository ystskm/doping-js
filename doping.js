/***/
// [doping-js] doping.js
(function(win) {

  var doperlist = [];
  var Doping = win.Doping = function(i) {
    if(!(this instanceof Doping))
      return doperlist[i];
    if(typeof Emitter != 'undefined')
      Emitter.call(this);
    doperlist.push(this);
  };

  Doping.Event = {
    Start: 'doping.port'
  };

  Doping.Key = {
    Type: 'type',
    Data: 'data'
  };

})(window);
