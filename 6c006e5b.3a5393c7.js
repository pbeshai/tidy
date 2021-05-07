(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{78:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return u})),a.d(t,"metadata",(function(){return o})),a.d(t,"toc",(function(){return i})),a.d(t,"default",(function(){return b}));var n=a(3),r=a(7),l=(a(0),a(97)),u={title:"Vector Function API",sidebar_label:"Vector Functions"},o={unversionedId:"api/vector",id:"api/vector",isDocsHomePage:!1,title:"Vector Function API",description:'Mapping functions that given a collection of items produce an array of values (a "vector") equal in length to the collection. Typically used with mutateWithSummary.',source:"@site/docs/api/vector.md",slug:"/api/vector",permalink:"/tidy/docs/api/vector",editUrl:"https://github.com/pbeshai/tidy/docs/api/vector.md",version:"current",lastUpdatedBy:"Peter Beshai",lastUpdatedAt:1619648517,sidebar_label:"Vector Functions",sidebar:"docs",previous:{title:"Summarizer API",permalink:"/tidy/docs/api/summary"},next:{title:"Item Function API",permalink:"/tidy/docs/api/item"}},i=[{value:"cumsum",id:"cumsum",children:[{value:"Parameters",id:"parameters",children:[]},{value:"Usage",id:"usage",children:[]}]},{value:"lag",id:"lag",children:[{value:"Parameters",id:"parameters-1",children:[]},{value:"Usage",id:"usage-1",children:[]}]},{value:"lead",id:"lead",children:[{value:"Parameters",id:"parameters-2",children:[]},{value:"Usage",id:"usage-2",children:[]}]},{value:"roll",id:"roll",children:[{value:"Parameters",id:"parameters-3",children:[]},{value:"Usage",id:"usage-3",children:[]}]}],c={toc:i};function b(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(l.b)("wrapper",Object(n.a)({},c,a,{components:t,mdxType:"MDXLayout"}),Object(l.b)("p",null,'Mapping functions that given a collection of items produce an array of values (a "vector") equal in length to the collection. Typically used with ',Object(l.b)("a",Object(n.a)({parentName:"p"},{href:"/tidy/docs/api/tidy#mutatewithsummary"}),Object(l.b)("strong",{parentName:"a"},"mutateWithSummary")),"."),Object(l.b)("h2",{id:"cumsum"},"cumsum"),Object(l.b)("p",null,"Returns a function that computes a cumulative sum as per ",Object(l.b)("a",Object(n.a)({parentName:"p"},{href:"https://github.com/d3/d3-array#cumsum"}),"d3-array::cumsum"),", using ",Object(l.b)("a",Object(n.a)({parentName:"p"},{href:"https://github.com/d3/d3-array#fsum"}),"d3-array::fsum")," to reduce floating point errors."),Object(l.b)("h3",{id:"parameters"},"Parameters"),Object(l.b)("h4",{id:"key"},Object(l.b)("inlineCode",{parentName:"h4"},"key")),Object(l.b)("pre",null,Object(l.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"| string /* key of object */\n| (item: object) => number | null | undefined\n")),Object(l.b)("p",null,"Either the key to compute the value over or an accessor function that maps a given item to the value to compute over."),Object(l.b)("h3",{id:"usage"},"Usage"),Object(l.b)("pre",null,Object(l.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"const data = [\n  { str: 'foo', value: 3, value2: 1 },\n  { str: 'bar', value: 1, value2: 3 },\n  { str: 'bar', value: null, value2: undefined },\n  { str: 'bar', value: 5, value2: 4 },\n];\n\ntidy(\n  data,\n  mutateWithSummary({\n    cumsum1: cumsum('value'),\n    cumsum2: cumsum((d) => (d.value == null ? d.value : d.value2 * 2)),\n  })\n);\n// output:\n[\n  { str: 'foo', value: 3,    value2: 1,         cumsum1: 3, cumsum2: 2 },\n  { str: 'bar', value: 1,    value2: 3,         cumsum1: 4, cumsum2: 8 },\n  { str: 'bar', value: null, value2: undefined, cumsum1: 4, cumsum2: 8 },\n  { str: 'bar', value: 5,    value2: 4,         cumsum1: 9, cumsum2: 16 },\n]\n")),Object(l.b)("hr",null),Object(l.b)("h2",{id:"lag"},"lag"),Object(l.b)("p",null,"Lags a vector by a specified offset (",Object(l.b)("inlineCode",{parentName:"p"},"options.n"),", default 1). Useful for finding previous values to compute deltas with later. It can be convenient to use ",Object(l.b)("a",Object(n.a)({parentName:"p"},{href:"/tidy/docs/api/math#subtract"}),Object(l.b)("strong",{parentName:"a"},"TMath::subtract"))," and",Object(l.b)("a",Object(n.a)({parentName:"p"},{href:"/tidy/docs/api/math#add"}),Object(l.b)("strong",{parentName:"a"},"TMath::add"))," with these values to handle nulls."),Object(l.b)("h3",{id:"parameters-1"},"Parameters"),Object(l.b)("h4",{id:"key-1"},Object(l.b)("inlineCode",{parentName:"h4"},"key")),Object(l.b)("pre",null,Object(l.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"| string /* key of object */\n| (item: object) => any\n")),Object(l.b)("p",null,"Either the key to compute the value over or an accessor function that maps a given item to the value to compute over."),Object(l.b)("h4",{id:"options"},Object(l.b)("inlineCode",{parentName:"h4"},"options")),Object(l.b)("pre",null,Object(l.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"{\n  n?: number = 1\n  default?: any\n}\n")),Object(l.b)("ul",null,Object(l.b)("li",{parentName:"ul"},Object(l.b)("inlineCode",{parentName:"li"},"n = 1")," The number of positions to lag by. e.g. given ",Object(l.b)("inlineCode",{parentName:"li"},"[1,2,3,4]")," a lag ",Object(l.b)("inlineCode",{parentName:"li"},"n")," of 1 would produce ",Object(l.b)("inlineCode",{parentName:"li"},"[undefined,1,2,3]")),Object(l.b)("li",{parentName:"ul"},Object(l.b)("inlineCode",{parentName:"li"},"default = undefined")," The default value for non-existent rows (e.g. we've lagged before the first element).")),Object(l.b)("h3",{id:"usage-1"},"Usage"),Object(l.b)("pre",null,Object(l.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"const data = [\n  { str: 'foo', value: 1 },\n  { str: 'foo', value: 2 },\n  { str: 'bar', value: 4 },\n]\n\ntidy(\n  data,\n  mutateWithSummary({\n    prev1: lag('value'),\n    prev1_0: lag('value', { default: 0 }),\n    prev2: lag('value', { n: 2 }),\n    prev3: lag('value', { n: 3 }),\n    other: lag('other'),\n  }),\n  mutate({\n    delta1_0: (d) => d.value - d.prev1_0,\n  })\n)\n\n// output:\n[\n  { str: 'foo', value: 1, prev1: undefined, prev1_0: 0, delta1_0: 1 },\n  { str: 'foo', value: 2, prev1: 1, prev1_0: 1, delta1_0: 1 },\n  { str: 'bar', value: 4, prev1: 2, prev1_0: 2, prev2: 1 , delta1_0: 2 },\n]\n")),Object(l.b)("hr",null),Object(l.b)("h2",{id:"lead"},"lead"),Object(l.b)("p",null,"Leads a vector by a specified offset (",Object(l.b)("inlineCode",{parentName:"p"},"options.n"),", default 1). Useful for finding next values to compute deltas with later. It can be convenient to use ",Object(l.b)("a",Object(n.a)({parentName:"p"},{href:"/tidy/docs/api/math#subtract"}),Object(l.b)("strong",{parentName:"a"},"TMath::subtract"))," and",Object(l.b)("a",Object(n.a)({parentName:"p"},{href:"/tidy/docs/api/math#add"}),Object(l.b)("strong",{parentName:"a"},"TMath::add"))," with these values to handle nulls."),Object(l.b)("h3",{id:"parameters-2"},"Parameters"),Object(l.b)("h4",{id:"key-2"},Object(l.b)("inlineCode",{parentName:"h4"},"key")),Object(l.b)("pre",null,Object(l.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"| string /* key of object */\n| (item: object) => any\n")),Object(l.b)("p",null,"Either the key to compute the value over or an accessor function that maps a given item to the value to compute over."),Object(l.b)("h4",{id:"options-1"},Object(l.b)("inlineCode",{parentName:"h4"},"options")),Object(l.b)("pre",null,Object(l.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"{\n  n?: number = 1\n  default?: any\n}\n")),Object(l.b)("ul",null,Object(l.b)("li",{parentName:"ul"},Object(l.b)("inlineCode",{parentName:"li"},"n = 1")," The number of positions to lead by. e.g. given ",Object(l.b)("inlineCode",{parentName:"li"},"[1,2,3,4]")," a lead ",Object(l.b)("inlineCode",{parentName:"li"},"n")," of 1 would produce ",Object(l.b)("inlineCode",{parentName:"li"},"[2,3,4,undefined]")),Object(l.b)("li",{parentName:"ul"},Object(l.b)("inlineCode",{parentName:"li"},"default = undefined")," The default value for non-existent rows (e.g. we've lagged before the first element).")),Object(l.b)("h3",{id:"usage-2"},"Usage"),Object(l.b)("pre",null,Object(l.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"const data = [\n  { str: 'foo', value: 1 },\n  { str: 'foo', value: 2 },\n  { str: 'bar', value: 4 },\n]\n\ntidy(\n  data,\n  mutateWithSummary({\n    next1: lead('value'),\n    next1_0: lead('value', { default: 0 }),\n    next2: lead('value', { n: 2 }),\n    next3: lead('value', { n: 3 }),\n    other: lead('other'),\n  }),\n  mutate({\n    delta1: (d) => TMath.subtract(d.value, d.next1),\n  })\n)\n\n// output:\n[\n  { str: 'foo', value: 1, next1: 2, next1_0: 2, next2: 4, delta1: -1 },\n  { str: 'foo', value: 2, next1: 4, next1_0: 4, delta1: -2 },\n  { str: 'bar', value: 4, next1: undefined, next1_0: 0, delta1: undefined },\n]\n")),Object(l.b)("hr",null),Object(l.b)("h2",{id:"roll"},"roll"),Object(l.b)("p",null,"Computes values over a rolling window. Typically used for calculating moving averages or running sums."),Object(l.b)("h3",{id:"parameters-3"},"Parameters"),Object(l.b)("h4",{id:"width"},Object(l.b)("inlineCode",{parentName:"h4"},"width")),Object(l.b)("pre",null,Object(l.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"number\n")),Object(l.b)("p",null,"The size of the window."),Object(l.b)("h4",{id:"rollfn"},Object(l.b)("inlineCode",{parentName:"h4"},"rollFn")),Object(l.b)("pre",null,Object(l.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"(itemsInWindow: object[], endIndex: number) => any\n")),Object(l.b)("p",null,"The function used to apply to the window, reduces to a single value for the window. Given the subset of items that are within the window as well as the ending index in the original array."),Object(l.b)("h4",{id:"options-2"},Object(l.b)("inlineCode",{parentName:"h4"},"options")),Object(l.b)("pre",null,Object(l.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"{\n  partial?: boolean\n}\n")),Object(l.b)("ul",null,Object(l.b)("li",{parentName:"ul"},Object(l.b)("inlineCode",{parentName:"li"},"partial = false")," If true, will compute the value even if the size of the window is less than the specified width. Otherwise, the rolled up value will be undefined.")),Object(l.b)("h3",{id:"usage-3"},"Usage"),Object(l.b)("pre",null,Object(l.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"const data = [\n  { str: 'foo', value: 3 },\n  { str: 'foo', value: 1 },\n  { str: 'bar', value: 3 },\n  { str: 'bar', value: 1 },\n  { str: 'bar', value: 7 },\n];\n\ntidy(data, mutateWithSummary({\n  movingAvg: roll(3, mean('value'), { partial: true }),\n}))\n// output:\n[\n  { str: 'foo', value: 3, movingAvg: 3 / 1 }, // partial\n  { str: 'foo', value: 1, movingAvg: 4 / 2 }, // partial\n  { str: 'bar', value: 3, movingAvg: 7 / 3 },\n  { str: 'bar', value: 1, movingAvg: 5 / 3 },\n  { str: 'bar', value: 7, movingAvg: 11 / 3 },\n]\n")),Object(l.b)("hr",null))}b.isMDXComponent=!0},97:function(e,t,a){"use strict";a.d(t,"a",(function(){return s})),a.d(t,"b",(function(){return m}));var n=a(0),r=a.n(n);function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function u(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?u(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):u(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var c=r.a.createContext({}),b=function(e){var t=r.a.useContext(c),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},s=function(e){var t=b(e.components);return r.a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},p=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,u=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),s=b(a),p=n,m=s["".concat(u,".").concat(p)]||s[p]||d[p]||l;return a?r.a.createElement(m,o(o({ref:t},c),{},{components:a})):r.a.createElement(m,o({ref:t},c))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,u=new Array(l);u[0]=p;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:n,u[1]=o;for(var c=2;c<l;c++)u[c]=a[c];return r.a.createElement.apply(null,u)}return r.a.createElement.apply(null,a)}p.displayName="MDXCreateElement"}}]);