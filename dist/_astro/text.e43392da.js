function O(){}const tt=t=>t;function bt(t,e){for(const n in e)t[n]=e[n];return t}function It(t){return t()}function vt(){return Object.create(null)}function q(t){t.forEach(It)}function et(t){return typeof t=="function"}function nt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function Jt(t){return Object.keys(t).length===0}function Gt(t,...e){if(t==null){for(const r of e)r(void 0);return O}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Kt(t,e,n){t.$$.on_destroy.push(Gt(e,n))}function $t(t){const e=typeof t=="string"&&t.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return e?[parseFloat(e[1]),e[2]||"px"]:[t,"px"]}const Vt=typeof window<"u";let at=Vt?()=>window.performance.now():()=>Date.now(),dt=Vt?t=>requestAnimationFrame(t):O;const V=new Set;function jt(t){V.forEach(e=>{e.c(t)||(V.delete(e),e.f())}),V.size!==0&&dt(jt)}function _t(t){let e;return V.size===0&&dt(jt),{promise:new Promise(n=>{V.add(e={c:t,f:n})}),abort(){V.delete(e)}}}let rt=!1;function Qt(){rt=!0}function Yt(){rt=!1}function Zt(t,e,n,r){for(;t<e;){const i=t+(e-t>>1);n(i)<=r?t=i+1:e=i}return t}function te(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const u=[];for(let l=0;l<e.length;l++){const d=e[l];d.claim_order!==void 0&&u.push(d)}e=u}const n=new Int32Array(e.length+1),r=new Int32Array(e.length);n[0]=-1;let i=0;for(let u=0;u<e.length;u++){const l=e[u].claim_order,d=(i>0&&e[n[i]].claim_order<=l?i+1:Zt(1,i,f=>e[n[f]].claim_order,l))-1;r[u]=n[d]+1;const a=d+1;n[a]=u,i=Math.max(a,i)}const s=[],o=[];let c=e.length-1;for(let u=n[i]+1;u!=0;u=r[u-1]){for(s.push(e[u-1]);c>=u;c--)o.push(e[c]);c--}for(;c>=0;c--)o.push(e[c]);s.reverse(),o.sort((u,l)=>u.claim_order-l.claim_order);for(let u=0,l=0;u<o.length;u++){for(;l<s.length&&o[u].claim_order>=s[l].claim_order;)l++;const d=l<s.length?s[l]:null;t.insertBefore(o[u],d)}}function ee(t,e){t.appendChild(e)}function Rt(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function ne(t){const e=E("style");return e.textContent="/* empty */",re(Rt(t),e),e.sheet}function re(t,e){return ee(t.head||t,e),e.sheet}function x(t,e){if(rt){for(te(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function j(t,e,n){rt&&!n?x(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function $(t){t.parentNode&&t.parentNode.removeChild(t)}function ie(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function E(t){return document.createElement(t)}function T(t){return document.createTextNode(t)}function U(){return T(" ")}function k(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function oe(t){return t.dataset.svelteH}function C(t){return Array.from(t.childNodes)}function se(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function Tt(t,e,n,r,i=!1){se(t);const s=(()=>{for(let o=t.claim_info.last_index;o<t.length;o++){const c=t[o];if(e(c)){const u=n(c);return u===void 0?t.splice(o,1):t[o]=u,i||(t.claim_info.last_index=o),c}}for(let o=t.claim_info.last_index-1;o>=0;o--){const c=t[o];if(e(c)){const u=n(c);return u===void 0?t.splice(o,1):t[o]=u,i?u===void 0&&t.claim_info.last_index--:t.claim_info.last_index=o,c}}return r()})();return s.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,s}function le(t,e,n,r){return Tt(t,i=>i.nodeName===e,i=>{const s=[];for(let o=0;o<i.attributes.length;o++){const c=i.attributes[o];n[c.name]||s.push(c.name)}s.forEach(o=>i.removeAttribute(o))},()=>r(e))}function S(t,e,n){return le(t,e,n,E)}function M(t,e){return Tt(t,n=>n.nodeType===3,n=>{const r=""+e;if(n.data.startsWith(r)){if(n.data.length!==r.length)return n.splitText(r.length)}else n.data=r},()=>T(e),!0)}function B(t){return M(t," ")}function G(t,e){e=""+e,t.data!==e&&(t.data=e)}function wt(t,e,n,r){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,r?"important":"")}function X(t,e,n){t.classList.toggle(e,!!n)}function ce(t,e,{bubbles:n=!1,cancelable:r=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:r})}const K=new Map;let Q=0;function ue(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function fe(t,e){const n={stylesheet:ne(e),rules:{}};return K.set(t,n),n}function qt(t,e,n,r,i,s,o,c=0){const u=16.666/r;let l=`{
`;for(let p=0;p<=1;p+=u){const v=e+(n-e)*s(p);l+=p*100+`%{${o(v,1-v)}}
`}const d=l+`100% {${o(n,1-n)}}
}`,a=`__svelte_${ue(d)}_${c}`,f=Rt(t),{stylesheet:_,rules:h}=K.get(f)||fe(f,t);h[a]||(h[a]=!0,_.insertRule(`@keyframes ${a} ${d}`,_.cssRules.length));const g=t.style.animation||"";return t.style.animation=`${g?`${g}, `:""}${a} ${r}ms linear ${i}ms 1 both`,Q+=1,a}function st(t,e){const n=(t.style.animation||"").split(", "),r=n.filter(e?s=>s.indexOf(e)<0:s=>s.indexOf("__svelte")===-1),i=n.length-r.length;i&&(t.style.animation=r.join(", "),Q-=i,Q||ae())}function ae(){dt(()=>{Q||(K.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&$(e)}),K.clear())})}let W;function L(t){W=t}function de(){if(!W)throw new Error("Function called outside component initialization");return W}function _e(t){de().$$.on_mount.push(t)}const I=[],xt=[];let R=[];const Et=[],he=Promise.resolve();let lt=!1;function me(){lt||(lt=!0,he.then(zt))}function A(t){R.push(t)}const ot=new Set;let D=0;function zt(){if(D!==0)return;const t=W;do{try{for(;D<I.length;){const e=I[D];D++,L(e),pe(e.$$)}}catch(e){throw I.length=0,D=0,e}for(L(null),I.length=0,D=0;xt.length;)xt.pop()();for(let e=0;e<R.length;e+=1){const n=R[e];ot.has(n)||(ot.add(n),n())}R.length=0}while(I.length);for(;Et.length;)Et.pop()();lt=!1,ot.clear(),L(t)}function pe(t){if(t.fragment!==null){t.update(),q(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(A)}}function ge(t){const e=[],n=[];R.forEach(r=>t.indexOf(r)===-1?e.push(r):n.push(r)),n.forEach(r=>r()),R=e}let F;function Ft(){return F||(F=Promise.resolve(),F.then(()=>{F=null})),F}function Y(t,e,n){t.dispatchEvent(ce(`${e?"intro":"outro"}${n}`))}const J=new Set;let N;function Ut(){N={r:0,c:[],p:N}}function Bt(){N.r||q(N.c),N=N.p}function Z(t,e){t&&t.i&&(J.delete(t),t.i(e))}function ct(t,e,n,r){if(t&&t.o){if(J.has(t))return;J.add(t),N.c.push(()=>{J.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}else r&&r()}const Lt={duration:0};function Mt(t,e,n){const r={direction:"in"};let i=e(t,n,r),s=!1,o,c,u=0;function l(){o&&st(t,o)}function d(){const{delay:f=0,duration:_=300,easing:h=tt,tick:g=O,css:p}=i||Lt;p&&(o=qt(t,0,1,_,f,h,p,u++)),g(0,1);const v=at()+f,y=v+_;c&&c.abort(),s=!0,A(()=>Y(t,!0,"start")),c=_t(m=>{if(s){if(m>=y)return g(1,0),Y(t,!0,"end"),l(),s=!1;if(m>=v){const w=h((m-v)/_);g(w,1-w)}}return s})}let a=!1;return{start(){a||(a=!0,st(t),et(i)?(i=i(r),Ft().then(d)):d())},invalidate(){a=!1},end(){s&&(l(),s=!1)}}}function ut(t,e,n){const r={direction:"out"};let i=e(t,n,r),s=!0,o;const c=N;c.r+=1;let u;function l(){const{delay:d=0,duration:a=300,easing:f=tt,tick:_=O,css:h}=i||Lt;h&&(o=qt(t,1,0,a,d,f,h));const g=at()+d,p=g+a;A(()=>Y(t,!1,"start")),"inert"in t&&(u=t.inert,t.inert=!0),_t(v=>{if(s){if(v>=p)return _(0,1),Y(t,!1,"end"),--c.r||q(c.c),!1;if(v>=g){const y=f((v-g)/a);_(1-y,y)}}return s})}return et(i)?Ft().then(()=>{i=i(r),l()}):l(),{end(d){d&&"inert"in t&&(t.inert=u),d&&i.tick&&i.tick(1,0),s&&(o&&st(t,o),s=!1)}}}function kt(t){return t?.length!==void 0?t:Array.from(t)}function ye(t,e,n){const{fragment:r,after_update:i}=t.$$;r&&r.m(e,n),A(()=>{const s=t.$$.on_mount.map(It).filter(et);t.$$.on_destroy?t.$$.on_destroy.push(...s):q(s),t.$$.on_mount=[]}),i.forEach(A)}function be(t,e){const n=t.$$;n.fragment!==null&&(ge(n.after_update),q(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ve(t,e){t.$$.dirty[0]===-1&&(I.push(t),me(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function $e(t,e,n,r,i,s,o=null,c=[-1]){const u=W;L(t);const l=t.$$={fragment:null,ctx:[],props:s,update:O,not_equal:i,bound:vt(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(u?u.$$.context:[])),callbacks:vt(),dirty:c,skip_bound:!1,root:e.target||u.$$.root};o&&o(l.root);let d=!1;if(l.ctx=n?n(t,e.props||{},(a,f,..._)=>{const h=_.length?_[0]:f;return l.ctx&&i(l.ctx[a],l.ctx[a]=h)&&(!l.skip_bound&&l.bound[a]&&l.bound[a](h),d&&ve(t,a)),f}):[],l.update(),d=!0,q(l.before_update),l.fragment=r?r(l.ctx):!1,e.target){if(e.hydrate){Qt();const a=C(e.target);l.fragment&&l.fragment.l(a),a.forEach($)}else l.fragment&&l.fragment.c();e.intro&&Z(t.$$.fragment),ye(t,e.target,e.anchor),Yt(),zt()}L(u)}class we{$$=void 0;$$set=void 0;$destroy(){be(this,1),this.$destroy=O}$on(e,n){if(!et(n))return O;const r=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return r.push(n),()=>{const i=r.indexOf(n);i!==-1&&r.splice(i,1)}}$set(e){this.$$set&&!Jt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const xe="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(xe);function Wt(t){const e=t-1;return e*e*e+1}function St(t){return-t*(t-2)}function Ee(t,{delay:e=0,duration:n=400,easing:r=tt}={}){const i=+getComputedStyle(t).opacity;return{delay:e,duration:n,easing:r,css:s=>`opacity: ${s*i}`}}function Ct(t,{delay:e=0,duration:n=400,easing:r=Wt,x:i=0,y:s=0,opacity:o=0}={}){const c=getComputedStyle(t),u=+c.opacity,l=c.transform==="none"?"":c.transform,d=u*(1-o),[a,f]=$t(i),[_,h]=$t(s);return{delay:e,duration:n,easing:r,css:(g,p)=>`
			transform: ${l} translate(${(1-g)*a}${f}, ${(1-g)*_}${h});
			opacity: ${u-d*p}`}}const P=[];function ke(t,e=O){let n;const r=new Set;function i(c){if(nt(t,c)&&(t=c,n)){const u=!P.length;for(const l of r)l[1](),P.push(l,t);if(u){for(let l=0;l<P.length;l+=2)P[l][0](P[l+1]);P.length=0}}}function s(c){i(c(t))}function o(c,u=O){const l=[c,u];return r.add(l),r.size===1&&(n=e(i,s)||O),c(t),()=>{r.delete(l),r.size===0&&n&&(n(),n=null)}}return{set:i,update:s,subscribe:o}}function Ot(t){return Object.prototype.toString.call(t)==="[object Date]"}function ft(t,e){if(t===e||t!==t)return()=>t;const n=typeof t;if(n!==typeof e||Array.isArray(t)!==Array.isArray(e))throw new Error("Cannot interpolate values of different type");if(Array.isArray(t)){const r=e.map((i,s)=>ft(t[s],i));return i=>r.map(s=>s(i))}if(n==="object"){if(!t||!e)throw new Error("Object cannot be null");if(Ot(t)&&Ot(e)){t=t.getTime(),e=e.getTime();const s=e-t;return o=>new Date(t+o*s)}const r=Object.keys(e),i={};return r.forEach(s=>{i[s]=ft(t[s],e[s])}),s=>{const o={};return r.forEach(c=>{o[c]=i[c](s)}),o}}if(n==="number"){const r=e-t;return i=>t+i*r}throw new Error(`Cannot interpolate ${n} values`)}function Se(t,e={}){const n=ke(t);let r,i=t;function s(o,c){if(t==null)return n.set(t=o),Promise.resolve();i=o;let u=r,l=!1,{delay:d=0,duration:a=400,easing:f=tt,interpolate:_=ft}=bt(bt({},e),c);if(a===0)return u&&(u.abort(),u=null),n.set(t=i),Promise.resolve();const h=at()+d;let g;return r=_t(p=>{if(p<h)return!0;l||(g=_(t,o),typeof a=="function"&&(a=a(t,o)),l=!0),u&&(u.abort(),u=null);const v=p-h;return v>a?(n.set(t=o),!1):(n.set(t=g(f(v/a))),!0)}),r.promise}return{set:s,update:(o,c)=>s(o(i,t),c),subscribe:n.subscribe}}var ht="http://localhost",mt="8000";ht=location.hostname,mt=location.port;console.log(`Server: ${ht}`);console.log(`Port: ${mt}`);const pt=location.protocol;console.log(`Protocol: ${pt}`);const Ht=pt==="https:"?"wss:":"ws:";console.log(`WS Protocol: ${Ht}`);const Ce=t=>`${Ht}//${ht.replace(pt,"")}:${mt}${t}`;async function Xt(t,e,n,r){var i=new WebSocket(Ce(t));console.log("socket",i),i.onopen=()=>{console.log("connected"),n&&n()},i.onclose=()=>{console.log("disconnected"),r&&r(),setTimeout(()=>{Xt(t,e,n,r)},5e3)},i.onmessage=s=>{const o=JSON.parse(s.data);e&&e(o)}}function Nt(t,e,n){const r=t.slice();return r[10]=e[n],r[12]=n,r}function At(t){let e,n,r,i,s;return{c(){e=E("p"),n=T(t[2]),this.h()},l(o){e=S(o,"P",{class:!0});var c=C(e);n=M(c,t[2]),c.forEach($),this.h()},h(){k(e,"class","text-xl font-light absolute m-auto w-fit opacity-70 left-0 right-0 animate-pulse"),X(e,"text-green-300",t[2]==="connected"),X(e,"text-red-300",t[2]==="disconnected")},m(o,c){j(o,e,c),x(e,n),s=!0},p(o,c){(!s||c&4)&&G(n,o[2]),(!s||c&4)&&X(e,"text-green-300",o[2]==="connected"),(!s||c&4)&&X(e,"text-red-300",o[2]==="disconnected")},i(o){s||(o&&A(()=>{s&&(i&&i.end(1),r=Mt(e,Ct,{duration:1e3,delay:400,y:20}),r.start())}),s=!0)},o(o){r&&r.invalidate(),o&&(i=ut(e,Ct,{duration:1e3,delay:400,y:-20})),s=!1},d(o){o&&$(e),o&&i&&i.end()}}}function Dt(t){let e,n=t[10]+"",r,i,s,o,c=t[10]+"",u,l,d,a;return{c(){e=E("div"),r=T(n),s=U(),o=E("div"),u=T(c),this.h()},l(f){e=S(f,"DIV",{class:!0});var _=C(e);r=M(_,n),_.forEach($),s=B(f),o=S(f,"DIV",{class:!0});var h=C(o);u=M(h,c),h.forEach($),this.h()},h(){k(e,"class","top rounded-t-md absolute top-0 drop-shadow-md svelte-ucm2mq"),k(o,"class","buttom rounded-b-md absolute bottom-0 drop-shadow-md svelte-ucm2mq")},m(f,_){j(f,e,_),x(e,r),j(f,s,_),j(f,o,_),x(o,u),a=!0},p(f,_){(!a||_&2)&&n!==(n=f[10]+"")&&G(r,n),(!a||_&2)&&c!==(c=f[10]+"")&&G(u,c)},i(f){a||(i&&i.end(1),f&&A(()=>{a&&(d&&d.end(1),l=Mt(o,t[5],{delay:t[12]*100}),l.start())}),a=!0)},o(f){f&&(i=ut(e,t[4],{delay:t[12]*100})),l&&l.invalidate(),f&&(d=ut(o,Ee,{delay:1e3})),a=!1},d(f){f&&($(e),$(s),$(o)),f&&i&&i.end(),f&&d&&d.end()}}}function Pt(t){let e,n=t[10],r=Dt(t);return{c(){e=E("div"),r.c(),this.h()},l(i){e=S(i,"DIV",{class:!0});var s=C(e);r.l(s),s.forEach($),this.h()},h(){k(e,"class","relative h-[1.45em] w-[1em] p-1")},m(i,s){j(i,e,s),r.m(e,null)},p(i,s){s&2&&nt(n,n=i[10])?(Ut(),ct(r,1,1,O),Bt(),r=Dt(i),r.c(),Z(r,1),r.m(e,null)):r.p(i,s)},d(i){i&&$(e),r.d(i)}}}function Oe(t){let e,n,r,i,s,o,c=t[2],u,l,d,a,f,_,h,g="°C",p=At(t),v=kt(String(t[1])),y=[];for(let m=0;m<v.length;m+=1)y[m]=Pt(Nt(t,v,m));return{c(){e=E("div"),n=E("div"),r=E("h1"),i=T(t[0]),s=U(),o=E("div"),p.c(),u=U(),l=E("div"),d=E("div"),a=U(),f=E("div");for(let m=0;m<y.length;m+=1)y[m].c();_=U(),h=E("span"),h.textContent=g,this.h()},l(m){e=S(m,"DIV",{class:!0});var w=C(e);n=S(w,"DIV",{class:!0});var b=C(n);r=S(b,"H1",{class:!0});var z=C(r);i=M(z,t[0]),z.forEach($),s=B(b),o=S(b,"DIV",{class:!0});var gt=C(o);p.l(gt),gt.forEach($),b.forEach($),u=B(w),l=S(w,"DIV",{class:!0});var yt=C(l);d=S(yt,"DIV",{class:!0,style:!0}),C(d).forEach($),yt.forEach($),a=B(w),f=S(w,"DIV",{class:!0});var H=C(f);for(let it=0;it<y.length;it+=1)y[it].l(H);_=B(H),h=S(H,"SPAN",{class:!0,"data-svelte-h":!0}),oe(h)!=="svelte-1a7ygqr"&&(h.textContent=g),H.forEach($),w.forEach($),this.h()},h(){k(r,"class","text-2xl font-light tracking-widest"),k(o,"class","relative h-12 w-full"),k(n,"class","flex flex-col"),k(d,"class","h-[200%] w-[4px] bg-white rounded-full bottom-0 absolute"),wt(d,"left",t[3]+"%"),k(l,"class","relative w-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 h-3 rounded-xl"),k(h,"class","px-2"),k(f,"class","flex flex-row gap-1 select-none items-center"),k(e,"class","flex flex-col gap-4 items-center text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold")},m(m,w){j(m,e,w),x(e,n),x(n,r),x(r,i),x(n,s),x(n,o),p.m(o,null),x(e,u),x(e,l),x(l,d),x(e,a),x(e,f);for(let b=0;b<y.length;b+=1)y[b]&&y[b].m(f,null);x(f,_),x(f,h)},p(m,[w]){if(w&1&&G(i,m[0]),w&4&&nt(c,c=m[2])?(Ut(),ct(p,1,1,O),Bt(),p=At(m),p.c(),Z(p,1),p.m(o,null)):p.p(m,w),w&8&&wt(d,"left",m[3]+"%"),w&2){v=kt(String(m[1]));let b;for(b=0;b<v.length;b+=1){const z=Nt(m,v,b);y[b]?y[b].p(z,w):(y[b]=Pt(z),y[b].c(),y[b].m(f,_))}for(;b<y.length;b+=1)y[b].d(1);y.length=v.length}},i(m){Z(p)},o(m){ct(p)},d(m){m&&$(e),p.d(m),ie(y,m)}}}function Ne(t,e,n){let r,{source:i}=e,s="connecting...",o="44.50";const c=()=>{n(2,s="connected")},u=()=>{n(2,s="disconnected")},l=_=>{const h=_.data;n(1,o=h.toFixed(2).padStart(5,"0"))};_e(()=>{Xt(i,l,c,u)});function d(_,{delay:h=0}){return{duration:500,delay:h,css:g=>`
        transform: perspective(400px) rotateX(${(1-St(g))*90}deg);
        z-index: 100;
        transform-origin: bottom;
        filter: blur(${g*1}px);
        `}}function a(_,{delay:h=0}){return{duration:500,delay:500+h,css:g=>`
        transform: perspective(400px) rotateX(${(1-St(g))*90}deg);
        transform-origin: top;
        `}}let f=Se(Number(o),{duration:1e3,easing:Wt});return Kt(t,f,_=>n(3,r=_)),t.$$set=_=>{"source"in _&&n(0,i=_.source)},t.$$.update=()=>{t.$$.dirty&2&&f.update(_=>Number(o))},[i,o,s,r,d,a,f]}class Ae extends we{constructor(e){super(),$e(this,e,Ne,Oe,nt,{source:0})}}export{Ae as default};