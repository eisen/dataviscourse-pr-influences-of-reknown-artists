import{S as c,i as _,s as d,K as w,v as h,w as g,x as $,L as j,f as b,t as z,y as M,o as k,N as y}from"../../../chunks/index-cc78b405.js";import{s as m}from"../../../chunks/config-2227fd0b.js";import{M as S}from"../../../chunks/map-c4bb3140.js";import{j as u}from"../../../chunks/json-634995b1.js";function q(s){let n,e,a,r;w(s[3]);let i={width:s[2],height:s[1]};return n=new S({props:i}),s[4](n),{c(){h(n.$$.fragment)},l(t){g(n.$$.fragment,t)},m(t,f){$(n,t,f),e=!0,a||(r=j(window,"resize",s[3]),a=!0)},p(t,[f]){const o={};f&4&&(o.width=t[2]),f&2&&(o.height=t[1]),n.$set(o)},i(t){e||(b(n.$$.fragment,t),e=!0)},o(t){z(n.$$.fragment,t),e=!1},d(t){s[4](null),M(n,t),a=!1,r()}}}function C(s,n,e){let a,r,i;k(async()=>{const o=await u(`${m}/data/world.json`),l=await u(`${m}/data/artist-locations.json`),p=await u(`${m}/data/artist-influences.json`);i.Initialize(o,p,l)});function t(){e(2,a=window.outerWidth),e(1,r=window.outerHeight)}function f(o){y[o?"unshift":"push"](()=>{i=o,e(0,i)})}return e(2,a=0),e(1,r=0),[i,r,a,t,f]}class N extends c{constructor(n){super(),_(this,n,C,q,d,{})}}export{N as default};
