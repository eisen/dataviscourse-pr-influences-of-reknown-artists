class f extends Map{constructor(t,n=c){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:n}}),t!=null)for(const[r,s]of t)this.set(r,s)}get(t){return super.get(u(this,t))}has(t){return super.has(u(this,t))}set(t,n){return super.set(a(this,t),n)}delete(t){return super.delete(h(this,t))}}function u({_intern:e,_key:t},n){const r=t(n);return e.has(r)?e.get(r):n}function a({_intern:e,_key:t},n){const r=t(n);return e.has(r)?e.get(r):(e.set(r,n),n)}function h({_intern:e,_key:t},n){const r=t(n);return e.has(r)&&(n=e.get(r),e.delete(r)),n}function c(e){return e!==null&&typeof e=="object"?e.valueOf():e}function o(e,t,n){e=+e,t=+t,n=(s=arguments.length)<2?(t=e,e=0,1):s<3?1:+n;for(var r=-1,s=Math.max(0,Math.ceil((t-e)/n))|0,i=new Array(s);++r<s;)i[r]=e+r*n;return i}function g(e,t){switch(arguments.length){case 0:break;case 1:this.range(e);break;default:this.range(t).domain(e);break}return this}export{f as I,g as i,o as r};
