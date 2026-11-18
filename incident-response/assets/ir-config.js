/*
 * Incident Response section configuration.
 *
 * FORM_ENDPOINT: the URL the triage intake form posts to. Create a form at
 * https://formspree.io (or any service that accepts a JSON POST and returns
 * 2xx), then paste its endpoint here, e.g. "https://formspree.io/f/abcdwxyz".
 * While this is left as the placeholder, the form validates and shows the
 * computed priority but does not send anything.
 *
 * HOTLINE: the 24/7 phone number shown across the IR pages. Placeholder.
 */
window.IR_CONFIG = {
  FORM_ENDPOINT: "https://formspree.io/f/YOUR_FORM_ID",
  HOTLINE_DISPLAY: "(702) 555-0100",
  HOTLINE_TEL: "+17025550100",
  IR_EMAIL: "ir@example.com"
};
