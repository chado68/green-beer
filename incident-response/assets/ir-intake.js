/*
 * Triage intake form: computes a provisional priority (P1-P4) from the
 * severity answers, then posts the form as JSON to IR_CONFIG.FORM_ENDPOINT.
 * Works on any static host; no build step.
 */
(function () {
  var cfg = window.IR_CONFIG || {};
  var form = document.getElementById("ir-intake");
  if (!form) return;

  var status = document.getElementById("ir-status");
  var pLabel = document.getElementById("ir-priority");
  var pWhy = document.getElementById("ir-priority-why");
  var pField = document.getElementById("computed_priority");
  var submitBtn = form.querySelector("button[type=submit]");
  var endpointReady = cfg.FORM_ENDPOINT && cfg.FORM_ENDPOINT.indexOf("YOUR_FORM_ID") === -1;

  // Default "time detected" to now (local) so the field is quick to fill.
  var detected = form.elements["time_detected"];
  if (detected && !detected.value) {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    detected.value = d.toISOString().slice(0, 16);
  }
  var tz = form.elements["reporter_timezone"];
  if (tz) {
    try { tz.value = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { /* ignore */ }
  }

  function val(name) {
    var el = form.elements[name];
    if (!el) return "";
    if (el instanceof RadioNodeList) return el.value;
    return el.value;
  }
  function checked(name) {
    return Array.prototype.filter.call(form.querySelectorAll('input[name="' + name + '"]'), function (c) { return c.checked; })
      .map(function (c) { return c.value; });
  }

  // Scoring: each answer adds points; total maps to a priority band.
  function computePriority() {
    var score = 0, reasons = [];
    var impact = val("business_impact");
    if (impact === "stopped") { score += 4; reasons.push("operations stopped"); }
    else if (impact === "degraded") { score += 2; reasons.push("operations degraded"); }

    if (val("attacker_active") === "yes") { score += 3; reasons.push("attacker may still be active"); }
    else if (val("attacker_active") === "unknown") { score += 1; }

    if (val("ransomware") === "yes") { score += 3; reasons.push("ransomware / extortion"); }
    if (val("data_exfil") === "yes") { score += 2; reasons.push("data exfiltration suspected"); }
    else if (val("data_exfil") === "unknown") { score += 1; }

    var regulated = checked("regulated_data").filter(function (v) { return v !== "none"; });
    if (regulated.length) { score += 2; reasons.push("regulated data involved"); }

    var systems = checked("systems_affected");
    var critical = ["Domain controllers / identity", "Payment / POS", "Gaming systems (slots, table, CMS)", "OT / building systems"];
    if (systems.some(function (s) { return critical.indexOf(s) !== -1; })) { score += 2; reasons.push("critical systems affected"); }

    var scope = val("scope");
    if (scope === "widespread") { score += 2; reasons.push("widespread scope"); }
    else if (scope === "multiple") { score += 1; }

    var p, cls;
    if (score >= 9) { p = "P1 Critical"; cls = "p1"; }
    else if (score >= 6) { p = "P2 High"; cls = "p2"; }
    else if (score >= 3) { p = "P3 Medium"; cls = "p3"; }
    else { p = "P4 Low"; cls = "p4"; }
    return { label: p, cls: cls, score: score, reasons: reasons };
  }

  function renderPriority() {
    var r = computePriority();
    pLabel.textContent = r.label;
    pLabel.className = "p " + r.cls;
    pWhy.textContent = r.reasons.length ? "Based on: " + r.reasons.join(", ") + "." : "Answer the severity questions to update this.";
    pField.value = r.label + " (score " + r.score + ")";
    return r;
  }
  form.addEventListener("change", renderPriority);
  renderPriority();

  function show(kind, html) {
    status.className = "status show " + kind;
    status.innerHTML = html;
    status.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (form.elements["_gotcha"] && form.elements["_gotcha"].value) return; // bot

    var r = renderPriority();
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (k === "_gotcha") return;
      if (data[k] !== undefined) data[k] = [].concat(data[k], v);
      else data[k] = v;
    });
    data._subject = "[IR Intake] " + r.label + " - " + (data.organization || "Unknown org");

    var hotline = '<a href="tel:' + (cfg.HOTLINE_TEL || "") + '">' + (cfg.HOTLINE_DISPLAY || "our hotline") + "</a>";

    if (!endpointReady) {
      show("info", "<strong>Form endpoint not configured yet.</strong> Nothing was sent. " +
        "Set <code>FORM_ENDPOINT</code> in <code>incident-response/assets/ir-config.js</code>. " +
        "Provisional priority: <strong>" + r.label + "</strong>.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    fetch(cfg.FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.reset();
      renderPriority();
      show("ok", "<strong>Received.</strong> Your provisional priority is <strong>" + r.label + "</strong>. " +
        "A responder will contact you shortly. For P1/P2 incidents, also call " + hotline + " now.");
    }).catch(function () {
      show("err", "<strong>We could not submit the form.</strong> Please call " + hotline +
        (cfg.IR_EMAIL ? ' or email <a href="mailto:' + cfg.IR_EMAIL + '">' + cfg.IR_EMAIL + "</a>" : "") + ".");
    }).then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit for triage";
    });
  });
})();
