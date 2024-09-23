const TOKEN = 'ecom-token';
const USER = 'ecom-user';
const Lang = 'fr'
const LANG_KEYA="selectedLanguage"
export const saveToken = (token) => {
  window.localStorage.removeItem(TOKEN);
  window.localStorage.setItem(TOKEN, token);
};

export const saveUser = (user) => {
  window.localStorage.removeItem(USER);
  window.localStorage.setItem(USER, JSON.stringify(user));
};



const LANG_KEY = "lang";

export const getlang = () => {
    const lang = localStorage.getItem(LANG_KEY);
    return lang ? JSON.parse(lang) : "fr";
};

export const getlangAdmin = () => {
  const lang = localStorage.getItem(LANG_KEYA);
  return lang ? JSON.parse(lang) : "fr";
};
export const savelang = (lang) => {
    window.localStorage.removeItem(LANG_KEY);
    window.localStorage.setItem(LANG_KEY, JSON.stringify(lang));
};



export const getToken = () => {
  return localStorage.getItem(TOKEN);
};

export const getUser = () => {
  const user = localStorage.getItem(USER);
  return user ? JSON.parse(user) : null;
};

export const getUserId = () => {
  const user = getUser();
  return user ? user.userId : '';
};

export const signOut = () => {
  window.localStorage.removeItem(TOKEN);
  window.localStorage.removeItem(USER);
};

export const isLoggedIn = () => {
  const token = getToken();
  return token ? true : false;
};
