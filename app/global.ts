let globalLoggedIn = false;

export const getLoggedIn = () => globalLoggedIn;
export const setLoggedIn = (value: boolean) => {
    globalLoggedIn = value;
};