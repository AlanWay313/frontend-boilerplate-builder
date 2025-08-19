export default function useUserId() {
  const user = localStorage.getItem("auth_user");

  if (!user) return null;

  try {
    const parsed = JSON.parse(user);
    return parsed.id || null;
  } catch (e) {
    console.error("Erro ao analisar auth_user do localStorage:", e);
    return null;
  }
}
