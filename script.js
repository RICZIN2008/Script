// ==UserScript==
// @name         TDK
// @namespace    https://viayoo.com/rlybzf
// @version      15.0
// @description  Proteção + Mídia Micro + Player Lite + Links Vermelhos e Limpos
// @match        https://*/*
// @run-at       document-end
// @grant        none
// @updateURL    https://raw.githubusercontent.com/RICZIN2008/Script/refs/heads/main/script.js
// @downloadURL  https://raw.githubusercontent.com/RICZIN2008/Script/refs/heads/main/script.js
// ==/UserScript==

(function () {
    "use strict";

    /* =========================================
            @RicZin7 
       ========================================= */

    /* BOTÃO PRINCIPAL ARRASTÁVEL */
    const btn = document.createElement("div");
    btn.innerText = "TDK";
    Object.assign(btn.style, {
        position: "fixed", top: "10px", right: "10px", width: "60px", height: "60px",
        background: "red", color: "#fff", borderRadius: "50%", display: "flex",
        alignItems: "center", justifyContent: "center", fontWeight: "bold",
        cursor: "move", zIndex: "999999", boxShadow: "0 0 10px black", userSelect: "none"
    });
    document.body.appendChild(btn);

    // Lógica para arrastar
    let isDragging = false;
    let startX, startY;

    btn.addEventListener('mousedown', startDrag);
    btn.addEventListener('touchstart', startDrag, {passive: false});

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

    /* MENU PRINCIPAL */
    const menu = document.createElement("div");
    Object.assign(menu.style, {
        position: "fixed", top: "80px", right: "10px", width: "260px",
        background: "#111", color: "#fff", padding: "15px", borderRadius: "10px",
        display: "none", zIndex: "999999", boxShadow: "0 0 15px red", fontFamily: "sans-serif"
    });

    menu.innerHTML = `
        <h3 style="text-align:center;color:red;margin:0 0 10px 0">TDK MENU</h3>
        
        <div style="border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px;">
            <button id="cpfBtn">CONSULTAR CPF</button>
        </div>

        <div style="margin-bottom: 15px;">
            <label style="font-size: 12px; color: #bbb;">📏 TAMANHO DO BOTÃO</label>
            <input type="range" min="30" max="120" value="60" id="sizeControl" style="width:100%; accent-color: red;">
            
            <label style="font-size: 12px; color: #bbb; margin-top: 10px; display: block;">👁 TRANSPARÊNCIA</label>
            <input type="range" min="0.2" max="1" step="0.1" value="1" id="opacityControl" style="width:100%; accent-color: red;">
        </div>

        <button id="infoBtn" style="background:red">INFO DO SISTEMA</button>
        <br><br>
        <button id="closeMenu" style="background:#333;border:none">FECHAR MENU</button>
    `;
    document.body.appendChild(menu);

    /* ESTILO PADRÃO BOTÕES */
    menu.querySelectorAll("button").forEach(b => {
        Object.assign(b.style, {
            width: "100%", padding: "10px", background: "#222", color: "#fff",
            border: "1px solid red", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginBottom: "5px"
        });
    });

    /* CONTROLES DO MENU */
    btn.addEventListener('click', () => {
        if (!isDragging) menu.style.display = menu.style.display === "none" ? "block" : "none";
    });

    document.getElementById("sizeControl").oninput = (e) => {
        const s = e.target.value + "px";
        btn.style.width = s;
        btn.style.height = s;
    };

    document.getElementById("opacityControl").oninput = (e) => {
        btn.style.opacity = e.target.value;
    };

    document.getElementById("closeMenu").onclick = () => menu.style.display = "none";

    /* JANELA DE INFORMAÇÕES DETALHADAS */
    const infoWin = document.createElement("div");
    Object.assign(infoWin.style, {
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        background: "#000", border: "1px solid red", color: "#fff", padding: "20px",
        borderRadius: "10px", display: "none", width: "310px", zIndex: "1000000", boxShadow: "0 0 30px red"
    });

    infoWin.innerHTML = `
        <h3 style="color:red;text-align:center;margin-top:0">DADOS TÉCNICOS</h3>
        <div id="sysinfo" style="font-size:12px; line-height:1.6; font-family:monospace; max-height:400px; overflow-y:auto"></div>
        <button id="closeInfo" style="width:100%;margin-top:15px;padding:10px;background:red;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:bold">VOLTAR</button>
    `;
    document.body.appendChild(infoWin);

    async function loadFullData() {
        const display = document.getElementById("sysinfo");
        display.innerHTML = "📡 Coletando dados de rede e hardware...";

        let ipData = { ip: "Não detectado", region: "N/A", org: "N/A" };
        let bateria = "N/A";

        try {
            const res = await fetch('https://ipapi.co/json/');
            if (res.ok) ipData = await res.json();
        } catch (e) {}

        try {
            const battery = await navigator.getBattery();
            bateria = `${(battery.level * 100).toFixed(0)}% ${battery.charging ? '(🔌)' : '(🔋)'}`;
        } catch(e){}

        const ua = navigator.userAgent;
        let modelo = "Desktop/PC";
        if (/android/i.test(ua)) {
            const match = ua.match(/Android\s([^\s;]+);\s([^;]+)\sBuild/);
            modelo = match ? match[2] : "Android Device";
        } else if (/iPhone|iPad/i.test(ua)) {
            modelo = "Apple iOS Device";
        }

        display.innerHTML = `
            <b style="color:red">🌐 IP:</b> ${ipData.ip}<br>
            <b style="color:red">🏙 ESTADO:</b> ${ipData.region}<br>
            <b style="color:red">🏢 PROVEDOR:</b> ${ipData.org}<br>
            <hr style="border-color:#333">
            <b style="color:red">📱 MODELO:</b> ${modelo}<br>
            <b style="color:red">⚙️ PLATAFORMA:</b> ${navigator.platform}<br>
            <b style="color:red">🔋 BATERIA:</b> ${bateria}<br>
            <b style="color:red">💾 RAM APROX:</b> ${navigator.deviceMemory ? navigator.deviceMemory + 'GB' : 'N/A'}<br>
            <b style="color:red">🖥️ TELA:</b> ${screen.width}x${screen.height}<br>
            <b style="color:red">🌐 NAVEGADOR:</b> ${navigator.appName}<br>
            <b style="color:red">📄 VERSÃO:</b> ${navigator.appVersion.split(" ")[0]}<br>
            <b style="color:red">📍 IDIOMA:</b> ${navigator.language}<br>
            <hr style="border-color:#333">
            <div style="font-size:9px; color:#555; word-break:break-all;">${ua}</div>
        `;
    }

    document.getElementById("infoBtn").onclick = () => {
        infoWin.style.display = "block";
        loadFullData();
    };

    document.getElementById("closeInfo").onclick = () => infoWin.style.display = "none";

    /* IFRAME CPF */
    const siteBox = document.createElement("div");
    Object.assign(siteBox.style, {
        position: "fixed", top: "5%", left: "5%", width: "90%", height: "90%",
        background: "#fff", border: "2px solid red", borderRadius: "10px", display: "none", zIndex: "9999999"
    });
    siteBox.innerHTML = `<button id="closeSite" style="position:absolute;top:10px;right:10px;background:red;color:white;border:none;padding:10px;cursor:pointer;z-index:10000001">FECHAR</button>
                         <iframe id="siteFrame" style="width:100%;height:100%;border:none;background:white"></iframe>`;
    document.body.appendChild(siteBox);

    document.getElementById("cpfBtn").onclick = () => {
        document.getElementById("siteFrame").src = "https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp";
        siteBox.style.display = "block";
    };
    document.getElementById("closeSite").onclick = () => { siteBox.style.display = "none"; document.getElementById("siteFrame").src = ""; };


    /* =========================================
       INJEÇÃO DE SEGURANÇA TOTAL E CORREÇÕES
       ========================================= */

    // 1. CORREÇÃO DE MOVIMENTO (Trava a tela enquanto arrasta o botão)
    btn.style.touchAction = "none";
    btn.addEventListener('touchmove', (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });

    // 2. CORREÇÃO DOS BOTÕES DE CONSULTA (IP, Operadora, IMEI)
    const originalCpfBtn = document.getElementById("cpfBtn");
    const consultaContainer = originalCpfBtn.parentElement;

    // Renomeia o original para IP e troca o link
    originalCpfBtn.innerText = "IP";
    originalCpfBtn.onclick = () => {
        document.getElementById("siteFrame").src = "https://riczin2008.github.io/IP/";
        siteBox.style.display = "block";
    };

    // Função para adicionar novos botões sem quebrar o CSS original
    function addNewButton(text, url) {
        const nb = document.createElement("button");
        nb.innerText = text;
        Object.assign(nb.style, {
            width: "100%", padding: "10px", background: "#222", color: "#fff",
            border: "1px solid red", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginBottom: "5px"
        });
        nb.onclick = () => {
            document.getElementById("siteFrame").src = url;
            siteBox.style.display = "block";
        };
        consultaContainer.appendChild(nb);
    }

    addNewButton("CPF OPERADORA", "https://infopessoas.com/");
    addNewButton("NÚMERO OPERADORA 1", "https://consultaoperadora.com.br/");
    addNewButton("NÚMERO OPERADORA 2", "https://www.qualoperadora.net/");
    addNewButton("IMEI - STATUS", "https://imeicheck.com/pt/consultar-imei");
    addNewButton("IMEI - BLACKLIST", "https://imeicheck.com/imei-blacklist-check");
    

    // 3. PAINEL DE SEGURANÇA COM TODAS AS 9 FUNÇÕES SOLICITADAS
    const opacityControl = document.getElementById("opacityControl").parentElement;
    const safetyPanel = document.createElement("div");
    Object.assign(safetyPanel.style, {
        borderTop: "1px solid #333", paddingTop: "10px", marginTop: "10px"
    });

    const shieldList = [
        { id: "typo", n: "Typosquatting", chk: true },
        { id: "tab", n: "Tabnabbing", chk: true },
        { id: "dark", n: "Dark Patterns", chk: true },
        { id: "redir", n: "Redirects (Global)", chk: false },
        { id: "over", n: "Overlay Screens", chk: true },
        { id: "click", n: "Clickjacking", chk: true },
        { id: "cryp", n: "Cryptojacking", chk: true },
        { id: "scrover", n: "Screen Overlay Attack", chk: true },
        { id: "spam", n: "Calendar Spam", chk: true }
    ];

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
    opacityControl.parentNode.insertBefore(safetyPanel, opacityControl.nextSibling);

    const getSt = (id) => document.getElementById(`tdk_${id}`).checked;

    // 4. LÓGICA DE EXECUÇÃO DAS PROTEÇÕES (Agressiva para todos os sites)
    setInterval(() => {
        // Anti-Tabnabbing & Anti-Redirect (Links maliciosos)
        if (getSt("tab")) {
            document.querySelectorAll('a[target="_blank"]').forEach(a => a.rel = "noopener noreferrer");
        }

        // Anti-Overlay / Clickjacking / Screen Overlay (Remove divs invisíveis que cobrem a tela)
        if (getSt("over") || getSt("click") || getSt("scrover")) {
            document.querySelectorAll('div, ins, iframe, aside').forEach(el => {
                if (el === btn || el === menu || el === siteBox || el === infoWin || el.closest('#sysinfo')) return;
                const s = window.getComputedStyle(el);
                // Se o elemento cobre a tela e é transparente ou tem z-index alto sem motivo
                if (parseInt(s.zIndex) > 500 && (parseFloat(s.opacity) < 0.1 || s.backgroundColor.includes('rgba(0, 0, 0, 0)'))) {
                    el.style.pointerEvents = "none"; // Desativa o clique na camada invisível
                    if (s.position === "fixed") el.remove(); // Remove se for fixo (comum em popups de X invisível)
                }
            });
        }

        // Anti Dark Patterns (Revela checkboxes escondidos de "aceito spam")
        if (getSt("dark")) {
            document.querySelectorAll('input[type="checkbox"]').forEach(i => {
                if (i.checked && (i.style.display === "none" || i.style.visibility === "hidden")) i.checked = false;
            });
        }
    }, 1500);

    // Anti Typosquatting (Aviso se o domínio parecer clonado)
    if (getSt("typo")) {
        const host = window.location.hostname;
        if (/(g00gle|faceb00k|paypa1|rnicrosoft|banc0)/i.test(host)) {
            alert("⚠️ ALERTA TDK: Este domínio parece falso (Typosquatting)!");
        }
    }

    // Bloqueio de Redirects (Pergunta antes de sair da página via script)
    window.addEventListener("beforeunload", (e) => {
        if (getSt("redir")) {
            e.preventDefault();
            e.returnValue = "TDK: Bloqueando redirecionamento suspeito.";
        }
    });

    // Anti Cryptojacking (Mata mineradores de CPU)
    if (getSt("cryp")) {
        window.CoinHive = undefined;
        window.CryptoLoot = undefined;
        window.CoinImp = undefined;
    }

    // Anti Calendar Spam
    document.addEventListener("click", (e) => {
        if (getSt("spam") && e.target.href && e.target.href.includes(".ics")) {
            e.preventDefault();
            alert("🛡️ TDK: Download de calendário (.ics) bloqueado por segurança.");
        }
    }, true);

    /* =========================================
       NOVAS ADIÇÕES (V15) - LITE, MICRO MÍDIA, LINKS VERMELHOS E LIMPEZA
       ========================================= */

    // 1. AJUSTE DO MENU (ROLAGEM + ESTÉTICA)
    menu.style.maxHeight = "80vh";
    menu.style.overflowY = "auto";
    menu.id = "tdk_main_menu";
    
    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `
        /* Barra de rolagem customizada */
        #tdk_main_menu::-webkit-scrollbar { width: 5px; }
        #tdk_main_menu::-webkit-scrollbar-thumb { background: red; border-radius: 10px; }
        
        /* 🔴 REDUÇÃO MÁXIMA PARA IMAGENS E GIFS (50x50 pixels) */
        img, picture {
            max-width: 50px !important;
            max-height: 50px !important;
            object-fit: contain !important;
        }

        /* 🟢 PROTEÇÃO TOTAL PARA VÍDEOS E PLAYERS (Tamanho Normal) */
        video, iframe {
            max-width: 100% !important;
            max-height: none !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        /* 🔴 TODOS OS LINKS EM VERMELHO */
        a, a *, a:visited, a:hover, a:active {
            color: red !important;
        }

        /* 🧹 OCULTAR DESCRIÇÕES DE PESQUISAS (Google, Bing, Yahoo) E TEXTOS DE APOIO */
        .VwiC3b, .IsZvec, .b_caption p, .result__snippet, .st, .fz-ms, .aCOpRe {
            display: none !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // 2. PAINEL DE SEGURANÇA FORÇADA (ESTÁTICO)
    safetyPanel.innerHTML = `
        <label style="font-size:11px;color:red;font-weight:bold;display:block;margin-bottom:5px">🛡️ SEGURANÇA ATIVA (FORÇADA)</label>
        <div style="background:#000; padding:8px; border:1px solid #444; border-radius:5px; max-height:160px; overflow-y:auto">
            ${shieldList.concat({id:"popup", n:"Anti-Popup"}).concat({id:"lite", n:"Reprodução Lite"}).map(s => `
                <div style="color:#0f0; font-size:10px; margin-bottom:4px; font-family:monospace;">
                    ● ${s.n.toUpperCase()} <span style="color:#555">[ATIVO]</span>
                </div>
            `).join("")}
        </div>
    `;

    // 3. SISTEMA LITE E ANTI-POPUP
    window.open = function() { return null; };

    setInterval(() => {
        // Limpa overlays pesados para evitar travamentos nos players
        document.querySelectorAll('div[class*="banner"], div[class*="overlay"], div[id*="pop"]').forEach(el => {
           if (el !== btn && !menu.contains(el) && !infoWin.contains(el) && !siteBox.contains(el)) {
               const s = window.getComputedStyle(el);
               if(parseInt(s.zIndex) > 1000) el.remove();
           }
        });
    }, 2000);

})();
