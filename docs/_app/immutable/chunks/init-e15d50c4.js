class c extends Map{constructor(t,s=a){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:s}}),t!=null)for(const[r,i]of t)this.set(r,i)}get(t){return super.get(n(this,t))}has(t){return super.has(n(this,t))}set(t,s){return super.set(u(this,t),s)}delete(t){return super.delete(o(this,t))}}function n({_intern:e,_key:t},s){const r=t(s);return e.has(r)?e.get(r):s}function u({_intern:e,_key:t},s){const r=t(s);return e.has(r)?e.get(r):(e.set(r,s),s)}function o({_intern:e,_key:t},s){const r=t(s);return e.has(r)&&(s=e.get(r),e.delete(r)),s}function a(e){return e!==null&&typeof e=="object"?e.valueOf():e}function h(e,t){switch(arguments.length){case 0:break;case 1:this.range(e);break;default:this.range(t).domain(e);break}return this}export{c as I,h as i};