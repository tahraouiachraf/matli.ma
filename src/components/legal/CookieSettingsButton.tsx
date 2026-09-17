"use client";

export function CookieSettingsButton() {
  function resetConsent() {
    localStorage.removeItem("matli-cookie-consent");
    window.location.reload();
  }

  return (
    <button type="button" onClick={resetConsent} className="mt-2 h-11 rounded-md border border-orange-300 bg-white px-4 text-sm font-black text-orange-700 hover:bg-orange-50">
      Modifier mon choix de cookies
    </button>
  );
}
