const STORAGE_NAME = 'wms';

/**
 * 로컬스토리지에서 아이템 가져옴
 * @param {string} props.key 키
 */
export const getLocalItem = ({ key }) => {
    if (localStorage.getItem(STORAGE_NAME)) {
        const wmsOptions = JSON.parse(localStorage.getItem(STORAGE_NAME));
        return wmsOptions[key];
    }
    return undefined;
};

/**
 * 로컬스토리지에 아이템 저장
 * @param {string} props.key 키
 * @param {string} props.value 값
 */
export const setLocalItem = ({ key, value }) => {
    let wmsOptions = {
        [key]: value
    };
    if (localStorage.getItem(STORAGE_NAME)) {
        wmsOptions = {
            ...JSON.parse(localStorage.getItem(STORAGE_NAME)),
            [key]: value
        };
    }
    localStorage.setItem(STORAGE_NAME, JSON.stringify(wmsOptions));
};

/**
 * 세션스토리지에서 아이템 가져옴
 * @param {string} props.key 키
 */
export const getSessionItem = ({ key }) => {
    if (sessionStorage.getItem(STORAGE_NAME)) {
        const wmsOptions = JSON.parse(sessionStorage.getItem(STORAGE_NAME));
        return wmsOptions[key];
    }
    return undefined;
};

/**
 * 세션스토리지에 아이템 저장
 * @param {string} props.key 키
 * @param {string} props.value 값
 */
export const setSessionItem = ({ key, value }) => {
    let wmsOptions = {
        [key]: value
    };
    if (sessionStorage.getItem(STORAGE_NAME)) {
        wmsOptions = {
            ...JSON.parse(sessionStorage.getItem(STORAGE_NAME)),
            [key]: value
        };
    }
    sessionStorage.setItem(STORAGE_NAME, JSON.stringify(wmsOptions));
};
