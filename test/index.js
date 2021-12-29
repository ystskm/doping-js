/**
 * [doping-js](test) index.js
 * このファイルと index.html を全てのパスに展開する。
 */
import {fetch as fetchPolyfill} from 'whatwg-fetch';
import parent from "./parent.html";
import child0 from "./child0.html";
(async g => {

  // stop recursion
  const pathname = location.pathname;
  let ty;
  console.log('Access =>', pathname, window.top.location.pathname, parent, child0);
  if(window !== window.top && pathname === window.top.location.pathname) return;

  // redirect if language is changed
  let content;
  switch(true) {
  case pathname.indexOf('/child0.') != -1:
    ty = 'c';
    content = await fetch(child0).then(r=>r.text());
    break;
  default:
    ty = 'p';
    content = await fetch(parent).then(r=>r.text());
  }
  document.getElementById("root").innerHTML = content;
  // <= この時点では script が実行されない
  Array.from(document.body.children).forEach(n=>{
    if(n.tagName == 'SCRIPT' && String(n.src).indexOf('/index.') != 0) n.remove();
  });
  let when = Promise.resolve();
  Array.from(document.querySelector('#root').children).forEach(scriptTag);
  return when.then(()=>{
    if(location.pathname == '/') {
      document.getElementsByTagName('iframe')[ 0 ].src = '/child0.' + Date.now() + '.html';
    }
  });
  function scriptTag(n, idx) {
    when = when.then(async ()=>{
      if(n.tagName != 'SCRIPT') return;
      n.remove();
      const s = document.createElement('script');
      let sync;
      s.type = 'text/javascript';
      if(n.src) {
        s.src = n.src;
        sync = 0;
      } else {
        s.innerHTML = n.innerText;
        sync = 1;
      }
      document.body.append(s);
      return new Promise(rsl=>{
        console.log(`[${ty}] script[ ${idx} ] is loading ... sync?${sync}`);
        sync ? rsl(): s.onload = rsl;
      });
    });
  }
})(this);
