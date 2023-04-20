// ==UserScript==
// @name         Aggregated status page
// @namespace    http://kxxt.dev
// @version      0.2
// @description  Aggregated status page
// @author       kxxt
// @match        https://archriscv.felixc.at/.status/status.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// ==/UserScript==

"use strict";

let style = document.createElement("style");

style.innerHTML = `
tr.pkgmark-upstreamed{background-color:lightblue;}
tr.pkgmark-ready,tr.pkgmark-pending,tr.pkgmark-noqemu{background-color:lightgreen;}
tr.pkgmark-failing{}
tr.pkgmark-outdated,tr.pkgmark-outdated_dep,tr.pkgmark-missing_dep,tr.pkgmark-ignore,tr.pkgmark-stuck{background-color:lightgray;}
tr.pkgmark-unknown{background-color:khaki;}
tr.pkgmark-nocheck{background-color:lightgoldenrodyellow;}
tr.pkgmark-flaky{background-color:lightsteelblue;}
div.pkgmark-noqemu{background-color:hotpink;}
div.pkgmark-upstreamed{background-color:lightseagreen;}
div.pkgmark-unknown{background-color:gold;}
div.pkgmark-outdated_dep, div.pkgmark-outdated{background-color: yellow;}
div.pkgmark-stuck{background-color: lightsalmon;}
div.pkgmark-ready{background-color: aqua;}
div.pkgmark-ignore{background-color: azure;}
`;

document.head.append(style);

GM_xmlhttpRequest({
  method: "GET",
  url: "https://plct-archrv.ax64.workers.dev/",
  onload: function (response) {
    let parser = new DOMParser();
    let dom = parser.parseFromString(response.responseText, "text/html");
    let trs = dom.body.querySelectorAll("table > tbody > tr");
    let map = new Map();
    for (let tr of trs.values()) {
      // let status = Array.from(tr.classList).map(x => x.split('-')[1])
      let archUrl = tr.querySelector("td > a:first-child");
      let marks = new Map();
      tr.querySelectorAll("td > span.pkgmark").forEach((x) =>
        marks.set(x.classList[1].split("-")[1], x.title)
      );
      let pkgname =
        tr.querySelector("td > a:nth-child(2)")?.innerText ??
        tr.children[0].childNodes[1].data.slice(2).trim();
      let user = tr.children[1] ?? document.createElement("td");
      let status = tr.children[2] ?? document.createElement("td");
      map.set(pkgname, { archUrl, marks, user, status });
    }
    let thead = document.querySelector("table.table > thead > tr");
    thead.append(
      ...["User", "Status", "Marks"].map((x) => {
        let th = document.createElement("th");
        th.innerText = x;
        return th;
      })
    );
    trs = document.querySelectorAll("table.table > tbody > tr");
    console.log(map);
    for (let tr of trs) {
      let pkg = tr.children[1].innerText;
      let pat = /.+ \((.+)\)/;
      let pkgname = pkg.match(pat)?.[1] ?? pkg;
      if (!map.has(pkgname)) {
        tr.innerHTML += "<td/><td/><td/>";
        continue;
      }
      let { archUrl, marks, user, status } = map.get(pkgname);
      let a = document.createElement("a");
      a.href = archUrl;
      a.innerText = pkg;
      tr.children[1].innerHTML = "";
      tr.children[1].append(a);
      tr.append(user.cloneNode(true));
      tr.append(status.cloneNode(true));
      let marksEle = document.createElement("td");
      for (let [mark, content] of marks) {
        tr.classList.add(`pkgmark-${mark}`);
        let ele = document.createElement("div");
        ele.classList.add(`pkgmark`, `pkgmark-${mark}`);
        ele.innerText = `${mark}: ${content}`;
        marksEle.append(ele);
      }
      tr.append(marksEle);
    }
  },
});