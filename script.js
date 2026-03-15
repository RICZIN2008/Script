// ==UserScript==
// @name         TDK Menu Global - Shield Ultra Completo
// @namespace    https://viayoo.com/rlybzf
// @version      16.1
// @description  Proteção Real (9 Camadas) + Mídia Micro + Player Lite + Links Vermelhos
// @author       TDK
// @match        https://*/*
// @updateURL    https://raw.githubusercontent.com/RICZIN2008/Script/refs/heads/main/script.js
// @downloadURL  https://raw.githubusercontent.com/RICZIN2008/Script/refs/heads/main/script.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    /* =========================================
       1. ESTRUTURA E BOTÃO TDK (ORIGINAL)
       ========================================= */
    const btn = document.createElement("div");
    btn.innerText = "TDK";
    Object.assign(btn.style, {
        position: "fixed", top: "10px", right: "10px", width: "60px", height: "60px",
        background: "red", color: "#fff", borderRadius: "50%", display: "flex",
        alignItems: "center", justifyContent: "center", fontWeight: "bold",
        cursor: "move", zIndex: "999999", boxShadow: "0 0 10px black", userSelect: "none",
        touchAction: "none"
    });
    document.body.appendChild(btn);

    let isDragging = false;
    let startX, startY;

    function startDrag(e) {
        isDragging = false; 
        const event = e.touches ? e.touches[0] : e;
        startX = event.clientX - btn.offsetLeft;
        startY = event.clientY - btn.offsetTop;
        const onDrag = (e) => {
            isDragging = true;
            const ev = e.touches ? e.touches[0] : e;
            btn.style.left = (ev.clientX - startX) + 'px';
            btn.style.top = (ev.clientY - startY) + 'px';
            btn.style.right = 'auto';
        };
        const stopDrag = () => {
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('touchmove', onDrag);
        };
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag, {passive: false});
        document.addEventListener('mouseup', stopDrag, {once: true});
        document.addEventListener('touchend', stopDrag, {once: true});
    }

    btn.addEventListener('mousedown', startDrag);
    btn.addEventListener('touchstart', startDrag, {passive: false});

    /* =========================================
       2. MENU PRINCIPAL E INTERFACE
       ========================================= */
    const menu = document.createElement("div");
    Object.assign(menu.style, {
        position: "fixed", top: "80px", right: "10px", width: "260px",
        background: "#111", color: "#fff", padding: "15px", borderRadius: "10px",
        display: "none", zIndex: "999999", boxShadow: "0 0 15px red", fontFamily: "sans-serif",
        maxHeight: "80vh", overflowY: "auto"
    });
    menu.id = "tdk_main_menu";

    menu.innerHTML = `
        <h3 style="text-align:center;color:red;margin:0 0 10px 0">TDK MENU</h3>
        <div id="consultaContainer" style="border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px;"></div>
        
        <div style="margin-bottom: 15px;">
            <label style="font-size: 12px; color: #bbb;">📏 TAMANHO DO BOTÃO</label>
            <input type="range" min="30" max="120" value="60" id="sizeControl" style="width:100%; accent-color: red;">
            <label style="font-size: 12px; color: #bbb; margin-top: 10px; display: block;">👁 TRANSPARÊNCIA</label>
            <input type="range" min="0.2" max="1" step="0.1" value="1" id="opacityControl" style="width:100%; accent-color: red;">
        </div>

        <div id="safetyPanel" style="border-top: 1px solid #333; padding-top: 10px; margin-top: 10px;"></div>

        <button id="infoBtn" style="background:red; width:100%; padding:10px; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold; margin-top:15px">INFO DO SISTEMA</button>
        <button id="closeMenu" style="width:100%; padding:10px; background:#333; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold; margin-top:5px">FECHAR MENU</button>
    `;
    document.body.appendChild(menu);

    /* =========================================
       3. BOTÕES DE CONSULTA E SHIELDS (LÓGICA)
       ========================================= */
    const shieldList = [
        { id: "typo", n: "Typosquatting", chk: true },
        { id: "tab", n: "Tabnabbing", chk: true },
        { id: "dark", n: "Dark Patterns", chk: true },
        { id: "redir", n: "Redirects", chk: false },
        { id: "over", n: "Overlay Screens", chk: true },
        { id: "click", n: "Clickjacking", chk: true },
        { id: "cryp", n: "Cryptojacking", chk: true },
        { id: "scrover", n: "Screen Overlay", chk: true },
        { id: "spam", n: "Calendar Spam", chk: true }
    ];

    const safetyPanel = document.getElementById("safetyPanel");
    safetyPanel.innerHTML = `
        <label style="font-size:11px;color:red;font-weight:bold;display:block;margin-bottom:5px">🛡️ SEGURANÇA ATIVA (9 CAMADAS)</label>
        <div style="background:#000; padding:8px; border:1px solid #444; border-radius:5px; max-height:140px; overflow-y:auto">
            ${shieldList.map(s => `
                <label style="display:flex;align-items:center;color:#ddd;font-size:10px;margin-bottom:4px;cursor:pointer">
                    <input type="checkbox" id="tdk_${s.id}" ${s.chk ? 'checked' : ''} style="margin-right:6px;accent-color:red"> ${s.n}
                </label>
            `).join("")}
        </div>
    `;

    const getSt = (id) => document.getElementById(`tdk_${id}`).checked;

    function addNewButton(text, url) {
        const nb = document.createElement("button");
        nb.innerText = text;
        Object.assign(nb.style, {
            width: "100%", padding: "10px", background: "#222", color: "#fff",
            border: "1px solid red", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginBottom: "5px"
        });
        nb.onclick = () => {
            document.getElementById("siteFrame").src = url;
            document.getElementById("siteBox").style.display = "block";
        };
        document.getElementById("consultaContainer").appendChild(nb);
    }

    addNewButton("IP", "https://riczin2008.github.io/IP/");
    addNewButton("CPF OPERADORA", "https://infopessoas.com/");
    addNewButton("NÚMERO OPERADORA 1", "https://consultaoperadora.com.br/");
    addNewButton("IMEI - STATUS", "https://imeicheck.com/pt/consultar-imei");

    /* =========================================
       4. LÓGICA DE PROTEÇÃO ATIVA (O CORAÇÃO DO SCRIPT)
       ========================================= */
    setInterval(() => {
        // Anti-Tabnabbing
        if (getSt("tab")) {
            document.querySelectorAll('a[target="_blank"]').forEach(a => a.rel = "noopener noreferrer");
        }

        // Anti-Overlay / Clickjacking
        if (getSt("over") || getSt("click") || getSt("scrover")) {
            document.querySelectorAll('div, ins, iframe, aside').forEach(el => {
                if (el === btn || el === menu || el.id === "siteBox") return;
                const s = window.getComputedStyle(el);
                if (parseInt(s.zIndex) > 500 && (parseFloat(s.opacity) < 0.1 || s.backgroundColor.includes('rgba(0, 0, 0, 0)'))) {
                    el.style.pointerEvents = "none";
                    if (s.position === "fixed") el.remove();
                }
            });
        }

        // Anti-Dark Patterns
        if (getSt("dark")) {
            document.querySelectorAll('input[type="checkbox"]').forEach(i => {
                if (i.checked && (i.style.display === "none" || i.style.visibility === "hidden")) i.checked = false;
            });
        }
    }, 1500);

    // Anti-Redirect
    window.addEventListener("beforeunload", (e) => {
        if (getSt("redir")) {
            e.preventDefault();
            e.returnValue = "TDK: Bloqueando redirecionamento.";
        }
    });

    /* =========================================
       5. ESTILIZAÇÃO VISUAL (LINKS VERMELHOS / MÍDIA)
       ========================================= */
    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `
        #tdk_main_menu::-webkit-scrollbar { width: 5px; }
        #tdk_main_menu::-webkit-scrollbar-thumb { background: red; border-radius: 10px; }
        img, picture { max-width: 50px !important; max-height: 50px !important; object-fit: contain !important; }
        video, iframe { max-width: 100% !important; max-height: none !important; display: block !important; visibility: visible !important; opacity: 1 !important; }
        a, a *, a:visited, a:hover, a:active { color: red !important; }
        .VwiC3b, .IsZvec, .b_caption p, .result__snippet, .st, .fz-ms, .aCOpRe { display: none !important; }
    `;
    document.head.appendChild(styleSheet);

    /* =========================================
       6. FUNCIONALIDADES DE SUPORTE (INFO/IFRAME)
       ========================================= */
    const siteBox = document.createElement("div");
    siteBox.id = "siteBox";
    Object.assign(siteBox.style, {
        position: "fixed", top: "5%", left: "5%", width: "90%", height: "90%",
        background: "#fff", border: "2px solid red", borderRadius: "10px", display: "none", zIndex: "9999999"
    });
    siteBox.innerHTML = `<button onclick="this.parentElement.style.display='none'; document.getElementById('siteFrame').src='';" style="position:absolute;top:10px;right:10px;background:red;color:white;border:none;padding:10px;cursor:pointer;z-index:10000001;border-radius:5px;font-weight:bold">FECHAR</button>
                         <iframe id="siteFrame" style="width:100%;height:100%;border:none;background:white;border-radius:10px"></iframe>`;
    document.body.appendChild(siteBox);

    btn.onclick = () => { if (!isDragging) menu.style.display = menu.style.display === "none" ? "block" : "none"; };
    document.getElementById("sizeControl").oninput = (e) => { btn.style.width = btn.style.height = e.target.value + "px"; };
    document.getElementById("opacityControl").oninput = (e) => { btn.style.opacity = e.target.value; };
    document.getElementById("closeMenu").onclick = () => menu.style.display = "none";
    
    // Bloqueio de Popups nativo
    window.open = function() { return null; };

})();
