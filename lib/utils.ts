export { cn } from "cn"

export function showPrototypeToast(message: string) {
  const el = document.createElement('div');
  el.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium z-50 transition-opacity duration-300';
  el.style.background = 'oklch(0.15 0.05 240 / 90%)';
  el.style.color = 'var(--foreground)';
  el.style.border = '1px solid oklch(0.720 0.140 200 / 30%)';
  el.style.boxShadow = '0 4px 12px oklch(0 0 0 / 50%)';
  el.style.backdropFilter = 'blur(8px)';
  el.innerText = message;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 2000);
}
