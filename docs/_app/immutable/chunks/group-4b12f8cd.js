import{I as y}from"./init-e15d50c4.js";function l(n){return n}function h(n,...e){return m(n,Array.from,l,e)}function m(n,e,i,s){return function p(u,f){if(f>=s.length)return i(u);const t=new y,g=s[f++];let a=-1;for(const r of u){const o=g(r,++a,u),c=t.get(o);c?c.push(r):t.set(o,[r])}for(const[r,o]of t)t.set(r,p(o,f));return e(t)}(n,0)}export{h as g};
