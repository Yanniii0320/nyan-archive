(() => {
  const doors = [
    "card-gallery.html",
    "virtual-enjoyment.html",
    "nyanmade.html",
    "orbit-letters.html",
    "soft-forecast.html",
    "gentle-chaos.html",
  ];
  const current = location.pathname.split("/").pop();
  const choices = doors.filter((door) => door !== current);
  const door = document.createElement("a");
  door.className = "nyan-another-door";
  door.href = "./random-door.html";
  door.textContent = "ANOTHER DOOR ↗";
  door.setAttribute("aria-label", "Enter another random portal");
  door.addEventListener("click", (event) => {
    event.preventDefault();
    const next = choices[Math.floor(Math.random() * choices.length)];
    document.documentElement.classList.add("nyan-door-leaving");
    window.setTimeout(() => location.assign(next), 260);
  });
  const style = document.createElement("style");
  style.textContent = `
    .nyan-another-door{position:fixed!important;z-index:2147483647!important;right:20px!important;bottom:20px!important;display:block!important;padding:10px 12px!important;border:1px solid currentColor!important;border-radius:999px!important;color:inherit!important;background:rgba(8,9,14,.18)!important;backdrop-filter:blur(12px)!important;font:9px/1 monospace!important;letter-spacing:.14em!important;text-decoration:none!important;opacity:.75!important;transition:opacity .25s ease,transform .25s ease,background .25s ease!important;mix-blend-mode:normal!important}
    .nyan-another-door:hover,.nyan-another-door:focus-visible{opacity:1!important;transform:translateY(-3px)!important;background:rgba(255,255,255,.18)!important}
    .nyan-door-leaving .nyan-another-door{transform:scale(1.45)!important;opacity:0!important}
  `;
  document.head.append(style);
  document.body.append(door);
})();
