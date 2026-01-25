export const isObjEmpty = (obj?: Record<string | number | symbol, unknown>): boolean => {
    if (!obj) return true;

    return Object.keys(obj).length === 0;
};
