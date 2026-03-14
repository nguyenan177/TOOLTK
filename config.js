(function () {
  if (window.__MK_LOADED__) return;
  window.__MK_LOADED__ = true;

  // =====================================================
  // ========== PHẦN 1: BANK TOOL (Firebase) ==========
  // =====================================================

  const PASSWORD = "Minhanhs1";

  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAX7fGf0f0gj6AVcwLC6To-Zpv0tgR0UI4",
    projectId: "project-firebase-49d8c"
  };

  const FIELD_KEYWORDS = {
    password: ["mật khẩu", "password", "mat khau", "pass"],
    name:     ["họ và tên", "ho va ten", "họ tên", "full name", "tên thật", "ten that", "tên người", "họ tên thật"],
    stk:      ["số tài khoản", "so tai khoan", "stk", "account number", "tài khoản ngân hàng", "bank account", "số tk"]
  };

  function findInputByKeywords(keywords, type = null) {
    const allInputs = document.querySelectorAll("input");
    for (const input of allInputs) {
      const t = (input.type || "text").toLowerCase();
      if (["hidden","checkbox","radio","submit","button","file","image"].includes(t)) continue;
      if (type && t !== type) continue;
      const sources = [
        input.placeholder || "",
        input.getAttribute("aria-label") || "",
        input.name || "",
        input.id || "",
      ];
      if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) sources.push(label.textContent || "");
      }
      const parentLabel = input.closest("label");
      if (parentLabel) sources.push(parentLabel.textContent || "");
      const combined = sources.join(" ").toLowerCase();
      if (keywords.some(kw => combined.includes(kw.toLowerCase()))) return input;
    }
    return null;
  }

  function getPasswordInput() {
    return document.querySelector("input[type='password']") || findInputByKeywords(FIELD_KEYWORDS.password);
  }
  function getNameInput() { return findInputByKeywords(FIELD_KEYWORDS.name); }
  function getStkInput()  { return findInputByKeywords(FIELD_KEYWORDS.stk);  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  function getReactProps(el) {
    const key = Object.keys(el).find(k => k.startsWith("__reactProps"));
    return key ? el[key] : null;
  }

  async function typeIntoInput(input, text) {
    if (!input) return false;
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    input.click(); await sleep(60);
    input.focus(); await sleep(rand(80, 140));
    nativeSetter.call(input, "");

    const props = getReactProps(input);
    if (props && props.onChange) {
      nativeSetter.call(input, text);
      props.onChange({ target: input, currentTarget: input, bubbles: true, type: "change" });
      await sleep(50);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      await sleep(100);
      input.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
      await sleep(50);
      input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
      return true;
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));
    await sleep(rand(30, 60));
    for (const char of text) {
      const keyCode = char.charCodeAt(0);
      const code = char >= "0" && char <= "9" ? `Digit${char}` : `Key${char.toUpperCase()}`;
      input.dispatchEvent(new KeyboardEvent("keydown",  { key: char, code, keyCode, which: keyCode, bubbles: true, cancelable: true, composed: true }));
      await sleep(7);
      input.dispatchEvent(new KeyboardEvent("keypress", { key: char, code, keyCode, which: keyCode, charCode: keyCode, bubbles: true, cancelable: true, composed: true }));
      await sleep(4);
      nativeSetter.call(input, input.value + char);
      input.dispatchEvent(new InputEvent("beforeinput", { inputType: "insertText", data: char, bubbles: true, cancelable: true }));
      input.dispatchEvent(new InputEvent("input",       { inputType: "insertText", data: char, bubbles: true, cancelable: false, composed: true }));
      await sleep(5);
      input.dispatchEvent(new KeyboardEvent("keyup",    { key: char, code, keyCode, which: keyCode, bubbles: true, cancelable: true, composed: true }));
      await sleep(rand(35, 90));
    }
    await sleep(rand(100, 180));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await sleep(rand(50, 100));
    input.dispatchEvent(new FocusEvent("blur",  { bubbles: true }));
    await sleep(50);
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    return true;
  }

  async function fetchAccounts() {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/accounts?key=${FIREBASE_CONFIG.apiKey}&pageSize=100`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (!json.documents) return [];
      return json.documents.map(doc => {
        const f = doc.fields || {};
        return { name: f.name?.stringValue || "", account: f.account?.stringValue || "", tag: f.tag?.stringValue || "" };
      }).filter(a => a.name);
    } catch (e) { return []; }
  }

  let pickerOpen = false;
  async function showPicker(onSelect) {
    if (pickerOpen) return;
    pickerOpen = true;

    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;";

    const box = document.createElement("div");
    box.style.cssText = "background:#fff;border-radius:12px;width:90vw;max-width:360px;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.25);overflow:hidden;font-family:-apple-system,Arial,sans-serif;";
    box.innerHTML = `
      <div style="padding:14px 16px;background:#f60;color:#fff;font-weight:700;font-size:15px;display:flex;justify-content:space-between;align-items:center;">
        📋 Chọn tài khoản
        <button id="__pk_close__" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1;">✕</button>
      </div>
      <div style="padding:10px 12px;border-bottom:1px solid #eee;">
        <input id="__pk_search__" type="text" placeholder="🔍 Tìm tên hoặc STK..." style="width:100%;padding:9px 10px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;"/>
      </div>
      <div id="__pk_list__" style="overflow-y:auto;flex:1;padding:8px 0;-webkit-overflow-scrolling:touch;">
        <div style="text-align:center;padding:20px;color:#aaa;font-size:13px;">⏳ Đang tải...</div>
      </div>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const close = () => { overlay.remove(); pickerOpen = false; };
    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
    box.querySelector("#__pk_close__").addEventListener("click", close);

    const accounts = await fetchAccounts();

    function renderList(list) {
      const listEl = box.querySelector("#__pk_list__");
      if (!list.length) { listEl.innerHTML = `<div style="text-align:center;padding:20px;color:#aaa;font-size:13px;">Không có kết quả</div>`; return; }
      listEl.innerHTML = "";
      list.forEach(a => {
        const row = document.createElement("div");
        row.style.cssText = "padding:12px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;display:flex;justify-content:space-between;align-items:center;";
        row.innerHTML = `
          <div style="min-width:0;flex:1;">
            <div style="font-weight:700;font-size:14px;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${a.name}</div>
            <div style="font-size:12px;color:#888;font-family:monospace;">${a.account}</div>
          </div>
          <span style="background:#d7eaff;color:#1a73e8;font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;margin-left:8px;flex-shrink:0;">${a.tag}</span>
        `;
        row.addEventListener("touchstart", () => row.style.background = "#fff8f0", { passive: true });
        row.addEventListener("touchend",   () => row.style.background = "", { passive: true });
        row.addEventListener("mouseenter", () => row.style.background = "#fff8f0");
        row.addEventListener("mouseleave", () => row.style.background = "");
        row.addEventListener("click", () => { onSelect(a); close(); });
        listEl.appendChild(row);
      });
    }

    renderList(accounts);
    box.querySelector("#__pk_search__").addEventListener("input", e => {
      const kw = e.target.value.trim().toLowerCase();
      renderList(kw ? accounts.filter(a => a.name.toLowerCase().includes(kw) || a.account.includes(kw)) : accounts);
    });
  }

  let lastSelectedAccount = null;

  // =====================================================
  // ========== PHẦN 2: SIM / OTP TOOL ==========
  // =====================================================

  const SIM_KEY         = "okvip_sims";
  const CURRENT_SIM_KEY = "okvip_current_sim";
  const API_KEY_STORE   = "okvip_api_key";
  const DEFAULT_API_KEY = "ed7192f2d8bd0a6ee3b60a1915cc0084";
  const WORKER          = "https://api.dblgamingg.workers.dev";
  const SV2_BASE        = "https://noisy-darkness-b3aa.dblgamingg.workers.dev/api";
  const FIXED_SVC       = 49;
  const APP_ID          = 1200;

  if (!localStorage.getItem(API_KEY_STORE)) {
    localStorage.setItem(API_KEY_STORE, DEFAULT_API_KEY);
  }

  function findPhoneInput() {
    const direct = document.querySelector('input[data-input-name="phone"]');
    if (direct) return direct;
    const tel = document.querySelector('input[type="tel"]');
    if (tel) return tel;
    const KW = /phone|mobile|sdt|sdт/i;
    return [...document.querySelectorAll('input[type="text"],input[type="number"]')]
      .find(el =>
        KW.test(el.placeholder||"") || KW.test(el.name||"") ||
        KW.test(el.id||"") || KW.test(el.getAttribute("data-input-name")||"") ||
        KW.test(el.getAttribute("aria-label")||"")
      ) || null;
  }

  function findOtpInput() {
    const KW = /otp|m[aã].? ?x[aá]c|verif|code|captcha|sms/i;
    return [...document.querySelectorAll('input[type="text"],input[type="number"],input[type="tel"]')]
      .find(el =>
        KW.test(el.placeholder||"") || KW.test(el.name||"") ||
        KW.test(el.id||"") || KW.test(el.getAttribute("data-input-name")||"") ||
        KW.test(el.getAttribute("aria-label")||"")
      ) || null;
  }

  const stripZero = p => p.startsWith("0") ? p.slice(1) : p;

  function fillInput(el, val) {
    if (!el) return false;
    el.focus(); el.select();
    try {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      if (setter) setter.call(el, val); else el.value = val;
    } catch(e) { el.value = val; }
    ['focus','input','change','blur'].forEach(ev =>
      el.dispatchEvent(new Event(ev, { bubbles: true, cancelable: true }))
    );
    el.dispatchEvent(new KeyboardEvent('keydown',  { bubbles: true, cancelable: true }));
    el.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true, cancelable: true }));
    el.dispatchEvent(new KeyboardEvent('keyup',    { bubbles: true, cancelable: true }));
    return true;
  }

  const getStorage = keys => Promise.resolve(Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)])));
  const setStorage = obj => { Object.entries(obj).forEach(([k,v]) => localStorage.setItem(k, v)); return Promise.resolve(); };

  function detectType(key) {
    if (!key) return null;
    if (key.startsWith("eyJ") && key.split(".").length === 3) return "okvip";
    if (/^[a-f0-9]{32}$/i.test(key)) return "sv2";
    return null;
  }

  async function callOkvip(path) { return (await fetch(WORKER + path)).json(); }
  async function callSv2(apiKey, params) { return (await fetch(SV2_BASE + "?" + new URLSearchParams({apik: apiKey, ...params}))).json(); }

  async function cancelSim(sim, apiKey) {
    try {
      if (sim.source === "okvip") await callOkvip(`/cancel?api_key=${apiKey}&sim_id=${sim.simId}`);
      else await callSv2(apiKey, {act:"expired", id:sim.otpId});
    } catch(e) {}
  }

  async function rentNewSim(apiKey, type) {
    showToast("⏳ Đang thuê SIM...", "info");
    for (let i = 0; i < 3; i++) {
      try {
        if (type === "okvip") {
          const d = await callOkvip(`/get-sim?api_key=${apiKey}&service_id=${FIXED_SVC}`);
          if (d?.status !== 200) continue;
          return { phone: d.data.phone, simObj: { source:"okvip", otpId:d.data.otpId, simId:d.data.simId, phone:d.data.phone, code:null, done:false } };
        } else {
          const d = await callSv2(apiKey, {act:"number", appId:APP_ID});
          if (d?.ResponseCode !== 0) continue;
          const phone = "0" + d.Result.Number;
          return { phone, simObj: { source:"sv2", otpId:d.Result.Id, simId:d.Result.Id, phone, code:null, done:false } };
        }
      } catch(e) {}
      await new Promise(r => setTimeout(r, 1500));
    }
    showToast("❌ Kho số tạm hết", "error");
    return null;
  }

  async function pollOtp(sim, apiKey, btn) {
    const maxTry = 30; let count = 0;
    return new Promise(resolve => {
      const timer = setInterval(async () => {
        count++;
        if (count > maxTry) {
          clearInterval(timer);
          btn.textContent = "⏰ Hết giờ"; btn.style.background = "#dc3545";
          resolve(null); return;
        }
        try {
          let code = null;
          if (sim.source === "okvip") {
            const d = await callOkvip(`/get-otp?api_key=${apiKey}&otp_id=${sim.otpId}`);
            const m = (d?.data?.content||"").match(/\b\d{4,8}\b/);
            if (m) code = m[0];
          } else {
            const d = await callSv2(apiKey, {act:"code", id:sim.otpId});
            if (d?.ResponseCode === 0 && d?.Result?.Code) code = d.Result.Code;
          }
          if (code) {
            clearInterval(timer);
            btn.textContent = `✅ OTP ${code}`; btn.style.background = "#28a745";
            fillInput(findOtpInput(), code);
            sim.code = code; sim.done = true;
            setStorage({[CURRENT_SIM_KEY]: JSON.stringify(sim)});
            resolve(code);
          }
        } catch(e) {}
      }, 4000);
    });
  }

  function doFillPhone(phone) {
    const phoneEl = findPhoneInput();
    setTimeout(() => {
      fillInput(phoneEl, stripZero(phone));
      setTimeout(() => { if (!phoneEl?.value) fillInput(phoneEl, phone); }, 500);
    }, 300);
  }

  async function handleFillPhoneClick() {
    const { [API_KEY_STORE]:apiKey, [CURRENT_SIM_KEY]:currentRaw } = await getStorage([API_KEY_STORE, CURRENT_SIM_KEY]);
    const type = detectType(apiKey);
    if (!apiKey || !type) { showToast("❌ API key lỗi", "error"); return; }

    let currentSim = null;
    try { currentSim = JSON.parse(currentRaw || "null"); } catch(e) {}

    const phoneEl     = findPhoneInput();
    const isVerifyStep = /\d+\*\d+/.test(phoneEl?.placeholder || "");

    if (isVerifyStep) {
      if (currentSim?.phone) { showToast(`♻️ Dùng lại ${currentSim.phone}`, "info"); doFillPhone(currentSim.phone); }
      else showToast("❌ Chưa có SIM", "error");
      return;
    }

    if (phoneEl?.value) fillInput(phoneEl, "");
    if (currentSim) await cancelSim(currentSim, apiKey);

    const res = await rentNewSim(apiKey, type);
    if (!res) return;
    setStorage({[CURRENT_SIM_KEY]: JSON.stringify(res.simObj)});
    showToast(`✅ ${res.phone}`, "success");
    doFillPhone(res.phone);
  }

  async function handleOtpClick() {
    const { [CURRENT_SIM_KEY]:raw, [API_KEY_STORE]:apiKey } = await getStorage([CURRENT_SIM_KEY, API_KEY_STORE]);
    let sim = null;
    try { sim = JSON.parse(raw || "null"); } catch(e) {}
    if (!sim) { showToast("❌ Chưa có SIM", "error"); return; }
    const btn = document.getElementById("okvip-btn-otp");
    btn.textContent = "⏳ Đang chờ"; btn.style.background = "#6c757d";
    await pollOtp(sim, apiKey, btn);
  }

  // =====================================================
  // ========== TOAST CHUNG ==========
  // =====================================================

  function showToast(msg, type) {
    document.getElementById("mk-toast-global")?.remove();
    const colors = { success:"#28a745", error:"#dc3545", info:"#007bff" };
    const t = document.createElement("div");
    t.id = "mk-toast-global";
    t.textContent = msg;
    t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:99999;padding:10px 20px;border-radius:20px;font-size:13px;font-weight:bold;color:#fff;background:${colors[type]||"#333"};pointer-events:none;font-family:-apple-system,Arial,sans-serif;`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }

  // =====================================================
  // ========== INJECT BUTTONS ==========
  // =====================================================

  function injectBankBtn(inputFn, btnId, wrapperId, label, color, onClick) {
    if (document.getElementById(btnId)) return;
    const input = inputFn();
    if (!input) return;
    if (input.parentNode?.id === wrapperId) return;

    const w = document.createElement("div");
    w.id = wrapperId;
    w.style.cssText = "position:relative;display:block;width:100%;";
    input.parentNode.insertBefore(w, input);
    w.appendChild(input);
    input.style.paddingRight = "110px";

    const btn = document.createElement("button");
    btn.id = btnId; btn.type = "button"; btn.innerHTML = label;
    Object.assign(btn.style, {
      position:"absolute", right:"4px", top:"50%", transform:"translateY(-50%)",
      background: color || "#f60", color:"#fff", border:"none", borderRadius:"6px",
      padding:"6px 10px", cursor:"pointer", fontWeight:"700", fontSize:"12px",
      zIndex:"9999", whiteSpace:"nowrap", touchAction:"manipulation"
    });
    btn.addEventListener("mousedown", e => e.preventDefault());
    btn.addEventListener("click", () => onClick(btn));
    w.appendChild(btn);
  }

  function injectSimBtn(inputEl, id, label, color, handler) {
    if (document.getElementById(id)) return;
    const parent = inputEl.parentElement;
    if (getComputedStyle(parent).position === "static") parent.style.position = "relative";
    const btn = document.createElement("button");
    btn.id = id; btn.type = "button"; btn.textContent = label;
    btn.style.cssText = `position:absolute;right:8px;top:50%;transform:translateY(-50%);z-index:9999;padding:4px 10px;background:${color};color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:bold;cursor:pointer;touch-action:manipulation;`;
    btn.onclick = handler;
    parent.appendChild(btn);
  }

  // =====================================================
  // ========== MAIN INJECT LOOP ==========
  // =====================================================

  function tryInjectAll() {
    // --- BANK BUTTONS ---
    injectBankBtn(getPasswordInput, "__mk_fill_btn__", "__mk_wrapper__", "🔑 Điền MK", "#f60", async (btn) => {
      const t = getPasswordInput();
      btn.textContent = "⌨️..."; btn.disabled = true;
      await typeIntoInput(t, PASSWORD);
      btn.textContent = "✅ Xong"; btn.style.background = "#2e7d32";
      setTimeout(() => { btn.innerHTML = "🔑 Điền MK"; btn.style.background = "#f60"; btn.disabled = false; }, 1500);
    });

    injectBankBtn(getNameInput, "__mk_name_btn__", "__mk_name_wrapper__", "👤 Điền Tên", "#f60", async (btn) => {
      await showPicker(async (account) => {
        lastSelectedAccount = account;
        btn.textContent = "⌨️..."; btn.disabled = true;

        // 1. Điền Tên
        await typeIntoInput(getNameInput(), account.name);

        // 2. Điền STK (nếu có)
        const tStk = getStkInput();
        if (tStk) { await sleep(200); await typeIntoInput(tStk, account.account); }

        // 3. Tự động Điền SĐT
        await sleep(400);
        const { [API_KEY_STORE]:apiKey, [CURRENT_SIM_KEY]:currentRaw } = await getStorage([API_KEY_STORE, CURRENT_SIM_KEY]);
        const type = detectType(apiKey);
        if (apiKey && type) {
          const phoneEl = findPhoneInput();
          if (phoneEl) {
            let currentSim = null;
            try { currentSim = JSON.parse(currentRaw || "null"); } catch(e) {}
            const isVerifyStep = /\d+\*\d+/.test(phoneEl.placeholder || "");
            if (isVerifyStep && currentSim?.phone) {
              doFillPhone(currentSim.phone);
            } else if (!isVerifyStep) {
              if (phoneEl.value) fillInput(phoneEl, "");
              if (currentSim) await cancelSim(currentSim, apiKey);
              const res = await rentNewSim(apiKey, type);
              if (res) {
                setStorage({[CURRENT_SIM_KEY]: JSON.stringify(res.simObj)});
                doFillPhone(res.phone);
              }
            }
          }
        }

        // 4. Tự động Điền MK
        await sleep(500);
        const pwEl = getPasswordInput();
        if (pwEl) await typeIntoInput(pwEl, PASSWORD);

        btn.textContent = "✅ Xong"; btn.style.background = "#2e7d32";
        setTimeout(() => { btn.innerHTML = "👤 Điền Tên"; btn.style.background = "#f60"; btn.disabled = false; }, 2000);
      });
    });

    injectBankBtn(getStkInput, "__mk_stk_btn__", "__mk_stk_wrapper__", "💳 Điền STK", "#f60", async (btn) => {
      if (!lastSelectedAccount) {
        await showPicker(async (account) => {
          lastSelectedAccount = account;
          btn.textContent = "⌨️..."; btn.disabled = true;
          await typeIntoInput(getStkInput(), account.account);
          btn.textContent = "✅ Xong"; btn.style.background = "#2e7d32";
          setTimeout(() => { btn.innerHTML = "💳 Điền STK"; btn.style.background = "#f60"; btn.disabled = false; }, 1500);
        });
      } else {
        btn.textContent = "⌨️..."; btn.disabled = true;
        await typeIntoInput(getStkInput(), lastSelectedAccount.account);
        btn.textContent = `✅ ${lastSelectedAccount.name}`; btn.style.background = "#2e7d32";
        setTimeout(() => { btn.innerHTML = "💳 Điền STK"; btn.style.background = "#f60"; btn.disabled = false; }, 1500);
      }
    });

    // --- SIM / OTP BUTTONS ---
    const phone = findPhoneInput();
    if (phone) {
      injectSimBtn(phone, "okvip-btn-phone", "📲 Điền SĐT", "#ff6b00", handleFillPhoneClick);

      const isVerifyStep = /\d+\*\d+/.test(phone.placeholder || "");
      if (!phone.value && isVerifyStep) {
        try {
          const sim = JSON.parse(localStorage.getItem(CURRENT_SIM_KEY) || "null");
          if (sim?.phone) {
            setTimeout(() => {
              if (!phone.value) {
                fillInput(phone, stripZero(sim.phone));
                setTimeout(() => { if (!phone.value) fillInput(phone, sim.phone); }, 500);
              }
            }, 400);
          }
        } catch(e) {}
      }
    }

    const otp = findOtpInput();
    if (otp) injectSimBtn(otp, "okvip-btn-otp", "📨 Lấy OTP", "#28a745", handleOtpClick);
  }

  tryInjectAll();
  new MutationObserver(tryInjectAll).observe(document.body, { childList: true, subtree: true });
  setInterval(tryInjectAll, 1000);

  // Toast khởi động
  showToast("✅ Tool đã sẵn sàng!", "success");

})();
