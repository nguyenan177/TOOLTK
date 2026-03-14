async function solveCaptchaAuto() {
  const inp = document.querySelector('input[formcontrolname="checkCode"]')
           || document.querySelector('input[ng-model*="code"]');
  if (!inp) return { ok: false, msg: "Không tìm thấy input" };

  // Xóa input cũ trước
  inp.value = "";
  inp.dispatchEvent(new Event("input", { bubbles: true }));

  // Click vào ảnh captcha để refresh
  let img = document.querySelector('img[src^="data:image"]')
         || document.querySelector('img.codeImage')
         || document.querySelector('img.catchat_pic')
         || document.querySelector('#captcha-image')
         || document.querySelector('img[src*="captcha"]')
         || document.querySelector('img[src*="kaptcha"]')
         || document.querySelector('img[src*="vcode"]');

  if (!img) {
    const parent = inp.closest('form') || inp.parentElement;
    if (parent) img = parent.querySelector('img');
  }
  if (!img) {
    img = Array.from(document.querySelectorAll("img")).find(e => {
      const w = e.naturalWidth || e.offsetWidth, h = e.naturalHeight || e.offsetHeight;
      return w > 50 && w < 280 && h > 20 && h < 100;
    });
  }

  if (!img) return { ok: false, msg: "Không tìm thấy ảnh captcha" };

  // Lưu src cũ, click để refresh ảnh
  const oldSrc = img.src;
  img.click();

  // Đợi ảnh mới load (tối đa 3 giây)
  await new Promise(resolve => {
    let waited = 0;
    const check = setInterval(() => {
      waited += 200;
      const changed = img.src !== oldSrc || img.complete;
      if (changed || waited >= 3000) {
        clearInterval(check);
        resolve();
      }
    }, 200);
  });

  await sleep(500); // Đợi ảnh render xong

  try {
    const b64 = await getBase64(img);
    if (!b64) return { ok: false, msg: "Không lấy được ảnh" };
    const raw = b64.includes(",") ? b64.split(",")[1] : b64;
    const type = b64.includes("svg+xml") ? 18 : 14;
    const result = await callCaptchaApi(raw, type);
    await typeIntoInput(inp, result);
    return { ok: true, result };
  } catch(e) {
    return { ok: false, msg: e.message };
  }
}
