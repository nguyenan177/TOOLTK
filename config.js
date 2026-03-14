(function () {
  if (window.__MK_LOADED__) return;
  window.__MK_LOADED__ = true;

  // =====================================================
  // ========== PHẦN 1: BANK TOOL (Firebase) ==========
  // =====================================================

  const PASSWORD = "PHiMsexnhats1";
  const WITHDRAW_PASSWORD = "1";

  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAX7fGf0f0gj6AVcwLC6To-Zpv0tgR0UI4",
    projectId: "project-firebase-49d8c"
  };

  const FIELD_KEYWORDS = {
    password: ["mật khẩu", "password", "mat khau", "pass"],
    withdraw: ["mật khẩu rút tiền", "mat khau rut tien", "xác nhận mật khẩu rút", "withdraw password", "rút tiền"],
    name:     ["họ và tên", "ho va ten", "họ tên", "full name", "tên thật", "ten that", "tên người", "họ tên thật"],
    stk:      ["số tài khoản ngân hàng", "so tai khoan ngan hang", "stk", "account number", "bank account", "số tk ngân hàng", "nhập số tài khoản"],
    username: ["tên tài khoản", "ten tai khoan", "username", "tài khoản", "tai khoan", "đăng nhập", "login", "nhập tên tài khoản", "account"],
    email:    ["email", "e-mail", "địa chỉ email", "dia chi email", "gmail"]
  };

  // ========== TỈNH THÀNH ==========
  const PROVINCES_34 = [
    "Hà Nội","Hồ Chí Minh","Hải Phòng","Đà Nẵng","Cần Thơ",
    "An Giang","Bà Rịa - Vũng Tàu","Bắc Giang","Bắc Kạn","Bạc Liêu",
    "Bắc Ninh","Bến Tre","Bình Dương","Bình Phước","Bình Thuận",
    "Cà Mau","Đắk Lắk","Đắk Nông","Điện Biên","Đồng Nai",
    "Đồng Tháp","Gia Lai","Hà Giang","Hà Nam","Hà Tĩnh",
    "Hải Dương","Hậu Giang","Hòa Bình","Hưng Yên","Khánh Hòa",
    "Kiên Giang","Kon Tum","Lai Châu","Lạng Sơn"
  ];

  const PROVINCES_63 = [
    "Hà Nội","Hồ Chí Minh","Hải Phòng","Đà Nẵng","Cần Thơ",
    "An Giang","Bà Rịa - Vũng Tàu","Bắc Giang","Bắc Kạn","Bạc Liêu",
    "Bắc Ninh","Bến Tre","Bình Định","Bình Dương","Bình Phước",
    "Bình Thuận","Cà Mau","Cao Bằng","Đắk Lắk","Đắk Nông",
    "Điện Biên","Đồng Nai","Đồng Tháp","Gia Lai","Hà Giang",
    "Hà Nam","Hà Tĩnh","Hải Dương","Hậu Giang","Hòa Bình",
    "Hưng Yên","Khánh Hòa","Kiên Giang","Kon Tum","Lai Châu",
    "Lâm Đồng","Lạng Sơn","Lào Cai","Long An","Nam Định",
    "Nghệ An","Ninh Bình","Ninh Thuận","Phú Thọ","Phú Yên",
    "Quảng Bình","Quảng Nam","Quảng Ngãi","Quảng Ninh","Quảng Trị",
    "Sóc Trăng","Sơn La","Tây Ninh","Thái Bình","Thái Nguyên",
    "Thanh Hóa","Thừa Thiên Huế","Tiền Giang","Trà Vinh","Tuyên Quang",
    "Vĩnh Long","Vĩnh Phúc","Yên Bái"
  ];

  function getCityInput() {
    // 1. Ưu tiên formcontrolname="city"
    const byFC = document.querySelector('input[formcontrolname="city"]');
    if (byFC) return byFC;
    // 2. Tìm theo placeholder chứa "thành phố" hoặc "tỉnh"
    const byPH = [...document.querySelectorAll('input')].find(el =>
      /thành phố|thanh pho|tỉnh thành|tinh thanh|city|province/i.test(el.placeholder||"")
    );
    if (byPH) return byPH;
    // 3. Tìm theo keyword rộng hơn
    const KW = /city|province|tỉnh|tinh/i;
    return [...document.querySelectorAll('input')].find(el => {
      if (["hidden","checkbox","radio","submit","button","file","image"].includes((el.type||"text").toLowerCase())) return false;
      return KW.test(el.placeholder||"") || KW.test(el.name||"") ||
             KW.test(el.id||"") || KW.test(el.getAttribute("formcontrolname")||"") ||
             KW.test(el.getAttribute("aria-label")||"");
    }) || null;
  }

  // ========== NICK GEN ==========
  const NICK_PREFIXES  = ["vip","pro","king","god","hot","ace","top","win","gg","xin","dep","real","the","mr","ms","boss","cool","best","vn","x"];
  const NICK_SUFFIXES  = ["vip","pro","king","gg","win","official","real","vn","x","gaming","tv","plus","ez","op"];

  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D");
  }

  function parseName(fullName) {
    const parts = removeDiacritics(fullName).toLowerCase().trim().split(/\s+/);
    const first  = parts[parts.length - 1];
    const last   = parts[0];
    const middle = parts.length > 2 ? parts.slice(1, -1).join("") : "";
    return { first, last, middle, parts };
  }

  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function randPad(n)   { return String(randInt(0,99)).padStart(n,"0"); }
  function randDDMM()   { const d=randInt(1,28),m=randInt(1,12); return String(d).padStart(2,"0")+String(m).padStart(2,"0"); }
  function pickRand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function genNickOptions(fullName) {
    const { first, last, parts } = parseName(fullName);
    const pre = pickRand(NICK_PREFIXES);
    const suf = pickRand(NICK_SUFFIXES);
    const ddmm = randDDMM();
    const r2 = randPad(2);
    const r4 = String(randInt(1000,9999));
    const midInitials = parts.slice(1,-1).map(p=>p[0]).join("");

    return [
      { label: "Họ + tiền tố + 2 số",        value: `${last}${pre}${r2}` },
      { label: "Tên + tiền tố",               value: `${first}${pre}` },
      { label: "Họ + tên + 2 số",             value: `${last}${first}${r2}` },
      { label: "Họ + ngày sinh (ddmm)",        value: `${last}${ddmm}` },
      { label: "Tên + ngày sinh",             value: `${first}${ddmm}` },
      { label: "Họ + tên + ngày sinh",        value: `${last}${first}${ddmm}` },
      { label: "Họ + đệm viết tắt + tên",    value: `${last}${midInitials}${first}` },
      { label: "Tiền tố + họ + tên",          value: `${pre}${last}${first}` },
      { label: "Họ + tên + hậu tố",           value: `${last}${first}${suf}` },
      { label: "Họ + 4 số",                   value: `${last}${r4}` },
      { label: "Tên + 4 số",                  value: `${first}${r4}` },
      { label: "Họ + tên + 4 số",             value: `${last}${first}${r4}` },
      { label: "Chỉ họ",                      value: `${last}` },
      { label: "Chỉ tên",                     value: `${first}` },
    ];
  }

  // ========== EMAIL GEN ==========
  const EMAIL_DOMAINS = ["gmail.com","gmail.com","gmail.com","gmail.com","gmail.com"];
  const EMAIL_WORDS   = ["vip","pro","win","top","ace","king","real","hot","gg","x","plus","ez","ok","88","68","99","2k","nx"];

  function genEmailOptions(fullName) {
    const { first, last } = parseName(fullName);
    const w = pickRand(EMAIL_WORDS);
    const r2 = randPad(2);
    const r4 = String(randInt(1000,9999));
    const ddmm = randDDMM();
    const dom = pickRand(EMAIL_DOMAINS);
    return [
      { label: "Họ + tên + 2 số",        value: `${last}${first}${r2}@${dom}` },
      { label: "Họ + tên + 4 số",        value: `${last}${first}${r4}@${dom}` },
      { label: "Tên + từ + 2 số",        value: `${first}${w}${r2}@${dom}` },
      { label: "Họ + từ + 4 số",         value: `${last}${w}${r4}@${dom}` },
      { label: "Họ + tên + ngày sinh",   value: `${last}${first}${ddmm}@${dom}` },
      { label: "Tên + ngày sinh",        value: `${first}${ddmm}@${dom}` },
      { label: "Họ + ngày sinh + 2 số",  value: `${last}${ddmm}${r2}@${dom}` },
      { label: "Họ + tên",               value: `${last}${first}@${dom}` },
    ];
  }

  function getEmailInput() {
    const byFC = document.querySelector('input[formcontrolname="email"], input[placeholder="Địa chỉ Email"], input[placeholder="Email"], input[placeholder="Nhập Email"], input[placeholder="Nhập email"]');
    if (byFC) return byFC;
    return findInputByKeywords(FIELD_KEYWORDS.email);
  }

  function getUsernameInput() {
    const byData = document.querySelector('input[data-input-name="account"], input[data-input-name="username"]');
    if (byData) return byData;
    return findInputByKeywords(FIELD_KEYWORDS.username);
  }

  async function showNickPicker(fullName, onSelect) {
    let currentOptions = genNickOptions(fullName);

    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;";

    const box = document.createElement("div");
    box.style.cssText = "background:#fff;border-radius:12px;width:90vw;max-width:380px;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.25);overflow:hidden;font-family:-apple-system,Arial,sans-serif;";
    box.innerHTML = `
      <div style="padding:12px 16px;background:#1a73e8;color:#fff;font-weight:700;font-size:14px;display:flex;justify-content:space-between;align-items:center;">
        🆔 Chọn Username
        <button id="__nk_close__" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1;">✕</button>
      </div>
      <div style="padding:6px 12px;background:#e8f0fe;font-size:12px;color:#1a73e8;font-weight:600;">
        👤 <b>${fullName}</b>
      </div>
      <div id="__nk_list__" style="overflow-y:auto;flex:1;padding:4px 0;-webkit-overflow-scrolling:touch;"></div>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    function renderOptions(opts) {
      const listEl = box.querySelector("#__nk_list__");
      listEl.innerHTML = "";
      opts.forEach((o, idx) => {
        const row = document.createElement("div");
        row.style.cssText = "padding:8px 10px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:8px;";
        row.innerHTML = `
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:13px;color:#111;font-family:monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" id="__nk_val_${idx}__">${o.value}</div>
            <div style="font-size:10px;color:#999;margin-top:1px;">${o.label}</div>
          </div>
          <button data-idx="${idx}" class="__nk_pick__" style="padding:5px 10px;background:#1a73e8;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;white-space:nowrap;">✅ Chọn</button>
          <button data-idx="${idx}" class="__nk_rand__" style="padding:5px 8px;background:#f0ad4e;color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;flex-shrink:0;">🎲</button>
        `;
        listEl.appendChild(row);
      });

      listEl.querySelectorAll(".__nk_pick__").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.idx);
          onSelect(currentOptions[idx].value);
          close();
        });
      });

      listEl.querySelectorAll(".__nk_rand__").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.idx);
          const freshAll = genNickOptions(fullName);
          currentOptions[idx] = freshAll[idx];
          const valEl = listEl.querySelector(`#__nk_val_${idx}__`);
          if (valEl) valEl.textContent = currentOptions[idx].value;
        });
      });
    }

    const close = () => overlay.remove();
    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
    box.querySelector("#__nk_close__").addEventListener("click", close);

    renderOptions(currentOptions);
  }

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

  const WITHDRAW_FCNAMES = ["newPassword","confirm","newpassword","confirmpassword","oldPassword","oldpassword"];

  function isWithdrawInput(el) {
    if (!el) return false;
    const fc = el.getAttribute("formcontrolname") || "";
    if (WITHDRAW_FCNAMES.includes(fc)) return true;
    const ph = el.placeholder || "";
    if (/mật khẩu rút|mat khau rut|xác nhận.*mật khẩu|withdraw/i.test(ph)) return true;
    return false;
  }

  function getPasswordInput() {
    const all = [...document.querySelectorAll("input[type='password'], input[type='text']")];
    // Tìm ô password thật — không phải withdraw
    const pw = all.find(el => {
      if (isWithdrawInput(el)) return false;
      if (el.type === "password") return true;
      const sources = [el.placeholder||"", el.getAttribute("aria-label")||"", el.name||"", el.id||""].join(" ").toLowerCase();
      return FIELD_KEYWORDS.password.some(kw => sources.includes(kw.toLowerCase()));
    });
    return pw || null;
  }

  function getWithdrawInputs() {
    // Ưu tiên formcontrolname cụ thể
    const byFC = [
      document.querySelector('input[formcontrolname="newPassword"]'),
      document.querySelector('input[formcontrolname="confirm"]'),
    ].filter(Boolean);
    if (byFC.length) return byFC;
    // Fallback: tìm theo placeholder
    const KW = /mật khẩu rút|mat khau rut|xác nhận.*mật khẩu rút|withdraw.*pass/i;
    return [...document.querySelectorAll('input')].filter(el =>
      KW.test(el.placeholder || "") || KW.test(el.getAttribute("aria-label") || "")
    );
  }

  function clickEyeIcon(inputEl) {
    // Tìm icon mắt trong cùng container với input
    const container = inputEl.closest("fieldset, div, label, section") || inputEl.parentElement;
    if (!container) return;
    const eye = container.querySelector('i.fa-eye, i[class*="eye"], i[class*="icon-eye"]');
    if (eye) eye.click();
  }
  function getNameInput() { return findInputByKeywords(FIELD_KEYWORDS.name); }
  function getStkInput() {
    // formcontrolname="account" chỉ là STK nếu placeholder có dãy số dài (≥6 số liên tiếp)
    const byFC = document.querySelector('input[formcontrolname="account"]');
    if (byFC) {
      const ph = byFC.placeholder || "";
      if (/\d{6,}/.test(ph)) return byFC; // "9704361234567890" → STK
    }
    return findInputByKeywords(FIELD_KEYWORDS.stk);
  }

  function getUsernameInput() {
    // data-input-name ưu tiên cao nhất
    const byData = document.querySelector('input[data-input-name="account"], input[data-input-name="username"]');
    if (byData) return byData;
    // formcontrolname="account" là username nếu placeholder có chữ "tên" hoặc KHÔNG có dãy số dài
    const byFC = document.querySelector('input[formcontrolname="account"]');
    if (byFC) {
      const ph = byFC.placeholder || "";
      if (/tên|ten|username/i.test(ph)) return byFC;  // "Vui lòng nhập tên tài khoản" → username
      if (/\d{6,}/.test(ph)) return null;              // có số dài → là STK, không phải username
    }
    return findInputByKeywords(FIELD_KEYWORDS.username);
  }

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

  const LAST_ACCOUNT_KEY = "okvip_last_account";

  // Load lại từ localStorage hoặc sessionStorage
  let lastSelectedAccount = (() => {
    try {
      const v = localStorage.getItem(LAST_ACCOUNT_KEY) || sessionStorage.getItem(LAST_ACCOUNT_KEY);
      return JSON.parse(v || "null");
    } catch(e) { return null; }
  })();

  function setLastAccount(account) {
    lastSelectedAccount = account;
    try { localStorage.setItem(LAST_ACCOUNT_KEY, JSON.stringify(account)); } catch(e) {}
    try { sessionStorage.setItem(LAST_ACCOUNT_KEY, JSON.stringify(account)); } catch(e) {}
    // Cập nhật label nút STK nếu đang hiển thị
    const stkBtn = document.getElementById("__mk_stk_btn__");
    if (stkBtn) {
      stkBtn.innerHTML = `💳 ${account.name.split(" ").pop()}`;
      stkBtn.style.background = "#2e7d32";
      setTimeout(() => { stkBtn.innerHTML = "💳 Điền STK"; stkBtn.style.background = "#f60"; }, 2000);
    }
  }

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

  // ========== FIX: findPhoneInput loại trừ input STK ==========
  const STK_EXCLUDE = /tài khoản ngân hàng|so tai khoan|số tài khoản|account number|bank account|stk/i;

  function findPhoneInput() {
    // 1. Tìm theo data attribute
    const direct = document.querySelector('input[data-input-name="phone"]');
    if (direct) return direct;
    // 2. Tìm theo class mobile-input
    const byClass = document.querySelector('input.mobile-input, input[class*="mobile-input"], input[class*="phone-input"]');
    if (byClass) return byClass;
    // 3. Tìm theo type=tel
    const tel = document.querySelector('input[type="tel"]');
    if (tel) return tel;
    // 4. Tìm theo keyword — loại trừ input STK
    const KW = /phone|mobile|sdt|điện thoại|dien thoai|số đt|nhập sđt|nhap sdt|nhập số điện|nhap so dien|số điện|so dien/i;
    const all = [...document.querySelectorAll('input[type="text"],input[type="number"],input[type="tel"]')];
    const byAttr = all.find(el => {
      const combined = [
        el.placeholder||"", el.name||"", el.id||"",
        el.getAttribute("data-input-name")||"",
        el.getAttribute("aria-label")||"",
        el.className||""
      ].join(" ");
      if (STK_EXCLUDE.test(combined)) return false; // ❌ bỏ qua input STK
      return KW.test(combined);
    });
    if (byAttr) return byAttr;
    // 5. Tìm theo label hoặc container — loại trừ input STK
    for (const el of all) {
      const attrCombined = [el.placeholder||"", el.name||"", el.id||""].join(" ");
      if (STK_EXCLUDE.test(attrCombined)) continue; // ❌ bỏ qua input STK
      if (el.id) {
        const lbl = document.querySelector(`label[for="${el.id}"]`);
        if (lbl && KW.test(lbl.textContent||"")) return el;
      }
      const parentLbl = el.closest("label");
      if (parentLbl && KW.test(parentLbl.textContent||"")) return el;
      const container = el.closest("div,li,td,tr,section");
      if (container && KW.test(container.textContent||"")) return el;
    }
    return null;
  }

  function findOtpInput() {
    const byData = document.querySelector('input[data-input-name="phoneCode"], input[data-input-name="otp"], input[data-input-name="sms"]');
    if (byData) return byData;
    const bySms = [...document.querySelectorAll('input')].find(el =>
      /nhập mã sms|nhap ma sms/i.test(el.placeholder||"")
    );
    if (bySms) return bySms;
    const KW = /otp|m[aã].? ?x[aá]c|verif|captcha|sms/i;
    return [...document.querySelectorAll('input[type="text"],input[type="number"],input[type="tel"]')]
      .find(el => {
        if (el.getAttribute("formcontrolname") === "checkCode") return false;
        return KW.test(el.placeholder||"") || KW.test(el.name||"") ||
               KW.test(el.id||"") || KW.test(el.getAttribute("data-input-name")||"") ||
               KW.test(el.getAttribute("aria-label")||"");
      }) || null;
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
    if (!phoneEl) return;
    fillInput(phoneEl, stripZero(phone));
    setTimeout(async () => {
      if (!phoneEl.value) await typeIntoInput(phoneEl, stripZero(phone));
      setTimeout(async () => {
        if (!phoneEl.value) await typeIntoInput(phoneEl, phone);
      }, 500);
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
    if (isWithdrawInput(input)) return; // ❌ không inject vào ô withdraw
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
      if (!t) return;
      btn.textContent = "⌨️..."; btn.disabled = true;
      await typeIntoInput(t, PASSWORD);
      btn.textContent = "✅ Xong"; btn.style.background = "#2e7d32";
      setTimeout(() => { btn.innerHTML = "🔑 Điền MK"; btn.style.background = "#f60"; btn.disabled = false; }, 1500);
    });

    // --- MẬT KHẨU RÚT TIỀN ---
    (function injectWithdrawPw() {
      const wdInputs = getWithdrawInputs();
      wdInputs.forEach((el, idx) => {
        const btnId = `__mk_wdpw_btn_${idx}__`;
        if (document.getElementById(btnId)) return;
        if (el.closest(`#__mk_wdpw_wrap_${idx}__`)) return;

        const parent = el.parentElement;
        if (!parent) return;
        if (getComputedStyle(parent).position === "static") parent.style.position = "relative";

        el.style.paddingRight = "110px";
        el.style.boxSizing = "border-box";

        const btn = document.createElement("button");
        btn.id = btnId;
        btn.type = "button";
        btn.innerHTML = "🔒 MK Rút";
        btn.style.cssText = "position:absolute;right:36px;top:50%;transform:translateY(-50%);background:#e91e63;color:#fff;border:none;border-radius:6px;padding:5px 8px;cursor:pointer;font-weight:700;font-size:11px;z-index:9999;white-space:nowrap;touch-action:manipulation;";
        btn.addEventListener("mousedown", e => e.preventDefault());
        btn.addEventListener("click", async () => {
          btn.textContent = "⌨️..."; btn.disabled = true;
          // Click icon mắt để hiện ô nhập (nếu đang ẩn)
          clickEyeIcon(el);
          await sleep(150);
          await typeIntoInput(el, WITHDRAW_PASSWORD);
          btn.textContent = "✅"; btn.style.background = "#2e7d32";
          setTimeout(() => { btn.innerHTML = "🔒 MK Rút"; btn.style.background = "#e91e63"; btn.disabled = false; }, 1500);
        });
        parent.appendChild(btn);
      });
    })();

    injectBankBtn(getNameInput, "__mk_name_btn__", "__mk_name_wrapper__", "👤 Điền Tên", "#f60", async (btn) => {
      await showPicker(async (account) => {
        setLastAccount(account);
        btn.textContent = "⌨️..."; btn.disabled = true;

        // 1. Điền Tên
        await typeIntoInput(getNameInput(), account.name);

        // 2. Tự động Random Gmail và điền
        await sleep(200);
        const emailEl2 = getEmailInput();
        if (emailEl2) {
          const emailOpts = genEmailOptions(account.name);
          const emailPick = emailOpts[Math.floor(Math.random() * emailOpts.length)];
          await typeIntoInput(emailEl2, emailPick.value);
        }

        // 3. Tự động Random TK và điền
        await sleep(200);
        const userEl = getUsernameInput();
        if (userEl) {
          const opts = genNickOptions(account.name);
          const pick = opts[Math.floor(Math.random() * opts.length)];
          await typeIntoInput(userEl, pick.value);
          showToast("🎲 TK: " + pick.value, "info");
        } else {
          const fallbackEl = document.querySelector('input[data-input-name="account"]');
          if (fallbackEl) {
            const opts = genNickOptions(account.name);
            const pick = opts[Math.floor(Math.random() * opts.length)];
            fallbackEl.focus();
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(fallbackEl, pick.value);
            ['input','change'].forEach(ev => fallbackEl.dispatchEvent(new Event(ev, {bubbles:true})));
            showToast("🎲 TK: " + pick.value, "info");
          }
        }

        // 4. Tự động điền STK
        await sleep(200);
        const stkEl2 = getStkInput();
        if (stkEl2) {
          await typeIntoInput(stkEl2, account.account);
          showToast("💳 STK: " + account.account, "info");
        }

        // 5. Tự động click Điền SĐT
        await sleep(300);
        const sdtBtn = document.getElementById("okvip-btn-phone");
        if (sdtBtn) {
          sdtBtn.click();
          await new Promise(resolve => {
            let waited = 0;
            const check = setInterval(() => {
              waited += 500;
              const txt = document.getElementById("okvip-btn-phone")?.textContent || "";
              const done = txt.includes("✅") || txt.includes("❌") || txt.includes("Hết") || waited >= 1000;
              if (done) { clearInterval(check); resolve(); }
            }, 500);
          });
        }

        // 6. Tự động click Điền MK
        await sleep(400);
        const mkBtn = document.getElementById("__mk_fill_btn__");
        if (mkBtn) {
          mkBtn.click();
          await sleep(1500);
        } else {
          const pwEl = getPasswordInput();
          if (pwEl) await typeIntoInput(pwEl, PASSWORD);
        }

        btn.textContent = "✅ Xong"; btn.style.background = "#2e7d32";
        setTimeout(() => { btn.innerHTML = "👤 Điền Tên"; btn.style.background = "#f60"; btn.disabled = false; }, 2000);
      });
    });

    // --- STK BUTTON ---
    (function injectStk() {
      if (document.getElementById("__mk_stk_btn__")) return;
      const stkEl = getStkInput();
      if (!stkEl) return;
      if (isWithdrawInput(stkEl)) return; // ❌ không inject vào ô withdraw
      if (stkEl.closest("#__mk_stk_wrapper__")) return;
      // Bỏ qua nếu đây là ô username
      if (/tên|ten|username/i.test(stkEl.placeholder || "")) return;

      const parent = stkEl.parentElement;
      if (!parent) return;
      if (getComputedStyle(parent).position === "static") parent.style.position = "relative";
      parent.id = parent.id || "__mk_stk_wrapper__";
      stkEl.style.paddingRight = "120px";
      stkEl.style.boxSizing = "border-box";

      const btn = document.createElement("button");
      btn.id = "__mk_stk_btn__";
      btn.type = "button";
      // Nếu đã nhớ tài khoản thì hiện tên luôn
      btn.innerHTML = lastSelectedAccount ? `💳 ${lastSelectedAccount.name.split(" ").pop()}` : "💳 Điền STK";
      btn.style.cssText = "position:absolute;right:4px;top:50%;transform:translateY(-50%);background:#f60;color:#fff;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;font-weight:700;font-size:12px;z-index:9999;white-space:nowrap;touch-action:manipulation;";
      btn.addEventListener("mousedown", e => e.preventDefault());
      btn.addEventListener("click", async () => {
        if (!lastSelectedAccount) {
          // Chưa có → mở picker chọn
          await showPicker(async (account) => {
            setLastAccount(account);
            btn.textContent = "⌨️..."; btn.disabled = true;
            await typeIntoInput(getStkInput(), account.account);
            btn.textContent = "✅ Xong"; btn.style.background = "#2e7d32";
            setTimeout(() => { btn.innerHTML = "💳 Điền STK"; btn.style.background = "#f60"; btn.disabled = false; }, 1500);
          });
        } else {
          // Đã nhớ → điền thẳng, giữ lâu để có thể đổi bằng cách nhấn giữ
          btn.textContent = "⌨️..."; btn.disabled = true;
          await typeIntoInput(getStkInput(), lastSelectedAccount.account);
          btn.textContent = `✅ ${lastSelectedAccount.name}`; btn.style.background = "#2e7d32";
          setTimeout(() => { btn.innerHTML = `💳 ${lastSelectedAccount.name.split(" ").pop()}`; btn.style.background = "#f60"; btn.disabled = false; }, 1500);
        }
      });
      // Nhấn giữ để đổi tài khoản khác
      let holdTimer = null;
      btn.addEventListener("touchstart", () => {
        holdTimer = setTimeout(async () => {
          await showPicker(async (account) => {
            setLastAccount(account);
            btn.textContent = "⌨️..."; btn.disabled = true;
            await typeIntoInput(getStkInput(), account.account);
            btn.textContent = "✅ Xong"; btn.style.background = "#2e7d32";
            setTimeout(() => { btn.innerHTML = `💳 ${account.name.split(" ").pop()}`; btn.style.background = "#f60"; btn.disabled = false; }, 1500);
          });
        }, 600);
      }, { passive: true });
      btn.addEventListener("touchend", () => clearTimeout(holdTimer), { passive: true });
      parent.appendChild(btn);
    })();

    // --- USERNAME BUTTON ---
    if (!document.getElementById("__mk_user_btn__")) {
      const userEl = getUsernameInput();
      if (userEl && userEl.parentNode?.id !== "__mk_user_wrapper__") {
        const w = document.createElement("div");
        w.id = "__mk_user_wrapper__";
        w.style.cssText = "position:relative;display:block;width:100%;";
        userEl.parentNode.insertBefore(w, userEl);
        w.appendChild(userEl);
        userEl.style.paddingRight = "160px";

        const btnTK = document.createElement("button");
        btnTK.id = "__mk_user_btn__";
        btnTK.type = "button";
        btnTK.innerHTML = "🆔 Điền TK";
        Object.assign(btnTK.style, {
          position:"absolute", right:"42px", top:"50%", transform:"translateY(-50%)",
          background:"#1a73e8", color:"#fff", border:"none", borderRadius:"6px",
          padding:"6px 10px", cursor:"pointer", fontWeight:"700", fontSize:"12px",
          zIndex:"9999", whiteSpace:"nowrap", touchAction:"manipulation"
        });
        btnTK.addEventListener("mousedown", e => e.preventDefault());
        btnTK.addEventListener("click", async () => {
          if (!lastSelectedAccount) { showToast("⚠️ Bấm Điền Tên trước!", "error"); return; }
          await showNickPicker(lastSelectedAccount.name, async (nick) => {
            btnTK.textContent = "⌨️..."; btnTK.disabled = true;
            const el = getUsernameInput();
            if (el) await typeIntoInput(el, nick);
            btnTK.textContent = "✅ Xong"; btnTK.style.background = "#2e7d32";
            setTimeout(() => { btnTK.innerHTML = "🆔 Điền TK"; btnTK.style.background = "#1a73e8"; btnTK.disabled = false; }, 1500);
          });
        });

        const btnRand = document.createElement("button");
        btnRand.id = "__mk_user_rand__";
        btnRand.type = "button";
        btnRand.innerHTML = "🎲";
        Object.assign(btnRand.style, {
          position:"absolute", right:"4px", top:"50%", transform:"translateY(-50%)",
          background:"#f0ad4e", color:"#fff", border:"none", borderRadius:"6px",
          padding:"6px 8px", cursor:"pointer", fontWeight:"700", fontSize:"13px",
          zIndex:"9999", whiteSpace:"nowrap", touchAction:"manipulation"
        });
        btnRand.addEventListener("mousedown", e => e.preventDefault());
        btnRand.addEventListener("click", async () => {
          if (!lastSelectedAccount) { showToast("⚠️ Bấm Điền Tên trước!", "error"); return; }
          const opts = genNickOptions(lastSelectedAccount.name);
          const pick = opts[Math.floor(Math.random() * opts.length)];
          btnRand.disabled = true;
          const el = getUsernameInput();
          if (el) await typeIntoInput(el, pick.value);
          showToast(`🎲 ${pick.value}`, "info");
          btnRand.disabled = false;
        });

        w.appendChild(btnTK);
        w.appendChild(btnRand);
      }
    }

    // --- EMAIL BUTTON ---
    if (!document.getElementById("__mk_email_btn__")) {
      const emailEl = getEmailInput();
      if (emailEl && !emailEl.closest("#__mk_email_wrapper__")) {
        const w = document.createElement("div");
        w.id = "__mk_email_wrapper__";
        w.style.cssText = "position:relative;display:block;width:100%;";
        emailEl.parentNode.insertBefore(w, emailEl);
        w.appendChild(emailEl);
        emailEl.style.paddingRight = "160px";

        const btnGmail = document.createElement("button");
        btnGmail.id = "__mk_email_btn__";
        btnGmail.type = "button";
        btnGmail.innerHTML = "📧 Gmail";
        Object.assign(btnGmail.style, {
          position:"absolute", right:"42px", top:"50%", transform:"translateY(-50%)",
          background:"#ea4335", color:"#fff", border:"none", borderRadius:"6px",
          padding:"6px 10px", cursor:"pointer", fontWeight:"700", fontSize:"12px",
          zIndex:"9999", whiteSpace:"nowrap", touchAction:"manipulation"
        });
        btnGmail.addEventListener("mousedown", e => e.preventDefault());
        btnGmail.addEventListener("click", async () => {
          if (!lastSelectedAccount) { showToast("⚠️ Bấm Điền Tên trước!", "error"); return; }
          const overlay = document.createElement("div");
          overlay.style.cssText = "position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;";
          const box = document.createElement("div");
          box.style.cssText = "background:#fff;border-radius:12px;width:90vw;max-width:380px;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.25);overflow:hidden;font-family:-apple-system,Arial,sans-serif;";
          box.innerHTML = `
            <div style="padding:12px 16px;background:#ea4335;color:#fff;font-weight:700;font-size:14px;display:flex;justify-content:space-between;align-items:center;">
              📧 Chọn Gmail
              <button id="__em_close__" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1;">✕</button>
            </div>
            <div style="padding:6px 12px;background:#fce8e6;font-size:12px;color:#ea4335;font-weight:600;">
              👤 <b>${lastSelectedAccount.name}</b>
            </div>
            <div id="__em_list__" style="overflow-y:auto;flex:1;padding:4px 0;-webkit-overflow-scrolling:touch;"></div>
          `;
          overlay.appendChild(box);
          document.body.appendChild(overlay);
          const closeEM = () => overlay.remove();
          overlay.addEventListener("click", e => { if(e.target===overlay) closeEM(); });
          box.querySelector("#__em_close__").addEventListener("click", closeEM);
          let curOpts = genEmailOptions(lastSelectedAccount.name);
          function renderEM(opts) {
            const listEl = box.querySelector("#__em_list__");
            listEl.innerHTML = "";
            opts.forEach((o, idx) => {
              const row = document.createElement("div");
              row.style.cssText = "padding:8px 10px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:8px;";
              row.innerHTML = `
                <div style="flex:1;min-width:0;">
                  <div style="font-weight:700;font-size:12px;color:#111;font-family:monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" id="__em_val_${idx}__">${o.value}</div>
                  <div style="font-size:10px;color:#999;">${o.label}</div>
                </div>
                <button data-idx="${idx}" class="__em_pick__" style="padding:5px 10px;background:#ea4335;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;">✅</button>
                <button data-idx="${idx}" class="__em_rand__" style="padding:5px 8px;background:#f0ad4e;color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;flex-shrink:0;">🎲</button>
              `;
              listEl.appendChild(row);
            });
            listEl.querySelectorAll(".__em_pick__").forEach(b => {
              b.addEventListener("click", async () => {
                const idx = parseInt(b.dataset.idx);
                closeEM();
                btnGmail.textContent = "⌨️..."; btnGmail.disabled = true;
                await typeIntoInput(getEmailInput(), curOpts[idx].value);
                btnGmail.textContent = "✅ Xong"; btnGmail.style.background = "#2e7d32";
                setTimeout(() => { btnGmail.innerHTML = "📧 Gmail"; btnGmail.style.background = "#ea4335"; btnGmail.disabled = false; }, 1500);
              });
            });
            listEl.querySelectorAll(".__em_rand__").forEach(b => {
              b.addEventListener("click", () => {
                const idx = parseInt(b.dataset.idx);
                const fresh = genEmailOptions(lastSelectedAccount.name);
                curOpts[idx] = fresh[idx];
                const valEl = listEl.querySelector(`#__em_val_${idx}__`);
                if (valEl) valEl.textContent = curOpts[idx].value;
              });
            });
          }
          renderEM(curOpts);
        });

        const btnRandEM = document.createElement("button");
        btnRandEM.id = "__mk_email_rand__";
        btnRandEM.type = "button";
        btnRandEM.innerHTML = "🎲";
        Object.assign(btnRandEM.style, {
          position:"absolute", right:"4px", top:"50%", transform:"translateY(-50%)",
          background:"#f0ad4e", color:"#fff", border:"none", borderRadius:"6px",
          padding:"6px 8px", cursor:"pointer", fontWeight:"700", fontSize:"13px",
          zIndex:"9999", whiteSpace:"nowrap", touchAction:"manipulation"
        });
        btnRandEM.addEventListener("mousedown", e => e.preventDefault());
        btnRandEM.addEventListener("click", async () => {
          if (!lastSelectedAccount) { showToast("⚠️ Bấm Điền Tên trước!", "error"); return; }
          const opts = genEmailOptions(lastSelectedAccount.name);
          const pick = opts[Math.floor(Math.random() * opts.length)];
          btnRandEM.disabled = true;
          await typeIntoInput(getEmailInput(), pick.value);
          showToast("📧 " + pick.value, "info");
          btnRandEM.disabled = false;
        });

        w.appendChild(btnGmail);
        w.appendChild(btnRandEM);
      }
    }

    // --- CITY BUTTON ---
    (function injectCity() {
      if (document.getElementById("__mk_city_btn__")) return;
      const cityEl = getCityInput();
      if (!cityEl) return;
      if (cityEl.closest("#__mk_city_wrapper__")) return;

      const parent = cityEl.parentElement;
      if (!parent) return;
      if (getComputedStyle(parent).position === "static") parent.style.position = "relative";
      parent.id = parent.id || "__mk_city_wrapper__";
      cityEl.style.paddingRight = "176px";
      cityEl.style.boxSizing = "border-box";

      function openCityPicker() {
        const overlay = document.createElement("div");
        overlay.style.cssText = "position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;";
        const box = document.createElement("div");
        box.style.cssText = "background:#fff;border-radius:12px;width:90vw;max-width:380px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.25);overflow:hidden;font-family:-apple-system,Arial,sans-serif;";
        box.innerHTML = `
          <div style="padding:12px 16px;background:#6f42c1;color:#fff;font-weight:700;font-size:14px;display:flex;justify-content:space-between;align-items:center;">
            🏙️ Chọn Tỉnh / Thành phố
            <button id="__ct_close__" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1;">✕</button>
          </div>
          <div style="display:flex;border-bottom:2px solid #6f42c1;">
            <button id="__ct_tab63__" style="flex:1;padding:8px;background:#6f42c1;color:#fff;border:none;font-weight:700;font-size:12px;cursor:pointer;">63 tỉnh (cũ)</button>
            <button id="__ct_tab34__" style="flex:1;padding:8px;background:#e9e0ff;color:#6f42c1;border:none;font-weight:700;font-size:12px;cursor:pointer;">34 tỉnh (mới)</button>
          </div>
          <div style="padding:8px 10px;border-bottom:1px solid #eee;">
            <input id="__ct_search__" type="text" placeholder="🔍 Tìm tỉnh thành..." style="width:100%;padding:8px 10px;border:1.5px solid #ddd;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;"/>
          </div>
          <div id="__ct_list__" style="overflow-y:auto;flex:1;padding:4px 0;-webkit-overflow-scrolling:touch;"></div>
        `;
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        let activeList = PROVINCES_63;
        const closeCT = () => overlay.remove();
        overlay.addEventListener("click", e => { if (e.target === overlay) closeCT(); });
        box.querySelector("#__ct_close__").addEventListener("click", closeCT);

        function renderCT(list) {
          const listEl = box.querySelector("#__ct_list__");
          listEl.innerHTML = "";
          if (!list.length) { listEl.innerHTML = `<div style="text-align:center;padding:16px;color:#aaa;font-size:13px;">Không có kết quả</div>`; return; }
          list.forEach(p => {
            const row = document.createElement("div");
            row.style.cssText = "padding:11px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:13px;font-weight:600;color:#222;";
            row.textContent = p;
            row.addEventListener("mouseenter", () => row.style.background = "#f3eeff");
            row.addEventListener("mouseleave", () => row.style.background = "");
            row.addEventListener("click", async () => {
              closeCT();
              const el = getCityInput();
              if (el) await typeIntoInput(el, p);
              showToast("🏙️ " + p, "info");
            });
            listEl.appendChild(row);
          });
        }

        function setTab(mode) {
          activeList = mode === 63 ? PROVINCES_63 : PROVINCES_34;
          box.querySelector("#__ct_tab63__").style.cssText = `flex:1;padding:8px;background:${mode===63?"#6f42c1":"#e9e0ff"};color:${mode===63?"#fff":"#6f42c1"};border:none;font-weight:700;font-size:12px;cursor:pointer;`;
          box.querySelector("#__ct_tab34__").style.cssText = `flex:1;padding:8px;background:${mode===34?"#6f42c1":"#e9e0ff"};color:${mode===34?"#fff":"#6f42c1"};border:none;font-weight:700;font-size:12px;cursor:pointer;`;
          box.querySelector("#__ct_search__").value = "";
          renderCT(activeList);
        }

        box.querySelector("#__ct_tab63__").addEventListener("click", () => setTab(63));
        box.querySelector("#__ct_tab34__").addEventListener("click", () => setTab(34));
        box.querySelector("#__ct_search__").addEventListener("input", e => {
          const kw = e.target.value.trim().toLowerCase();
          renderCT(kw ? activeList.filter(p => p.toLowerCase().includes(kw)) : activeList);
        });
        setTab(63);
      }

      // Nút chọn tỉnh
      const btnCity = document.createElement("button");
      btnCity.id = "__mk_city_btn__";
      btnCity.type = "button";
      btnCity.innerHTML = "🏙️ Tỉnh/TP";
      btnCity.style.cssText = "position:absolute;right:46px;top:50%;transform:translateY(-50%);background:#6f42c1;color:#fff;border:none;border-radius:6px;padding:5px 9px;cursor:pointer;font-weight:700;font-size:11px;z-index:9999;white-space:nowrap;touch-action:manipulation;max-width:90px;";
      btnCity.addEventListener("mousedown", e => e.preventDefault());
      btnCity.addEventListener("click", openCityPicker);

      // Nút random
      const btnRandCity = document.createElement("button");
      btnRandCity.id = "__mk_city_rand__";
      btnRandCity.type = "button";
      btnRandCity.innerHTML = "🎲";
      btnRandCity.style.cssText = "position:absolute;right:4px;top:50%;transform:translateY(-50%);background:#f0ad4e;color:#fff;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;font-weight:700;font-size:13px;z-index:9999;white-space:nowrap;touch-action:manipulation;";
      btnRandCity.addEventListener("mousedown", e => e.preventDefault());
      btnRandCity.addEventListener("click", async () => {
        const pick = pickRand(PROVINCES_63);
        btnRandCity.disabled = true;
        const el = getCityInput();
        if (el) await typeIntoInput(el, pick);
        showToast("🏙️ " + pick, "info");
        btnRandCity.disabled = false;
      });

      parent.appendChild(btnCity);
      parent.appendChild(btnRandCity);
    })();

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

  // ========== AUTO RETRY USERNAME KHI BỊ TRÙNG ==========
  let _retryingUsername = false;

  const DUPE_REGEX = /tên tài khoản này đã tồn tại|tài khoản đã tồn tại|username.*exist|đã được sử dụng|already.*taken|account.*exist/i;

  async function checkAndRetryUsername() {
    if (_retryingUsername) return;
    const bodyText = document.body.innerText || "";
    if (DUPE_REGEX.test(bodyText)) {
      _retryingUsername = true;
      await sleep(200);
      const userEl = getUsernameInput() || document.querySelector('input[data-input-name="account"]');
      if (userEl && lastSelectedAccount) {
        const opts = genNickOptions(lastSelectedAccount.name);
        const pick = opts[Math.floor(Math.random() * opts.length)];
        await typeIntoInput(userEl, pick.value);
        showToast("🔄 TK trùng → đổi: " + pick.value, "info");
      }
      setTimeout(() => { _retryingUsername = false; }, 3000);
    }
  }

  // ========== AUTO FILL MẬT KHẨU RÚT TIỀN ==========
  let _autoWithdrawDone = false;
  let _lastWithdrawCheck = 0;

  async function autoFillWithdrawPassword() {
    const now = Date.now();
    if (now - _lastWithdrawCheck < 800) return; // throttle
    _lastWithdrawCheck = now;

    const el = document.querySelector('input[formcontrolname="newPassword"]');
    if (!el) { _autoWithdrawDone = false; return; } // reset khi ô biến mất
    if (_autoWithdrawDone) return;
    if (el.value) return; // đã có giá trị rồi

    _autoWithdrawDone = true;
    await sleep(400);

    const inputs = getWithdrawInputs();
    for (const inp of inputs) {
      clickEyeIcon(inp);
      await sleep(150);
      await typeIntoInput(inp, WITHDRAW_PASSWORD);
      await sleep(100);
    }
    showToast("🔒 Đã điền MK rút: " + WITHDRAW_PASSWORD, "success");
  }

  new MutationObserver(() => {
    tryInjectAll();
    checkAndRetryUsername();
    autoFillWithdrawPassword();
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  setInterval(() => { tryInjectAll(); autoFillWithdrawPassword(); }, 1000);

  showToast("✅ Tool đã sẵn sàng!", "success");

})();
