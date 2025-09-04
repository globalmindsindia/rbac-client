export function startZohoLogin(intendedEmail: string) {
  const state = encodeURIComponent(JSON.stringify({ intendedEmail }));
  const apiBaseUrl = (window as any)._env_?.API_BASE_URL;

  if (!apiBaseUrl) {
    console.error("API_BASE_URL is not defined in environment variables.");
    return;
  }

  const authUrl = `${apiBaseUrl}/v1/users/auth/zoho/oauth?state=${state}`;

  // 1) Fire logout beacon to clear Zoho cookie
  const img = new Image();
  img.src = "https://accounts.zoho.com/logout?servicename=ZohoAccounts";

  // 2) After a short delay, send user into your backend’s OAuth init
  setTimeout(() => {
    window.location.href = authUrl;
  }, 500);
}
