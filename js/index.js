/* ----------------------------- */
/* Cloak dropdown toggle */
/* ----------------------------- */

const cloakButton = document.getElementById("tabCloak");
const cloakMenu = document.getElementById("cloakMenu");

if (cloakButton && cloakMenu) {

cloakButton.onclick = () => {

cloakMenu.style.display =
cloakMenu.style.display === "flex"
? "none"
: "flex";

};

document.addEventListener("click", (e) => {

if(!cloakButton.contains(e.target) && !cloakMenu.contains(e.target)){
cloakMenu.style.display = "none";
}

});

}


/* ----------------------------- */
/* Cloak system */
/* ----------------------------- */

const cloaks = {

google:{
title:"Google",
icon:"https://www.google.com/favicon.ico"
},

drive:{
title:"My Drive - Google Drive",
icon:"https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png"
},

classroom:{
title:"Classes",
icon:"https://ssl.gstatic.com/classroom/favicon.png"
},

blank:{
title:"about:blank",
icon:""
},
};


/* ----------------------------- */
/* Apply cloak */
/* ----------------------------- */

function applyCloak(name){

const cloak = cloaks[name];

if(!cloak) return;

document.title = cloak.title;

let icon = document.querySelector("link[rel='icon']");

if(!icon){
icon = document.createElement("link");
icon.rel = "icon";
document.head.appendChild(icon);
}

icon.href = cloak.icon;

/* save cloak */

localStorage.setItem("selectedCloak", name);

}


/* ----------------------------- */
/* Load saved cloak */
/* ----------------------------- */

window.addEventListener("load", () => {

const saved = localStorage.getItem("selectedCloak");

if(saved && cloaks[saved]){
applyCloak(saved);
}

});
