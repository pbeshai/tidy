(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{86:function(e,a,t){"use strict";t.r(a);var n=t(3),r=t(0),i=t.n(r),l=t(95),s=t(106),c=t(102),m=t(22),o=t(103),u=t(87),d=t.n(u),p=[{title:i.a.createElement(i.a.Fragment,null,"Readable code"),description:i.a.createElement(i.a.Fragment,null,"tidy.js prioritizes making your data transformations readable, so future you and your teammates can get up and running quickly.")},{title:i.a.createElement(i.a.Fragment,null,"Standard transformation verbs"),description:i.a.createElement(i.a.Fragment,null,"Inspired by ",i.a.createElement(c.a,{href:"https://dplyr.tidyverse.org/"},"dplyr")," and the ",i.a.createElement(c.a,{href:"https://www.tidyverse.org/"},"tidyverse")," in R,"," ","tidy.js is built using battle-tested verbs that can handle any data wrangling need.")},{title:i.a.createElement(i.a.Fragment,null,"Work with plain JS objects"),description:i.a.createElement(i.a.Fragment,null,"No wrapper classes needed \u2014 all tidy.js needs is an array of plain old-fashioned JS objects to get started.")}],g=[{heading:"Tidy Functions",url:"docs/api/tidy",items:["addItems / addRows","arrange / sort","complete","count","debug","distinct","expand","fill","filter","fullJoin","groupBy","innerJoin","leftJoin","map","mutate","mutateWithSummary","rename","replaceNully","select / pick","slice","sliceHead","sliceTail","sliceMin","sliceMax","sliceSample","summarize","summarizeAll","summarizeAt","summarizeIf","tally","total","totalAll","totalAt","totalIf","transmute","when"]},{heading:"Grouping with groupBy",url:"docs/api/groupby",items:["groupBy","groupBy.grouped","groupBy.entries","groupBy.entriesObject","groupBy.object","groupBy.map","groupBy.keys","groupBy.values","groupBy.levels"]},{heading:"Summarizers",url:"docs/api/summary",items:["deviation","first","last","max","mean","meanRate","median","min","n","nDistinct","sum","variance"]},{heading:"Item Functions",url:"docs/api/item",items:["rate"]},{heading:"Vector Functions",url:"docs/api/vector",items:["cumsum","lag","lead","roll","rowNumber"]},{heading:"Pivot",url:"docs/api/pivot",items:["pivotLonger","pivotWider"]},{heading:"Sequences",url:"docs/api/sequences",items:["fullSeq","fullSeqDate","fullSeqDateISOString"]},{heading:"Selectors",url:"docs/api/selectors",items:["contains","endsWith","everything","matches","negate","numRange","startsWith"]},{heading:"TMath",url:"docs/api/math",items:["add","rate","subtract"]}];function y(e){var a=e.imageUrl,t=e.title,n=e.description,r=Object(o.a)(a);return i.a.createElement("div",{className:Object(l.a)("col col--4",d.a.feature)},r&&i.a.createElement("div",{className:"text--center"},i.a.createElement("img",{className:d.a.featureImage,src:r,alt:t})),i.a.createElement("h3",null,t),i.a.createElement("p",null,n))}a.default=function(){var e=Object(m.default)().siteConfig,a=void 0===e?{}:e;return i.a.createElement(s.a,{description:"Tidy up your data with JavaScript, inspired by dplyr and the tidyverse from R."},i.a.createElement("header",{className:Object(l.a)("hero hero--tidy",d.a.heroBanner)},i.a.createElement("div",{className:"container"},i.a.createElement("img",{src:Object(o.a)("img/logo.svg"),alt:"Tidy.js Logo",width:256}),i.a.createElement("p",{className:"hero__subtitle"},a.tagline),i.a.createElement("div",{className:d.a.buttons},i.a.createElement(c.a,{className:Object(l.a)("button button--lg button--primary ",d.a.getStarted),to:Object(o.a)("docs/getting_started")},"Get Started")))),i.a.createElement("main",null,p&&p.length&&i.a.createElement("section",{className:d.a.features},i.a.createElement("div",{className:"container"},i.a.createElement("div",{className:"row"},p.map((function(e,a){return i.a.createElement(y,Object(n.a)({key:a},e))}))))),i.a.createElement("section",{className:d.a.funcs},i.a.createElement("div",{className:"container"},i.a.createElement("h3",null,"Function List"),i.a.createElement("p",null,"Here's a quick jumping off point to see the API for all the functions provided by tidy.js."),g.map((function(e,a){return i.a.createElement("div",{key:a,className:d.a.funcSet},i.a.createElement("h4",{className:d.a.funcSetHeading},e.heading),i.a.createElement("div",{className:d.a.funcSetItems},e.items.map((function(a){var t=e.url+"#"+a.toLowerCase().replace(/\//g,"").replace(/\./g,"").replace(/ /g,"-");return i.a.createElement(c.a,{key:a,to:t,className:d.a.funcSetItem},a)}))))}))))))}}}]);