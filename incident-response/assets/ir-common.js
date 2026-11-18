/* Shared by every IR page: fills the hotline and email from IR_CONFIG. */
(function () {
  var cfg = window.IR_CONFIG || {};
  document.querySelectorAll("[data-ir-hotline]").forEach(function (el) {
    if (cfg.HOTLINE_DISPLAY) el.textContent = cfg.HOTLINE_DISPLAY;
    if (el.tagName === "A" && cfg.HOTLINE_TEL) el.href = "tel:" + cfg.HOTLINE_TEL;
  });
  document.querySelectorAll("[data-ir-email]").forEach(function (el) {
    if (!cfg.IR_EMAIL) return;
    el.textContent = cfg.IR_EMAIL;
    if (el.tagName === "A") el.href = "mailto:" + cfg.IR_EMAIL;
  });
})();
