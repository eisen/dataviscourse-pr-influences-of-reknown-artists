import{S as c,i as _,s as p,K as d,v as h,w,x as g,L as $,f as b,t as j,y as x,o as z,N as M}from"../../../chunks/index-cc78b405.js";import{s as f}from"../../../chunks/config-2227fd0b.js";import{M as k}from"../../../chunks/matrix-767c94fe.js";import{j as u}from"../../../chunks/json-634995b1.js";function y(s){let n,e,o,r;d(s[3]);let i={width:s[2],height:s[1]};return n=new k({props:i}),s[4](n),{c(){h(n.$$.fragment)},l(t){w(n.$$.fragment,t)},m(t,m){g(n,t,m),e=!0,o||(r=$(window,"resize",s[3]),o=!0)},p(t,[m]){const a={};m&4&&(a.width=t[2]),m&2&&(a.height=t[1]),n.$set(a)},i(t){e||(b(n.$$.fragment,t),e=!0)},o(t){j(n.$$.fragment,t),e=!1},d(t){s[4](null),x(n,t),o=!1,r()}}}function S(s,n,e){let o,r,i;z(async()=>{const a=await u(`${f}/data/artist-data.json`),l=await u(`${f}/data/artist-influences.json`);i.Initialize(a,l)});function t(){e(2,o=window.outerWidth),e(1,r=window.outerHeight)}function m(a){M[a?"unshift":"push"](()=>{i=a,e(0,i)})}return e(2,o=0),e(1,r=0),[i,r,o,t,m]}class K extends c{constructor(n){super(),_(this,n,S,y,p,{})}}export{K as default};
