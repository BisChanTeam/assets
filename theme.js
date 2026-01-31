(() => {
  const COOKIE_NAME = 'bischan_theme';
  const ONE_YEAR = 60 * 60 * 24 * 365;
  const root = document.documentElement;

  const getCookie = (name) => {
    const parts = document.cookie.split('; ').map((part) => part.split('='));
    const match = parts.find(([key]) => key === name);
    return match ? decodeURIComponent(match[1]) : '';
  };

  const setCookie = (name, value) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax`;
  };

  const normalizeTheme = (value) =>
    value === 'dark' || value === 'light' ? value : '';
  const resolveTheme = (value) => (value === 'dark' ? 'dark' : 'light');

  const updateToggle = (theme) => {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    const label = toggle.querySelector('.theme-label');
    const nextLabel = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    if (label) label.textContent = nextLabel;
    toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  };

  const applyTheme = (theme) => {
    const resolved = resolveTheme(theme);
    root.setAttribute('data-theme', resolved);
    updateToggle(resolved);
  };

  const stored = normalizeTheme(getCookie(COOKIE_NAME));
  const prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    updateToggle(resolveTheme(root.getAttribute('data-theme') || initial));
    toggle.addEventListener('click', () => {
      const current = resolveTheme(root.getAttribute('data-theme'));
      const next = current === 'dark' ? 'light' : 'dark';
      setCookie(COOKIE_NAME, next);
      applyTheme(next);
    });
  });
})();