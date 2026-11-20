// Progressive enhancement only: open/closed status, menu close, document switcher, bottom call bar.
const tz = "Europe/Kyiv";
function status() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const wd = get("weekday");
  const mins = parseInt(get("hour"), 10) % 24 * 60 + parseInt(get("minute"), 10);
  const weekend = wd === "Sat" || wd === "Sun";
  const open = (weekend ? 9 : 8) * 60, close = (weekend ? 16 : 20) * 60;
  const hh = (m: number) => String(Math.floor(m / 60)).padStart(2, "0") + ":00";
  let state = "closed", text = "";
  if (mins >= open && mins < close) { state = "open"; text = `Відкрито зараз · до ${hh(close)}`; }
  else if (mins < open) { text = `Зараз зачинено · відкриємо о ${hh(open)}`; }
  else { text = "Зараз зачинено · працюємо завтра"; }
  document.querySelectorAll<HTMLElement>("[data-status]").forEach((el) => { el.dataset.state = state; el.textContent = text; });
}
status();
setInterval(status, 60_000);

const menu = document.querySelector<HTMLDetailsElement>("[data-menu]");
menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { menu.open = false; }));
addEventListener("keydown", (e) => { if (e.key === "Escape" && menu?.open) { menu.open = false; menu.querySelector("summary")?.focus(); } });

const btns = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-doc-btn]"));
const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-doc-panel]"));
function show(key: string) {
  btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.docBtn === key)));
  panels.forEach((p) => {
    const on = p.dataset.docPanel === key;
    p.hidden = !on;
    p.classList.toggle("is-in", on);
  });
}
if (btns.length) {
  show("pay");
  btns.forEach((b) => b.addEventListener("click", () => show(b.dataset.docBtn!)));
  document.querySelectorAll<HTMLAnchorElement>("a[data-doc]").forEach((a) => a.addEventListener("click", () => show(a.dataset.doc!)));
}

const bar = document.querySelector<HTMLElement>("[data-callbar]");
const top = document.querySelector<HTMLElement>(".registry");
if (bar && top && "IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => bar.classList.toggle("is-on", !e.isIntersecting && e.boundingClientRect.top < 0)).observe(top);
} else bar?.classList.add("is-on");

// FutureLink hint on tap (touch has no hover)
document.querySelectorAll<HTMLElement>(".future-link").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".future-link.is-tip").forEach((o) => { if (o !== el) o.classList.remove("is-tip"); });
    el.classList.add("is-tip");
    setTimeout(() => el.classList.remove("is-tip"), 2500);
  });
});
