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
  let leaving = false;

  function driftElsewhere(event) {
    if (leaving || event.defaultPrevented || event.button > 0) return;
    const back = event.target.closest('a[href*="world=buffer"]');
    if (back) return;
    const surface = event.target.closest("button, .card, .bunny, nav a, #canvas-container, #field, .forecast, #c, .word, .center");
    if (!surface || Math.random() > 0.3) return;

    event.preventDefault();
    leaving = true;
    const veil = document.createElement("i");
    veil.setAttribute("aria-hidden", "true");
    veil.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none;background:radial-gradient(circle at " + event.clientX + "px " + event.clientY + "px,rgba(255,255,255,.82),rgba(255,255,255,.08) 16%,rgba(4,5,10,.92) 62%);opacity:0;transition:opacity .34s ease";
    document.body.append(veil);
    requestAnimationFrame(() => { veil.style.opacity = "1"; });
    window.setTimeout(() => location.assign(choices[Math.floor(Math.random() * choices.length)]), 330);
  }

  document.addEventListener("click", driftElsewhere);
})();
