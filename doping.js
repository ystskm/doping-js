/***/
// [doping-js] doping.js
(function(win) {

  var doperlist = [];
  var Doping = win.Doping = function(i) {
    if(!(this instanceof Doping))
      return doperlist[i];
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
