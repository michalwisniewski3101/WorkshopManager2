export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const token = localStorage.getItem('jwtToken');
    const roles = localStorage.getItem('roles') || '[]'; // Domyślnie pusta tablica w formacie JSON
    
    // Konwersja ról na tablicę (w przypadku, gdy są zapisane jako JSON w localStorage)
    const parsedRoles = JSON.parse(roles);

    // Sprawdzanie logowania
    if (!token && to.path !== '/auth/login') {
      return navigateTo('/auth/login');
    }

    // Weryfikacja ról, jeśli użytkownik jest zalogowany
    if (token) {
      const requiredRoles = to.meta?.auth?.roles || []; // Role z definePageMeta
      // Jeśli brak wymaganych ról -> przekierowanie na stronę błędu
      if (
        requiredRoles.length > 0 && // Jeśli role są wymagane
        !requiredRoles.some((role) => parsedRoles.includes(role)) // Jeśli użytkownik nie ma odpowiednich ról
      ) {
        return navigateTo('/error'); // Przekierowanie na stronę błędu
      }
    }
  }
});
