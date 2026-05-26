import{R as He,r as fe,j as c,H as Ha,L as E}from"./app-DEu8oim2.js";/* empty css                *//* empty css            */import{A as Ga}from"./ApplicationLogo-BI4Vzo62.js";import{F as Ba}from"./Footer-Dp86-pf8.js";function Fe(e,t){(t==null||t>e.length)&&(t=e.length);for(var a=0,n=Array(t);a<t;a++)n[a]=e[a];return n}function Xa(e){if(Array.isArray(e))return e}function Va(e){if(Array.isArray(e))return Fe(e)}function Ja(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function Ka(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,Mt(n.key),n)}}function qa(e,t,a){return t&&Ka(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function ue(e,t){var a=typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=Ge(e))||t){a&&(e=a);var n=0,r=function(){};return{s:r,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(l){throw l},f:r}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var i,s=!0,o=!1;return{s:function(){a=a.call(e)},n:function(){var l=a.next();return s=l.done,l},e:function(l){o=!0,i=l},f:function(){try{s||a.return==null||a.return()}finally{if(o)throw i}}}}function g(e,t,a){return(t=Mt(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function Qa(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function Za(e,t){var a=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(a!=null){var n,r,i,s,o=[],l=!0,u=!1;try{if(i=(a=a.call(e)).next,t===0){if(Object(a)!==a)return;l=!1}else for(;!(l=(n=i.call(a)).done)&&(o.push(n.value),o.length!==t);l=!0);}catch(m){u=!0,r=m}finally{try{if(!l&&a.return!=null&&(s=a.return(),Object(s)!==s))return}finally{if(u)throw r}}return o}}function en(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function tn(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function nt(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),a.push.apply(a,n)}return a}function f(e){for(var t=1;t<arguments.length;t++){var a=arguments[t]!=null?arguments[t]:{};t%2?nt(Object(a),!0).forEach(function(n){g(e,n,a[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):nt(Object(a)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))})}return e}function pe(e,t){return Xa(e)||Za(e,t)||Ge(e,t)||en()}function N(e){return Va(e)||Qa(e)||Ge(e)||tn()}function an(e,t){if(typeof e!="object"||!e)return e;var a=e[Symbol.toPrimitive];if(a!==void 0){var n=a.call(e,t);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Mt(e){var t=an(e,"string");return typeof t=="symbol"?t:t+""}function me(e){"@babel/helpers - typeof";return me=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},me(e)}function Ge(e,t){if(e){if(typeof e=="string")return Fe(e,t);var a={}.toString.call(e).slice(8,-1);return a==="Object"&&e.constructor&&(a=e.constructor.name),a==="Map"||a==="Set"?Array.from(e):a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?Fe(e,t):void 0}}var rt=function(){},Be={},$t={},Rt=null,Dt={mark:rt,measure:rt};try{typeof window<"u"&&(Be=window),typeof document<"u"&&($t=document),typeof MutationObserver<"u"&&(Rt=MutationObserver),typeof performance<"u"&&(Dt=performance)}catch{}var nn=Be.navigator||{},it=nn.userAgent,st=it===void 0?"":it,R=Be,w=$t,ot=Rt,oe=Dt;R.document;var $=!!w.documentElement&&!!w.head&&typeof w.addEventListener=="function"&&typeof w.createElement=="function",zt=~st.indexOf("MSIE")||~st.indexOf("Trident/"),Se,rn=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,sn=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,Wt={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},graphite:{"fa-thin":"thin",fagt:"thin"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},on={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},Ut=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],j="classic",ne="duotone",Yt="sharp",Ht="sharp-duotone",Gt="chisel",Bt="etch",Xt="graphite",Vt="jelly",Jt="jelly-duo",Kt="jelly-fill",qt="notdog",Qt="notdog-duo",Zt="slab",ea="slab-press",ta="thumbprint",aa="utility",na="utility-duo",ra="utility-fill",ia="whiteboard",ln="Classic",fn="Duotone",un="Sharp",cn="Sharp Duotone",dn="Chisel",mn="Etch",hn="Graphite",vn="Jelly",pn="Jelly Duo",gn="Jelly Fill",bn="Notdog",yn="Notdog Duo",xn="Slab",wn="Slab Press",Sn="Thumbprint",An="Utility",kn="Utility Duo",In="Utility Fill",jn="Whiteboard",sa=[j,ne,Yt,Ht,Gt,Bt,Xt,Vt,Jt,Kt,qt,Qt,Zt,ea,ta,aa,na,ra,ia];Se={},g(g(g(g(g(g(g(g(g(g(Se,j,ln),ne,fn),Yt,un),Ht,cn),Gt,dn),Bt,mn),Xt,hn),Vt,vn),Jt,pn),Kt,gn),g(g(g(g(g(g(g(g(g(Se,qt,bn),Qt,yn),Zt,xn),ea,wn),ta,Sn),aa,An),na,kn),ra,In),ia,jn);var Pn={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},graphite:{100:"fagt"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},En={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Graphite":{100:"fagt",normal:"fagt"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},Fn=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["graphite",{defaultShortPrefixId:"fagt",defaultStyleId:"thin",styleIds:["thin"],futureStyleIds:[],defaultFontWeight:100}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),Nn={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},graphite:{thin:"fagt"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-press":{regular:"faslpr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},whiteboard:{semibold:"fawsb"}},oa=["fak","fa-kit","fakd","fa-kit-duotone"],lt={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},Cn=["kit"],On="kit",Tn="kit-duotone",_n="Kit",Ln="Kit Duotone";g(g({},On,_n),Tn,Ln);var Mn={kit:{"fa-kit":"fak"}},$n={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},Rn={kit:{fak:"fa-kit"}},ft={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},Ae,le={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},Dn=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],zn="classic",Wn="duotone",Un="sharp",Yn="sharp-duotone",Hn="chisel",Gn="etch",Bn="graphite",Xn="jelly",Vn="jelly-duo",Jn="jelly-fill",Kn="notdog",qn="notdog-duo",Qn="slab",Zn="slab-press",er="thumbprint",tr="utility",ar="utility-duo",nr="utility-fill",rr="whiteboard",ir="Classic",sr="Duotone",or="Sharp",lr="Sharp Duotone",fr="Chisel",ur="Etch",cr="Graphite",dr="Jelly",mr="Jelly Duo",hr="Jelly Fill",vr="Notdog",pr="Notdog Duo",gr="Slab",br="Slab Press",yr="Thumbprint",xr="Utility",wr="Utility Duo",Sr="Utility Fill",Ar="Whiteboard";Ae={},g(g(g(g(g(g(g(g(g(g(Ae,zn,ir),Wn,sr),Un,or),Yn,lr),Hn,fr),Gn,ur),Bn,cr),Xn,dr),Vn,mr),Jn,hr),g(g(g(g(g(g(g(g(g(Ae,Kn,vr),qn,pr),Qn,gr),Zn,br),er,yr),tr,xr),ar,wr),nr,Sr),rr,Ar);var kr="kit",Ir="kit-duotone",jr="Kit",Pr="Kit Duotone";g(g({},kr,jr),Ir,Pr);var Er={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},graphite:{"fa-thin":"fagt"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},Fr={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],graphite:["fagt"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},Ne={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},graphite:{fagt:"fa-thin"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},Nr=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],la=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fawsb","fatl","fans","fands","faes","fagt","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(Dn,Nr),Cr=["solid","regular","light","thin","duotone","brands","semibold"],fa=[1,2,3,4,5,6,7,8,9,10],Or=fa.concat([11,12,13,14,15,16,17,18,19,20]),Tr=["aw","fw","pull-left","pull-right"],_r=[].concat(N(Object.keys(Fr)),Cr,Tr,["2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","inverse","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul","width-auto","width-fixed",le.GROUP,le.SWAP_OPACITY,le.PRIMARY,le.SECONDARY]).concat(fa.map(function(e){return"".concat(e,"x")})).concat(Or.map(function(e){return"w-".concat(e)})),Lr={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},L="___FONT_AWESOME___",Ce=16,ua="fa",ca="svg-inline--fa",U="data-fa-i2svg",Oe="data-fa-pseudo-element",Mr="data-fa-pseudo-element-pending",Xe="data-prefix",Ve="data-icon",ut="fontawesome-i2svg",$r="async",Rr=["HTML","HEAD","STYLE","SCRIPT"],da=["::before","::after",":before",":after"],ma=(function(){try{return!0}catch{return!1}})();function re(e){return new Proxy(e,{get:function(a,n){return n in a?a[n]:a[j]}})}var ha=f({},Wt);ha[j]=f(f(f(f({},{"fa-duotone":"duotone"}),Wt[j]),lt.kit),lt["kit-duotone"]);var Dr=re(ha),Te=f({},Nn);Te[j]=f(f(f(f({},{duotone:"fad"}),Te[j]),ft.kit),ft["kit-duotone"]);var ct=re(Te),_e=f({},Ne);_e[j]=f(f({},_e[j]),Rn.kit);var Je=re(_e),Le=f({},Er);Le[j]=f(f({},Le[j]),Mn.kit);re(Le);var zr=rn,va="fa-layers-text",Wr=sn,Ur=f({},Pn);re(Ur);var Yr=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],ke=on,Hr=[].concat(N(Cn),N(_r)),Z=R.FontAwesomeConfig||{};function Gr(e){var t=w.querySelector("script["+e+"]");if(t)return t.getAttribute(e)}function Br(e){return e===""?!0:e==="false"?!1:e==="true"?!0:e}if(w&&typeof w.querySelector=="function"){var Xr=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];Xr.forEach(function(e){var t=pe(e,2),a=t[0],n=t[1],r=Br(Gr(a));r!=null&&(Z[n]=r)})}var pa={styleDefault:"solid",familyDefault:j,cssPrefix:ua,replacementClass:ca,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};Z.familyPrefix&&(Z.cssPrefix=Z.familyPrefix);var V=f(f({},pa),Z);V.autoReplaceSvg||(V.observeMutations=!1);var h={};Object.keys(pa).forEach(function(e){Object.defineProperty(h,e,{enumerable:!0,set:function(a){V[e]=a,ee.forEach(function(n){return n(h)})},get:function(){return V[e]}})});Object.defineProperty(h,"familyPrefix",{enumerable:!0,set:function(t){V.cssPrefix=t,ee.forEach(function(a){return a(h)})},get:function(){return V.cssPrefix}});R.FontAwesomeConfig=h;var ee=[];function Vr(e){return ee.push(e),function(){ee.splice(ee.indexOf(e),1)}}var H=Ce,C={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Jr(e){if(!(!e||!$)){var t=w.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=e;for(var a=w.head.childNodes,n=null,r=a.length-1;r>-1;r--){var i=a[r],s=(i.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(s)>-1&&(n=i)}return w.head.insertBefore(t,n),e}}var Kr="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function dt(){for(var e=12,t="";e-- >0;)t+=Kr[Math.random()*62|0];return t}function K(e){for(var t=[],a=(e||[]).length>>>0;a--;)t[a]=e[a];return t}function Ke(e){return e.classList?K(e.classList):(e.getAttribute("class")||"").split(" ").filter(function(t){return t})}function ga(e){return"".concat(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function qr(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,'="').concat(ga(e[a]),'" ')},"").trim()}function ge(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,": ").concat(e[a].trim(),";")},"")}function qe(e){return e.size!==C.size||e.x!==C.x||e.y!==C.y||e.rotate!==C.rotate||e.flipX||e.flipY}function Qr(e){var t=e.transform,a=e.containerWidth,n=e.iconWidth,r={transform:"translate(".concat(a/2," 256)")},i="translate(".concat(t.x*32,", ").concat(t.y*32,") "),s="scale(".concat(t.size/16*(t.flipX?-1:1),", ").concat(t.size/16*(t.flipY?-1:1),") "),o="rotate(".concat(t.rotate," 0 0)"),l={transform:"".concat(i," ").concat(s," ").concat(o)},u={transform:"translate(".concat(n/2*-1," -256)")};return{outer:r,inner:l,path:u}}function Zr(e){var t=e.transform,a=e.width,n=a===void 0?Ce:a,r=e.height,i=r===void 0?Ce:r,s="";return zt?s+="translate(".concat(t.x/H-n/2,"em, ").concat(t.y/H-i/2,"em) "):s+="translate(calc(-50% + ".concat(t.x/H,"em), calc(-50% + ").concat(t.y/H,"em)) "),s+="scale(".concat(t.size/H*(t.flipX?-1:1),", ").concat(t.size/H*(t.flipY?-1:1),") "),s+="rotate(".concat(t.rotate,"deg) "),s}var ei=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function ba(){var e=ua,t=ca,a=h.cssPrefix,n=h.replacementClass,r=ei;if(a!==e||n!==t){var i=new RegExp("\\.".concat(e,"\\-"),"g"),s=new RegExp("\\--".concat(e,"\\-"),"g"),o=new RegExp("\\.".concat(t),"g");r=r.replace(i,".".concat(a,"-")).replace(s,"--".concat(a,"-")).replace(o,".".concat(n))}return r}var mt=!1;function Ie(){h.autoAddCss&&!mt&&(Jr(ba()),mt=!0)}var ti={mixout:function(){return{dom:{css:ba,insertCss:Ie}}},hooks:function(){return{beforeDOMElementCreation:function(){Ie()},beforeI2svg:function(){Ie()}}}},M=R||{};M[L]||(M[L]={});M[L].styles||(M[L].styles={});M[L].hooks||(M[L].hooks={});M[L].shims||(M[L].shims=[]);var F=M[L],ya=[],xa=function(){w.removeEventListener("DOMContentLoaded",xa),he=1,ya.map(function(t){return t()})},he=!1;$&&(he=(w.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(w.readyState),he||w.addEventListener("DOMContentLoaded",xa));function ai(e){$&&(he?setTimeout(e,0):ya.push(e))}function ie(e){var t=e.tag,a=e.attributes,n=a===void 0?{}:a,r=e.children,i=r===void 0?[]:r;return typeof e=="string"?ga(e):"<".concat(t," ").concat(qr(n),">").concat(i.map(ie).join(""),"</").concat(t,">")}function ht(e,t,a){if(e&&e[t]&&e[t][a])return{prefix:t,iconName:a,icon:e[t][a]}}var je=function(t,a,n,r){var i=Object.keys(t),s=i.length,o=a,l,u,m;for(n===void 0?(l=1,m=t[i[0]]):(l=0,m=n);l<s;l++)u=i[l],m=o(m,t[u],u,t);return m};function wa(e){return N(e).length!==1?null:e.codePointAt(0).toString(16)}function vt(e){return Object.keys(e).reduce(function(t,a){var n=e[a],r=!!n.icon;return r?t[n.iconName]=n.icon:t[a]=n,t},{})}function Me(e,t){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},n=a.skipHooks,r=n===void 0?!1:n,i=vt(t);typeof F.hooks.addPack=="function"&&!r?F.hooks.addPack(e,vt(t)):F.styles[e]=f(f({},F.styles[e]||{}),i),e==="fas"&&Me("fa",t)}var ae=F.styles,ni=F.shims,Sa=Object.keys(Je),ri=Sa.reduce(function(e,t){return e[t]=Object.keys(Je[t]),e},{}),Qe=null,Aa={},ka={},Ia={},ja={},Pa={};function ii(e){return~Hr.indexOf(e)}function si(e,t){var a=t.split("-"),n=a[0],r=a.slice(1).join("-");return n===e&&r!==""&&!ii(r)?r:null}var Ea=function(){var t=function(i){return je(ae,function(s,o,l){return s[l]=je(o,i,{}),s},{})};Aa=t(function(r,i,s){if(i[3]&&(r[i[3]]=s),i[2]){var o=i[2].filter(function(l){return typeof l=="number"});o.forEach(function(l){r[l.toString(16)]=s})}return r}),ka=t(function(r,i,s){if(r[s]=s,i[2]){var o=i[2].filter(function(l){return typeof l=="string"});o.forEach(function(l){r[l]=s})}return r}),Pa=t(function(r,i,s){var o=i[2];return r[s]=s,o.forEach(function(l){r[l]=s}),r});var a="far"in ae||h.autoFetchSvg,n=je(ni,function(r,i){var s=i[0],o=i[1],l=i[2];return o==="far"&&!a&&(o="fas"),typeof s=="string"&&(r.names[s]={prefix:o,iconName:l}),typeof s=="number"&&(r.unicodes[s.toString(16)]={prefix:o,iconName:l}),r},{names:{},unicodes:{}});Ia=n.names,ja=n.unicodes,Qe=be(h.styleDefault,{family:h.familyDefault})};Vr(function(e){Qe=be(e.styleDefault,{family:h.familyDefault})});Ea();function Ze(e,t){return(Aa[e]||{})[t]}function oi(e,t){return(ka[e]||{})[t]}function W(e,t){return(Pa[e]||{})[t]}function Fa(e){return Ia[e]||{prefix:null,iconName:null}}function li(e){var t=ja[e],a=Ze("fas",e);return t||(a?{prefix:"fas",iconName:a}:null)||{prefix:null,iconName:null}}function D(){return Qe}var Na=function(){return{prefix:null,iconName:null,rest:[]}};function fi(e){var t=j,a=Sa.reduce(function(n,r){return n[r]="".concat(h.cssPrefix,"-").concat(r),n},{});return sa.forEach(function(n){(e.includes(a[n])||e.some(function(r){return ri[n].includes(r)}))&&(t=n)}),t}function be(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.family,n=a===void 0?j:a,r=Dr[n][e];if(n===ne&&!e)return"fad";var i=ct[n][e]||ct[n][r],s=e in F.styles?e:null,o=i||s||null;return o}function ui(e){var t=[],a=null;return e.forEach(function(n){var r=si(h.cssPrefix,n);r?a=r:n&&t.push(n)}),{iconName:a,rest:t}}function pt(e){return e.sort().filter(function(t,a,n){return n.indexOf(t)===a})}var gt=la.concat(oa);function ye(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.skipLookups,n=a===void 0?!1:a,r=null,i=pt(e.filter(function(p){return gt.includes(p)})),s=pt(e.filter(function(p){return!gt.includes(p)})),o=i.filter(function(p){return r=p,!Ut.includes(p)}),l=pe(o,1),u=l[0],m=u===void 0?null:u,d=fi(i),v=f(f({},ui(s)),{},{prefix:be(m,{family:d})});return f(f(f({},v),hi({values:e,family:d,styles:ae,config:h,canonical:v,givenPrefix:r})),ci(n,r,v))}function ci(e,t,a){var n=a.prefix,r=a.iconName;if(e||!n||!r)return{prefix:n,iconName:r};var i=t==="fa"?Fa(r):{},s=W(n,r);return r=i.iconName||s||r,n=i.prefix||n,n==="far"&&!ae.far&&ae.fas&&!h.autoFetchSvg&&(n="fas"),{prefix:n,iconName:r}}var di=sa.filter(function(e){return e!==j||e!==ne}),mi=Object.keys(Ne).filter(function(e){return e!==j}).map(function(e){return Object.keys(Ne[e])}).flat();function hi(e){var t=e.values,a=e.family,n=e.canonical,r=e.givenPrefix,i=r===void 0?"":r,s=e.styles,o=s===void 0?{}:s,l=e.config,u=l===void 0?{}:l,m=a===ne,d=t.includes("fa-duotone")||t.includes("fad"),v=u.familyDefault==="duotone",p=n.prefix==="fad"||n.prefix==="fa-duotone";if(!m&&(d||v||p)&&(n.prefix="fad"),(t.includes("fa-brands")||t.includes("fab"))&&(n.prefix="fab"),!n.prefix&&di.includes(a)){var x=Object.keys(o).find(function(S){return mi.includes(S)});if(x||u.autoFetchSvg){var y=Fn.get(a).defaultShortPrefixId;n.prefix=y,n.iconName=W(n.prefix,n.iconName)||n.iconName}}return(n.prefix==="fa"||i==="fa")&&(n.prefix=D()||"fas"),n}var vi=(function(){function e(){Ja(this,e),this.definitions={}}return qa(e,[{key:"add",value:function(){for(var a=this,n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];var s=r.reduce(this._pullDefinitions,{});Object.keys(s).forEach(function(o){a.definitions[o]=f(f({},a.definitions[o]||{}),s[o]),Me(o,s[o]);var l=Je[j][o];l&&Me(l,s[o]),Ea()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(a,n){var r=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(r).map(function(i){var s=r[i],o=s.prefix,l=s.iconName,u=s.icon,m=u[2];a[o]||(a[o]={}),m.length>0&&m.forEach(function(d){typeof d=="string"&&(a[o][d]=u)}),a[o][l]=u}),a}}])})(),bt=[],B={},X={},pi=Object.keys(X);function gi(e,t){var a=t.mixoutsTo;return bt=e,B={},Object.keys(X).forEach(function(n){pi.indexOf(n)===-1&&delete X[n]}),bt.forEach(function(n){var r=n.mixout?n.mixout():{};if(Object.keys(r).forEach(function(s){typeof r[s]=="function"&&(a[s]=r[s]),me(r[s])==="object"&&Object.keys(r[s]).forEach(function(o){a[s]||(a[s]={}),a[s][o]=r[s][o]})}),n.hooks){var i=n.hooks();Object.keys(i).forEach(function(s){B[s]||(B[s]=[]),B[s].push(i[s])})}n.provides&&n.provides(X)}),a}function $e(e,t){for(var a=arguments.length,n=new Array(a>2?a-2:0),r=2;r<a;r++)n[r-2]=arguments[r];var i=B[e]||[];return i.forEach(function(s){t=s.apply(null,[t].concat(n))}),t}function Y(e){for(var t=arguments.length,a=new Array(t>1?t-1:0),n=1;n<t;n++)a[n-1]=arguments[n];var r=B[e]||[];r.forEach(function(i){i.apply(null,a)})}function z(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return X[e]?X[e].apply(null,t):void 0}function Re(e){e.prefix==="fa"&&(e.prefix="fas");var t=e.iconName,a=e.prefix||D();if(t)return t=W(a,t)||t,ht(Ca.definitions,a,t)||ht(F.styles,a,t)}var Ca=new vi,bi=function(){h.autoReplaceSvg=!1,h.observeMutations=!1,Y("noAuto")},yi={i2svg:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return $?(Y("beforeI2svg",t),z("pseudoElements2svg",t),z("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot;h.autoReplaceSvg===!1&&(h.autoReplaceSvg=!0),h.observeMutations=!0,ai(function(){wi({autoReplaceSvgRoot:a}),Y("watch",t)})}},xi={icon:function(t){if(t===null)return null;if(me(t)==="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:W(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){var a=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=be(t[0]);return{prefix:n,iconName:W(n,a)||a}}if(typeof t=="string"&&(t.indexOf("".concat(h.cssPrefix,"-"))>-1||t.match(zr))){var r=ye(t.split(" "),{skipLookups:!0});return{prefix:r.prefix||D(),iconName:W(r.prefix,r.iconName)||r.iconName}}if(typeof t=="string"){var i=D();return{prefix:i,iconName:W(i,t)||t}}}},P={noAuto:bi,config:h,dom:yi,parse:xi,library:Ca,findIconDefinition:Re,toHtml:ie},wi=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot,n=a===void 0?w:a;(Object.keys(F.styles).length>0||h.autoFetchSvg)&&$&&h.autoReplaceSvg&&P.dom.i2svg({node:n})};function xe(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(n){return ie(n)})}}),Object.defineProperty(e,"node",{get:function(){if($){var n=w.createElement("div");return n.innerHTML=e.html,n.children}}}),e}function Si(e){var t=e.children,a=e.main,n=e.mask,r=e.attributes,i=e.styles,s=e.transform;if(qe(s)&&a.found&&!n.found){var o=a.width,l=a.height,u={x:o/l/2,y:.5};r.style=ge(f(f({},i),{},{"transform-origin":"".concat(u.x+s.x/16,"em ").concat(u.y+s.y/16,"em")}))}return[{tag:"svg",attributes:r,children:t}]}function Ai(e){var t=e.prefix,a=e.iconName,n=e.children,r=e.attributes,i=e.symbol,s=i===!0?"".concat(t,"-").concat(h.cssPrefix,"-").concat(a):i;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:f(f({},r),{},{id:s}),children:n}]}]}function ki(e){var t=["aria-label","aria-labelledby","title","role"];return t.some(function(a){return a in e})}function et(e){var t=e.icons,a=t.main,n=t.mask,r=e.prefix,i=e.iconName,s=e.transform,o=e.symbol,l=e.maskId,u=e.extra,m=e.watchable,d=m===void 0?!1:m,v=n.found?n:a,p=v.width,x=v.height,y=[h.replacementClass,i?"".concat(h.cssPrefix,"-").concat(i):""].filter(function(b){return u.classes.indexOf(b)===-1}).filter(function(b){return b!==""||!!b}).concat(u.classes).join(" "),S={children:[],attributes:f(f({},u.attributes),{},{"data-prefix":r,"data-icon":i,class:y,role:u.attributes.role||"img",viewBox:"0 0 ".concat(p," ").concat(x)})};!ki(u.attributes)&&!u.attributes["aria-hidden"]&&(S.attributes["aria-hidden"]="true"),d&&(S.attributes[U]="");var A=f(f({},S),{},{prefix:r,iconName:i,main:a,mask:n,maskId:l,transform:s,symbol:o,styles:f({},u.styles)}),k=n.found&&a.found?z("generateAbstractMask",A)||{children:[],attributes:{}}:z("generateAbstractIcon",A)||{children:[],attributes:{}},I=k.children,O=k.attributes;return A.children=I,A.attributes=O,o?Ai(A):Si(A)}function yt(e){var t=e.content,a=e.width,n=e.height,r=e.transform,i=e.extra,s=e.watchable,o=s===void 0?!1:s,l=f(f({},i.attributes),{},{class:i.classes.join(" ")});o&&(l[U]="");var u=f({},i.styles);qe(r)&&(u.transform=Zr({transform:r,width:a,height:n}),u["-webkit-transform"]=u.transform);var m=ge(u);m.length>0&&(l.style=m);var d=[];return d.push({tag:"span",attributes:l,children:[t]}),d}function Ii(e){var t=e.content,a=e.extra,n=f(f({},a.attributes),{},{class:a.classes.join(" ")}),r=ge(a.styles);r.length>0&&(n.style=r);var i=[];return i.push({tag:"span",attributes:n,children:[t]}),i}var Pe=F.styles;function De(e){var t=e[0],a=e[1],n=e.slice(4),r=pe(n,1),i=r[0],s=null;return Array.isArray(i)?s={tag:"g",attributes:{class:"".concat(h.cssPrefix,"-").concat(ke.GROUP)},children:[{tag:"path",attributes:{class:"".concat(h.cssPrefix,"-").concat(ke.SECONDARY),fill:"currentColor",d:i[0]}},{tag:"path",attributes:{class:"".concat(h.cssPrefix,"-").concat(ke.PRIMARY),fill:"currentColor",d:i[1]}}]}:s={tag:"path",attributes:{fill:"currentColor",d:i}},{found:!0,width:t,height:a,icon:s}}var ji={found:!1,width:512,height:512};function Pi(e,t){!ma&&!h.showMissingIcons&&e&&console.error('Icon with name "'.concat(e,'" and prefix "').concat(t,'" is missing.'))}function ze(e,t){var a=t;return t==="fa"&&h.styleDefault!==null&&(t=D()),new Promise(function(n,r){if(a==="fa"){var i=Fa(e)||{};e=i.iconName||e,t=i.prefix||t}if(e&&t&&Pe[t]&&Pe[t][e]){var s=Pe[t][e];return n(De(s))}Pi(e,t),n(f(f({},ji),{},{icon:h.showMissingIcons&&e?z("missingIconAbstract")||{}:{}}))})}var xt=function(){},We=h.measurePerformance&&oe&&oe.mark&&oe.measure?oe:{mark:xt,measure:xt},q='FA "7.2.0"',Ei=function(t){return We.mark("".concat(q," ").concat(t," begins")),function(){return Oa(t)}},Oa=function(t){We.mark("".concat(q," ").concat(t," ends")),We.measure("".concat(q," ").concat(t),"".concat(q," ").concat(t," begins"),"".concat(q," ").concat(t," ends"))},tt={begin:Ei,end:Oa},ce=function(){};function wt(e){var t=e.getAttribute?e.getAttribute(U):null;return typeof t=="string"}function Fi(e){var t=e.getAttribute?e.getAttribute(Xe):null,a=e.getAttribute?e.getAttribute(Ve):null;return t&&a}function Ni(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(h.replacementClass)}function Ci(){if(h.autoReplaceSvg===!0)return de.replace;var e=de[h.autoReplaceSvg];return e||de.replace}function Oi(e){return w.createElementNS("http://www.w3.org/2000/svg",e)}function Ti(e){return w.createElement(e)}function Ta(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.ceFn,n=a===void 0?e.tag==="svg"?Oi:Ti:a;if(typeof e=="string")return w.createTextNode(e);var r=n(e.tag);Object.keys(e.attributes||[]).forEach(function(s){r.setAttribute(s,e.attributes[s])});var i=e.children||[];return i.forEach(function(s){r.appendChild(Ta(s,{ceFn:n}))}),r}function _i(e){var t=" ".concat(e.outerHTML," ");return t="".concat(t,"Font Awesome fontawesome.com "),t}var de={replace:function(t){var a=t[0];if(a.parentNode)if(t[1].forEach(function(r){a.parentNode.insertBefore(Ta(r),a)}),a.getAttribute(U)===null&&h.keepOriginalSource){var n=w.createComment(_i(a));a.parentNode.replaceChild(n,a)}else a.remove()},nest:function(t){var a=t[0],n=t[1];if(~Ke(a).indexOf(h.replacementClass))return de.replace(t);var r=new RegExp("".concat(h.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){var i=n[0].attributes.class.split(" ").reduce(function(o,l){return l===h.replacementClass||l.match(r)?o.toSvg.push(l):o.toNode.push(l),o},{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(" "),i.toNode.length===0?a.removeAttribute("class"):a.setAttribute("class",i.toNode.join(" "))}var s=n.map(function(o){return ie(o)}).join(`
`);a.setAttribute(U,""),a.innerHTML=s}};function St(e){e()}function _a(e,t){var a=typeof t=="function"?t:ce;if(e.length===0)a();else{var n=St;h.mutateApproach===$r&&(n=R.requestAnimationFrame||St),n(function(){var r=Ci(),i=tt.begin("mutate");e.map(r),i(),a()})}}var at=!1;function La(){at=!0}function Ue(){at=!1}var ve=null;function At(e){if(ot&&h.observeMutations){var t=e.treeCallback,a=t===void 0?ce:t,n=e.nodeCallback,r=n===void 0?ce:n,i=e.pseudoElementsCallback,s=i===void 0?ce:i,o=e.observeMutationsRoot,l=o===void 0?w:o;ve=new ot(function(u){if(!at){var m=D();K(u).forEach(function(d){if(d.type==="childList"&&d.addedNodes.length>0&&!wt(d.addedNodes[0])&&(h.searchPseudoElements&&s(d.target),a(d.target)),d.type==="attributes"&&d.target.parentNode&&h.searchPseudoElements&&s([d.target],!0),d.type==="attributes"&&wt(d.target)&&~Yr.indexOf(d.attributeName))if(d.attributeName==="class"&&Fi(d.target)){var v=ye(Ke(d.target)),p=v.prefix,x=v.iconName;d.target.setAttribute(Xe,p||m),x&&d.target.setAttribute(Ve,x)}else Ni(d.target)&&r(d.target)})}}),$&&ve.observe(l,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function Li(){ve&&ve.disconnect()}function Mi(e){var t=e.getAttribute("style"),a=[];return t&&(a=t.split(";").reduce(function(n,r){var i=r.split(":"),s=i[0],o=i.slice(1);return s&&o.length>0&&(n[s]=o.join(":").trim()),n},{})),a}function $i(e){var t=e.getAttribute("data-prefix"),a=e.getAttribute("data-icon"),n=e.innerText!==void 0?e.innerText.trim():"",r=ye(Ke(e));return r.prefix||(r.prefix=D()),t&&a&&(r.prefix=t,r.iconName=a),r.iconName&&r.prefix||(r.prefix&&n.length>0&&(r.iconName=oi(r.prefix,e.innerText)||Ze(r.prefix,wa(e.innerText))),!r.iconName&&h.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=e.firstChild.data)),r}function Ri(e){var t=K(e.attributes).reduce(function(a,n){return a.name!=="class"&&a.name!=="style"&&(a[n.name]=n.value),a},{});return t}function Di(){return{iconName:null,prefix:null,transform:C,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function kt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},a=$i(e),n=a.iconName,r=a.prefix,i=a.rest,s=Ri(e),o=$e("parseNodeAttributes",{},e),l=t.styleParser?Mi(e):[];return f({iconName:n,prefix:r,transform:C,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:i,styles:l,attributes:s}},o)}var zi=F.styles;function Ma(e){var t=h.autoReplaceSvg==="nest"?kt(e,{styleParser:!1}):kt(e);return~t.extra.classes.indexOf(va)?z("generateLayersText",e,t):z("generateSvgReplacementMutation",e,t)}function Wi(){return[].concat(N(oa),N(la))}function It(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!$)return Promise.resolve();var a=w.documentElement.classList,n=function(d){return a.add("".concat(ut,"-").concat(d))},r=function(d){return a.remove("".concat(ut,"-").concat(d))},i=h.autoFetchSvg?Wi():Ut.concat(Object.keys(zi));i.includes("fa")||i.push("fa");var s=[".".concat(va,":not([").concat(U,"])")].concat(i.map(function(m){return".".concat(m,":not([").concat(U,"])")})).join(", ");if(s.length===0)return Promise.resolve();var o=[];try{o=K(e.querySelectorAll(s))}catch{}if(o.length>0)n("pending"),r("complete");else return Promise.resolve();var l=tt.begin("onTree"),u=o.reduce(function(m,d){try{var v=Ma(d);v&&m.push(v)}catch(p){ma||p.name==="MissingIcon"&&console.error(p)}return m},[]);return new Promise(function(m,d){Promise.all(u).then(function(v){_a(v,function(){n("active"),n("complete"),r("pending"),typeof t=="function"&&t(),l(),m()})}).catch(function(v){l(),d(v)})})}function Ui(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Ma(e).then(function(a){a&&_a([a],t)})}function Yi(e){return function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=(t||{}).icon?t:Re(t||{}),r=a.mask;return r&&(r=(r||{}).icon?r:Re(r||{})),e(n,f(f({},a),{},{mask:r}))}}var Hi=function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=a.transform,r=n===void 0?C:n,i=a.symbol,s=i===void 0?!1:i,o=a.mask,l=o===void 0?null:o,u=a.maskId,m=u===void 0?null:u,d=a.classes,v=d===void 0?[]:d,p=a.attributes,x=p===void 0?{}:p,y=a.styles,S=y===void 0?{}:y;if(t){var A=t.prefix,k=t.iconName,I=t.icon;return xe(f({type:"icon"},t),function(){return Y("beforeDOMElementCreation",{iconDefinition:t,params:a}),et({icons:{main:De(I),mask:l?De(l.icon):{found:!1,width:null,height:null,icon:{}}},prefix:A,iconName:k,transform:f(f({},C),r),symbol:s,maskId:m,extra:{attributes:x,styles:S,classes:v}})})}},Gi={mixout:function(){return{icon:Yi(Hi)}},hooks:function(){return{mutationObserverCallbacks:function(a){return a.treeCallback=It,a.nodeCallback=Ui,a}}},provides:function(t){t.i2svg=function(a){var n=a.node,r=n===void 0?w:n,i=a.callback,s=i===void 0?function(){}:i;return It(r,s)},t.generateSvgReplacementMutation=function(a,n){var r=n.iconName,i=n.prefix,s=n.transform,o=n.symbol,l=n.mask,u=n.maskId,m=n.extra;return new Promise(function(d,v){Promise.all([ze(r,i),l.iconName?ze(l.iconName,l.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(p){var x=pe(p,2),y=x[0],S=x[1];d([a,et({icons:{main:y,mask:S},prefix:i,iconName:r,transform:s,symbol:o,maskId:u,extra:m,watchable:!0})])}).catch(v)})},t.generateAbstractIcon=function(a){var n=a.children,r=a.attributes,i=a.main,s=a.transform,o=a.styles,l=ge(o);l.length>0&&(r.style=l);var u;return qe(s)&&(u=z("generateAbstractTransformGrouping",{main:i,transform:s,containerWidth:i.width,iconWidth:i.width})),n.push(u||i.icon),{children:n,attributes:r}}}},Bi={mixout:function(){return{layer:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.classes,i=r===void 0?[]:r;return xe({type:"layer"},function(){Y("beforeDOMElementCreation",{assembler:a,params:n});var s=[];return a(function(o){Array.isArray(o)?o.map(function(l){s=s.concat(l.abstract)}):s=s.concat(o.abstract)}),[{tag:"span",attributes:{class:["".concat(h.cssPrefix,"-layers")].concat(N(i)).join(" ")},children:s}]})}}}},Xi={mixout:function(){return{counter:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};n.title;var r=n.classes,i=r===void 0?[]:r,s=n.attributes,o=s===void 0?{}:s,l=n.styles,u=l===void 0?{}:l;return xe({type:"counter",content:a},function(){return Y("beforeDOMElementCreation",{content:a,params:n}),Ii({content:a.toString(),extra:{attributes:o,styles:u,classes:["".concat(h.cssPrefix,"-layers-counter")].concat(N(i))}})})}}}},Vi={mixout:function(){return{text:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.transform,i=r===void 0?C:r,s=n.classes,o=s===void 0?[]:s,l=n.attributes,u=l===void 0?{}:l,m=n.styles,d=m===void 0?{}:m;return xe({type:"text",content:a},function(){return Y("beforeDOMElementCreation",{content:a,params:n}),yt({content:a,transform:f(f({},C),i),extra:{attributes:u,styles:d,classes:["".concat(h.cssPrefix,"-layers-text")].concat(N(o))}})})}}},provides:function(t){t.generateLayersText=function(a,n){var r=n.transform,i=n.extra,s=null,o=null;if(zt){var l=parseInt(getComputedStyle(a).fontSize,10),u=a.getBoundingClientRect();s=u.width/l,o=u.height/l}return Promise.resolve([a,yt({content:a.innerHTML,width:s,height:o,transform:r,extra:i,watchable:!0})])}}},$a=new RegExp('"',"ug"),jt=[1105920,1112319],Pt=f(f(f(f({},{FontAwesome:{normal:"fas",400:"fas"}}),En),Lr),$n),Ye=Object.keys(Pt).reduce(function(e,t){return e[t.toLowerCase()]=Pt[t],e},{}),Ji=Object.keys(Ye).reduce(function(e,t){var a=Ye[t];return e[t]=a[900]||N(Object.entries(a))[0][1],e},{});function Ki(e){var t=e.replace($a,"");return wa(N(t)[0]||"")}function qi(e){var t=e.getPropertyValue("font-feature-settings").includes("ss01"),a=e.getPropertyValue("content"),n=a.replace($a,""),r=n.codePointAt(0),i=r>=jt[0]&&r<=jt[1],s=n.length===2?n[0]===n[1]:!1;return i||s||t}function Qi(e,t){var a=e.replace(/^['"]|['"]$/g,"").toLowerCase(),n=parseInt(t),r=isNaN(n)?"normal":n;return(Ye[a]||{})[r]||Ji[a]}function Et(e,t){var a="".concat(Mr).concat(t.replace(":","-"));return new Promise(function(n,r){if(e.getAttribute(a)!==null)return n();var i=K(e.children),s=i.filter(function(se){return se.getAttribute(Oe)===t})[0],o=R.getComputedStyle(e,t),l=o.getPropertyValue("font-family"),u=l.match(Wr),m=o.getPropertyValue("font-weight"),d=o.getPropertyValue("content");if(s&&!u)return e.removeChild(s),n();if(u&&d!=="none"&&d!==""){var v=o.getPropertyValue("content"),p=Qi(l,m),x=Ki(v),y=u[0].startsWith("FontAwesome"),S=qi(o),A=Ze(p,x),k=A;if(y){var I=li(x);I.iconName&&I.prefix&&(A=I.iconName,p=I.prefix)}if(A&&!S&&(!s||s.getAttribute(Xe)!==p||s.getAttribute(Ve)!==k)){e.setAttribute(a,k),s&&e.removeChild(s);var O=Di(),b=O.extra;b.attributes[Oe]=t,ze(A,p).then(function(se){var Ua=et(f(f({},O),{},{icons:{main:se,mask:Na()},prefix:p,iconName:k,extra:b,watchable:!0})),we=w.createElementNS("http://www.w3.org/2000/svg","svg");t==="::before"?e.insertBefore(we,e.firstChild):e.appendChild(we),we.outerHTML=Ua.map(function(Ya){return ie(Ya)}).join(`
`),e.removeAttribute(a),n()}).catch(r)}else n()}else n()})}function Zi(e){return Promise.all([Et(e,"::before"),Et(e,"::after")])}function es(e){return e.parentNode!==document.head&&!~Rr.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(Oe)&&(!e.parentNode||e.parentNode.tagName!=="svg")}var ts=function(t){return!!t&&da.some(function(a){return t.includes(a)})},as=function(t){if(!t)return[];var a=new Set,n=t.split(/,(?![^()]*\))/).map(function(l){return l.trim()});n=n.flatMap(function(l){return l.includes("(")?l:l.split(",").map(function(u){return u.trim()})});var r=ue(n),i;try{for(r.s();!(i=r.n()).done;){var s=i.value;if(ts(s)){var o=da.reduce(function(l,u){return l.replace(u,"")},s);o!==""&&o!=="*"&&a.add(o)}}}catch(l){r.e(l)}finally{r.f()}return a};function Ft(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if($){var a;if(t)a=e;else if(h.searchPseudoElementsFullScan)a=e.querySelectorAll("*");else{var n=new Set,r=ue(document.styleSheets),i;try{for(r.s();!(i=r.n()).done;){var s=i.value;try{var o=ue(s.cssRules),l;try{for(o.s();!(l=o.n()).done;){var u=l.value,m=as(u.selectorText),d=ue(m),v;try{for(d.s();!(v=d.n()).done;){var p=v.value;n.add(p)}}catch(y){d.e(y)}finally{d.f()}}}catch(y){o.e(y)}finally{o.f()}}catch(y){h.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(s.href," (").concat(y.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(y){r.e(y)}finally{r.f()}if(!n.size)return;var x=Array.from(n).join(", ");try{a=e.querySelectorAll(x)}catch{}}return new Promise(function(y,S){var A=K(a).filter(es).map(Zi),k=tt.begin("searchPseudoElements");La(),Promise.all(A).then(function(){k(),Ue(),y()}).catch(function(){k(),Ue(),S()})})}}var ns={hooks:function(){return{mutationObserverCallbacks:function(a){return a.pseudoElementsCallback=Ft,a}}},provides:function(t){t.pseudoElements2svg=function(a){var n=a.node,r=n===void 0?w:n;h.searchPseudoElements&&Ft(r)}}},Nt=!1,rs={mixout:function(){return{dom:{unwatch:function(){La(),Nt=!0}}}},hooks:function(){return{bootstrap:function(){At($e("mutationObserverCallbacks",{}))},noAuto:function(){Li()},watch:function(a){var n=a.observeMutationsRoot;Nt?Ue():At($e("mutationObserverCallbacks",{observeMutationsRoot:n}))}}}},Ct=function(t){var a={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce(function(n,r){var i=r.toLowerCase().split("-"),s=i[0],o=i.slice(1).join("-");if(s&&o==="h")return n.flipX=!0,n;if(s&&o==="v")return n.flipY=!0,n;if(o=parseFloat(o),isNaN(o))return n;switch(s){case"grow":n.size=n.size+o;break;case"shrink":n.size=n.size-o;break;case"left":n.x=n.x-o;break;case"right":n.x=n.x+o;break;case"up":n.y=n.y-o;break;case"down":n.y=n.y+o;break;case"rotate":n.rotate=n.rotate+o;break}return n},a)},is={mixout:function(){return{parse:{transform:function(a){return Ct(a)}}}},hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-transform");return r&&(a.transform=Ct(r)),a}}},provides:function(t){t.generateAbstractTransformGrouping=function(a){var n=a.main,r=a.transform,i=a.containerWidth,s=a.iconWidth,o={transform:"translate(".concat(i/2," 256)")},l="translate(".concat(r.x*32,", ").concat(r.y*32,") "),u="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),m="rotate(".concat(r.rotate," 0 0)"),d={transform:"".concat(l," ").concat(u," ").concat(m)},v={transform:"translate(".concat(s/2*-1," -256)")},p={outer:o,inner:d,path:v};return{tag:"g",attributes:f({},p.outer),children:[{tag:"g",attributes:f({},p.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:f(f({},n.icon.attributes),p.path)}]}]}}}},Ee={x:0,y:0,width:"100%",height:"100%"};function Ot(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill="black"),e}function ss(e){return e.tag==="g"?e.children:[e]}var os={hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-mask"),i=r?ye(r.split(" ").map(function(s){return s.trim()})):Na();return i.prefix||(i.prefix=D()),a.mask=i,a.maskId=n.getAttribute("data-fa-mask-id"),a}}},provides:function(t){t.generateAbstractMask=function(a){var n=a.children,r=a.attributes,i=a.main,s=a.mask,o=a.maskId,l=a.transform,u=i.width,m=i.icon,d=s.width,v=s.icon,p=Qr({transform:l,containerWidth:d,iconWidth:u}),x={tag:"rect",attributes:f(f({},Ee),{},{fill:"white"})},y=m.children?{children:m.children.map(Ot)}:{},S={tag:"g",attributes:f({},p.inner),children:[Ot(f({tag:m.tag,attributes:f(f({},m.attributes),p.path)},y))]},A={tag:"g",attributes:f({},p.outer),children:[S]},k="mask-".concat(o||dt()),I="clip-".concat(o||dt()),O={tag:"mask",attributes:f(f({},Ee),{},{id:k,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[x,A]},b={tag:"defs",children:[{tag:"clipPath",attributes:{id:I},children:ss(v)},O]};return n.push(b,{tag:"rect",attributes:f({fill:"currentColor","clip-path":"url(#".concat(I,")"),mask:"url(#".concat(k,")")},Ee)}),{children:n,attributes:r}}}},ls={provides:function(t){var a=!1;R.matchMedia&&(a=R.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){var n=[],r={fill:"currentColor"},i={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:f(f({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var s=f(f({},i),{},{attributeName:"opacity"}),o={tag:"circle",attributes:f(f({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return a||o.children.push({tag:"animate",attributes:f(f({},i),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:f(f({},s),{},{values:"1;0;1;1;0;1;"})}),n.push(o),n.push({tag:"path",attributes:f(f({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:a?[]:[{tag:"animate",attributes:f(f({},s),{},{values:"1;0;0;0;0;1;"})}]}),a||n.push({tag:"path",attributes:f(f({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:f(f({},s),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},fs={hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-symbol"),i=r===null?!1:r===""?!0:r;return a.symbol=i,a}}}},us=[ti,Gi,Bi,Xi,Vi,ns,rs,is,os,ls,fs];gi(us,{mixoutsTo:P});P.noAuto;var J=P.config;P.library;P.dom;var Ra=P.parse;P.findIconDefinition;P.toHtml;var cs=P.icon;P.layer;P.text;P.counter;function ds(e){return e=e-0,e===e}function Da(e){return ds(e)?e:(e=e.replace(/[_-]+(.)?/g,(t,a)=>a?a.toUpperCase():""),e.charAt(0).toLowerCase()+e.slice(1))}var ms=(e,t)=>He.createElement("stop",{key:`${t}-${e.offset}`,offset:e.offset,stopColor:e.color,...e.opacity!==void 0&&{stopOpacity:e.opacity}});function hs(e){return e.charAt(0).toUpperCase()+e.slice(1)}var G=new Map,vs=1e3;function ps(e){if(G.has(e))return G.get(e);const t={};let a=0;const n=e.length;for(;a<n;){const r=e.indexOf(";",a),i=r===-1?n:r,s=e.slice(a,i).trim();if(s){const o=s.indexOf(":");if(o>0){const l=s.slice(0,o).trim(),u=s.slice(o+1).trim();if(l&&u){const m=Da(l);t[m.startsWith("webkit")?hs(m):m]=u}}}a=i+1}if(G.size===vs){const r=G.keys().next().value;r&&G.delete(r)}return G.set(e,t),t}function za(e,t,a={}){if(typeof t=="string")return t;const n=(t.children||[]).map(d=>{let v=d;return("fill"in a||a.gradientFill)&&d.tag==="path"&&"fill"in d.attributes&&(v={...d,attributes:{...d.attributes,fill:void 0}}),za(e,v)}),r=t.attributes||{},i={};for(const[d,v]of Object.entries(r))switch(!0){case d==="class":{i.className=v;break}case d==="style":{i.style=ps(String(v));break}case d.startsWith("aria-"):case d.startsWith("data-"):{i[d.toLowerCase()]=v;break}default:i[Da(d)]=v}const{style:s,role:o,"aria-label":l,gradientFill:u,...m}=a;if(s&&(i.style=i.style?{...i.style,...s}:s),o&&(i.role=o),l&&(i["aria-label"]=l,i["aria-hidden"]="false"),u){i.fill=`url(#${u.id})`;const{type:d,stops:v=[],...p}=u;n.unshift(e(d==="linear"?"linearGradient":"radialGradient",{...p,id:u.id},v.map(ms)))}return e(t.tag,{...i,...m},...n)}var gs=za.bind(null,He.createElement),Tt=(e,t)=>{const a=fe.useId();return e||(t?a:void 0)},bs=class{constructor(e="react-fontawesome"){this.enabled=!1;let t=!1;try{t=typeof process<"u"&&!1}catch{}this.scope=e,this.enabled=t}log(...e){this.enabled&&console.log(`[${this.scope}]`,...e)}warn(...e){this.enabled&&console.warn(`[${this.scope}]`,...e)}error(...e){this.enabled&&console.error(`[${this.scope}]`,...e)}},ys="searchPseudoElementsFullScan"in J&&typeof J.searchPseudoElementsFullScan=="boolean"?"7.0.0":"6.0.0",xs=Number.parseInt(ys)>=7,ws=()=>xs,te="fa",T={beat:"fa-beat",fade:"fa-fade",beatFade:"fa-beat-fade",bounce:"fa-bounce",shake:"fa-shake",spin:"fa-spin",spinPulse:"fa-spin-pulse",spinReverse:"fa-spin-reverse",pulse:"fa-pulse"},Ss={left:"fa-pull-left",right:"fa-pull-right"},As={90:"fa-rotate-90",180:"fa-rotate-180",270:"fa-rotate-270"},ks={"2xs":"fa-2xs",xs:"fa-xs",sm:"fa-sm",lg:"fa-lg",xl:"fa-xl","2xl":"fa-2xl","1x":"fa-1x","2x":"fa-2x","3x":"fa-3x","4x":"fa-4x","5x":"fa-5x","6x":"fa-6x","7x":"fa-7x","8x":"fa-8x","9x":"fa-9x","10x":"fa-10x"},_={border:"fa-border",fixedWidth:"fa-fw",flip:"fa-flip",flipHorizontal:"fa-flip-horizontal",flipVertical:"fa-flip-vertical",inverse:"fa-inverse",rotateBy:"fa-rotate-by",swapOpacity:"fa-swap-opacity",widthAuto:"fa-width-auto"};function Is(e){const t=J.cssPrefix||J.familyPrefix||te;return t===te?e:e.replace(new RegExp(String.raw`(?<=^|\s)${te}-`,"g"),`${t}-`)}function js(e){const{beat:t,fade:a,beatFade:n,bounce:r,shake:i,spin:s,spinPulse:o,spinReverse:l,pulse:u,fixedWidth:m,inverse:d,border:v,flip:p,size:x,rotation:y,pull:S,swapOpacity:A,rotateBy:k,widthAuto:I,className:O}=e,b=[];return O&&b.push(...O.split(" ")),t&&b.push(T.beat),a&&b.push(T.fade),n&&b.push(T.beatFade),r&&b.push(T.bounce),i&&b.push(T.shake),s&&b.push(T.spin),l&&b.push(T.spinReverse),o&&b.push(T.spinPulse),u&&b.push(T.pulse),m&&b.push(_.fixedWidth),d&&b.push(_.inverse),v&&b.push(_.border),p===!0&&b.push(_.flip),(p==="horizontal"||p==="both")&&b.push(_.flipHorizontal),(p==="vertical"||p==="both")&&b.push(_.flipVertical),x!=null&&b.push(ks[x]),y!=null&&y!==0&&b.push(As[y]),S!=null&&b.push(Ss[S]),A&&b.push(_.swapOpacity),ws()?(k&&b.push(_.rotateBy),I&&b.push(_.widthAuto),(J.cssPrefix||J.familyPrefix||te)===te?b:b.map(Is)):b}var Ps=e=>typeof e=="object"&&"icon"in e&&!!e.icon;function _t(e){if(e)return Ps(e)?e:Ra.icon(e)}function Es(e){return Object.keys(e)}var Lt=new bs("FontAwesomeIcon"),Wa={border:!1,className:"",mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1},Fs=new Set(Object.keys(Wa)),Q=He.forwardRef((e,t)=>{const a={...Wa,...e},{icon:n,mask:r,symbol:i,title:s,titleId:o,maskId:l,transform:u}=a,m=Tt(l,!!r),d=Tt(o,!!s),v=_t(n);if(!v)return Lt.error("Icon lookup is undefined",n),null;const p=js(a),x=typeof u=="string"?Ra.transform(u):u,y=_t(r),S=cs(v,{...p.length>0&&{classes:p},...x&&{transform:x},...y&&{mask:y},symbol:i,title:s,titleId:d,maskId:m});if(!S)return Lt.error("Could not find icon",v),null;const{abstract:A}=S,k={ref:t};for(const I of Es(a))Fs.has(I)||(k[I]=a[I]);return gs(A[0],k)});Q.displayName="FontAwesomeIcon";var Ns={prefix:"fas",iconName:"rocket",icon:[512,512,[],"f135","M128 320L24.5 320c-24.9 0-40.2-27.1-27.4-48.5L50 183.3C58.7 168.8 74.3 160 91.2 160l95 0c76.1-128.9 189.6-135.4 265.5-124.3 12.8 1.9 22.8 11.9 24.6 24.6 11.1 75.9 4.6 189.4-124.3 265.5l0 95c0 16.9-8.8 32.5-23.3 41.2l-88.2 52.9c-21.3 12.8-48.5-2.6-48.5-27.4L192 384c0-35.3-28.7-64-64-64l-.1 0zM400 160a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"]},Cs={prefix:"fas",iconName:"heart",icon:[512,512,[128153,128154,128155,128156,128420,129293,129294,129505,9829,10084,61578],"f004","M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32 452.4 32 512 91.6 512 165.1l0 2.6c0 112.2-139.9 242.5-212.9 298.2-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7l0-2.6C0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1z"]},Os={prefix:"fas",iconName:"users",icon:[640,512,[],"f0c0","M320 16a104 104 0 1 1 0 208 104 104 0 1 1 0-208zM96 88a72 72 0 1 1 0 144 72 72 0 1 1 0-144zM0 416c0-70.7 57.3-128 128-128 12.8 0 25.2 1.9 36.9 5.4-32.9 36.8-52.9 85.4-52.9 138.6l0 16c0 11.4 2.4 22.2 6.7 32L32 480c-17.7 0-32-14.3-32-32l0-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32l0-16c0-53.2-20-101.8-52.9-138.6 11.7-3.5 24.1-5.4 36.9-5.4 70.7 0 128 57.3 128 128l0 32c0 17.7-14.3 32-32 32l-86.7 0zM472 160a72 72 0 1 1 144 0 72 72 0 1 1 -144 0zM160 432c0-88.4 71.6-160 160-160s160 71.6 160 160l0 16c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-16z"]},Ts={prefix:"fas",iconName:"star",icon:[576,512,[11088,61446],"f005","M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"]};function _s({auth:e}){const[t,a]=fe.useState(!1),[n,r]=fe.useState(!1);return fe.useEffect(()=>{const i=()=>{window.scrollY>50?r(!0):r(!1)};return window.addEventListener("scroll",i),()=>window.removeEventListener("scroll",i)},[]),c.jsxs("nav",{className:`navbar ${n?"scrolled":""}`,children:[c.jsx("a",{className:"logo",children:c.jsx(Ga,{className:"w-20 h-10 mr-2"})}),c.jsxs("ul",{className:`nav-links ${t?"active":""}`,children:[c.jsx("li",{children:c.jsx(E,{href:"/",className:"nav-link",children:"Home"})}),c.jsx("li",{children:c.jsx(E,{href:"/jobs",className:"nav-link",children:"Find Jobs"})}),c.jsx("li",{children:c.jsx(E,{href:"/find-talents",className:"nav-link",children:"Find Talents"})}),c.jsx("li",{children:c.jsx(E,{href:"/how-it-works",className:"nav-link",children:"How It Works"})}),c.jsx("li",{children:c.jsx(E,{href:"/about",className:"nav-link",children:"About"})}),c.jsx("li",{children:c.jsx(E,{href:"/contact",className:"nav-link",children:"Contact"})})]}),c.jsxs("div",{className:"nav-right",children:[c.jsxs("div",{className:"auth-links",children:[c.jsx(E,{href:route("login"),className:"nav-auth-link",children:"Sign In"}),c.jsx(E,{href:route("register"),className:"get-started",children:"Get Started"})]}),c.jsxs("div",{className:`hamburger ${t?"active":""}`,onClick:()=>a(!t),children:[c.jsx("span",{}),c.jsx("span",{}),c.jsx("span",{})]})]})]})}function zs(){const e=[{icon:c.jsx(Q,{icon:Ts,className:"value-icon"}),title:"Excellence",description:"We strive for excellence in everything we do, connecting top talent with exceptional opportunities."},{icon:c.jsx(Q,{icon:Cs,className:"value-icon"}),title:"Integrity",description:"We operate with transparency, honesty, and ethical practices in all our interactions."},{icon:c.jsx(Q,{icon:Os,className:"value-icon"}),title:"Community",description:"Building a supportive community where talents and employers grow together."},{icon:c.jsx(Q,{icon:Ns,className:"value-icon"}),title:"Innovation",description:"Constantly evolving to meet the changing needs of the modern workforce."}],t=[{number:"100+",label:"Active Users"},{number:"50+",label:"Companies"},{number:"30+",label:"Jobs Posted"},{number:"98%",label:"Success Rate"}];return c.jsxs(c.Fragment,{children:[c.jsx(Ha,{title:"About Us - GiftedTalents"}),c.jsxs("div",{className:"about-page",children:[c.jsx(_s,{}),c.jsxs("section",{className:"about-hero",children:[c.jsxs("div",{className:"about-hero-content",children:[c.jsx("h1",{children:"About GiftedTalents"}),c.jsx("p",{children:"We're on a mission to transform the way talent meets opportunity."})]}),c.jsxs("div",{className:"story-container",children:[c.jsx("div",{className:"story-image",children:c.jsx("img",{src:"/assets/svg/hero-image.jpg",alt:"Our Story"})}),c.jsxs("div",{className:"story-text",children:[c.jsx("h2",{children:"Our Story"}),c.jsx("p",{children:"GiftedTalents was born from a simple idea: connecting talented professionals with companies that need them shouldn't be complicated. Founded in 2026, we set out to create a platform that puts people first."}),c.jsx("p",{children:"Today, we've helped thousands of professionals find meaningful work and hundreds of companies build exceptional teams. Our journey is just beginning, and we're excited to continue growing with our community."}),c.jsxs("div",{className:"story-footer",children:[c.jsx(E,{href:"/how-it-works",className:"story-btn",children:"Learn How It Works"}),c.jsxs("a",{href:"https://wa.me/2348012345678?text=Hello%20GiftedTalents",target:"_blank",rel:"noopener noreferrer",className:"whatsapp-icon-link",children:[c.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",children:c.jsx("path",{d:"M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.277-.582c.949.544 2.017.83 3.09.831 3.18 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.767-5.766-5.767zm-.001 10.285c-.893 0-1.77-.24-2.537-.692l-.18-.108-1.359.348.356-1.325-.117-.186c-.462-.742-.707-1.6-.707-2.477 0-2.553 2.077-4.63 4.63-4.63 2.553 0 4.63 2.077 4.63 4.63 0 2.553-2.077 4.63-4.63 4.63zm2.62-3.453c-.144-.072-.852-.42-.984-.468-.132-.048-.228-.072-.324.072-.096.144-.372.468-.456.564-.084.096-.168.108-.312.036-.144-.072-.608-.224-1.158-.714-.432-.384-.72-.858-.804-1.002-.084.144-.012-.222.06-.294.064-.072.144-.168.216-.252.072-.084.096-.144.144-.24.048-.096.024-.18-.012-.252-.036-.072-.324-.78-.444-1.068-.12-.288-.24-.24-.324-.252-.084-.012-.18-.012-.276-.012-.096 0-.252.036-.384.18-.132.144-.504.492-.504 1.2 0 .708.516 1.392.588 1.488.072.096 1.008 1.548 2.448 2.172.348.144.612.228.828.288.348.108.672.084.924.048.276-.036.852-.348.972-.684.12-.336.12-.624.084-.684-.036-.06-.132-.096-.276-.168z"})}),c.jsx("span",{children:"Chat on WhatsApp"})]})]})]})]})]}),c.jsx("section",{className:"about-mission",children:c.jsxs("div",{className:"mission-container",children:[c.jsxs("div",{className:"mission-text",children:[c.jsx("h2",{children:"Our Mission"}),c.jsx("p",{children:"To empower professionals and employers by creating a seamless, transparent, and efficient platform where talent meets opportunity. We believe that everyone deserves to find work they love and companies deserve to find the talent they need."}),c.jsx("div",{className:"mission-stats",children:t.map((a,n)=>c.jsxs("div",{className:"stat-item",children:[c.jsx("span",{className:"stat-number",children:a.number}),c.jsx("span",{className:"stat-label",children:a.label})]},n))})]}),c.jsx("div",{className:"mission-image",children:c.jsx("img",{src:"/assets/svg/01f7c576-04bb-4d9e-b318-158c701bfeda 1.jpg",alt:"Our Mission"})})]})}),c.jsxs("section",{className:"about-values",children:[c.jsxs("div",{className:"values-header",children:[c.jsx("h2",{children:"Our Core Values"}),c.jsx("p",{children:"What drives us every day"})]}),c.jsx("div",{className:"values-grid",children:e.map((a,n)=>c.jsxs("div",{className:"value-card",children:[c.jsx("div",{className:"value-icon-wrapper",children:a.icon}),c.jsx("h3",{children:a.title}),c.jsx("p",{children:a.description})]},n))})]}),c.jsx("section",{className:"about-cta",children:c.jsxs("div",{className:"cta-content",children:[c.jsx("h2",{children:"Ready to start your journey?"}),c.jsx("p",{children:"Join thousands of professionals and companies already using GiftedTalents"}),c.jsxs("div",{className:"cta-buttons",children:[c.jsx(E,{href:"/jobs",className:"btn-primary",children:"Find Jobs"}),c.jsx(E,{href:"/find-talents",className:"btn-secondary",children:"Find Talents"})]})]})}),c.jsx(Ba,{})]})]})}export{zs as default};
