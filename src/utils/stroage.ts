export const key = 'fms';
/**
 * localStorage
 */
export const setStore = (name: string, content: any) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(`${key}_${name}`, content);
}

export const getStore = (name: string) => {
    if (!name) return;
    return window.localStorage.getItem(`${key}_${name}`);
}

export const removeStore = (name: string) => {
    if (!name) return;
    window.localStorage.removeItem(`${key}_${name}`);
}

export const removeAllStore = () => {
    window.localStorage.clear();
}


