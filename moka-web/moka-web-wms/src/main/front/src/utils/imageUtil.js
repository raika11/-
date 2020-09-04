import { API_BASE_URL } from '~/constants';

/**
 * Wms 도메인을 붙인 src 리턴
 * @param {string} imgSrc 오리지널 src
 */
export const setWmsImgSrc = (imgSrc) => {
    if (!imgSrc || imgSrc === '') {
        return undefined;
    }
    return `${API_BASE_URL}${imgSrc}?t=${new Date().getTime()}`;
};

/**
 * Wms 도메인을 제거한 src 리턴
 * @param {string} imgSrc 도메인 있는 이미지
 * @param {string} path 추가적으로 지우고 싶은 path
 */
export const removeImgDomain = (imgSrc, path) => {
    try {
        if (imgSrc) {
            let srcNoDomain = imgSrc.replace(API_BASE_URL, '').split('?')[0];
            if (path) {
                srcNoDomain = srcNoDomain.srcNoDomain.replace(path, '');
            }
            return srcNoDomain;
        }
        return imgSrc;
    } catch (e) {
        return imgSrc;
    }
};

/**
 * 두 이미지가 동일한 이미지인지 비교한다
 * @param {string} imgSrc 현재 이미지
 * @param {string} target 타겟이미지
 */
export const checkSameImg = (imgSrc, target) => {
    try {
        let src = target.replace(API_BASE_URL, '').split('?')[0];
        if (imgSrc === src) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
};

/**
 * 이미지링크를 base64이미지로 변환
 * @param {string} url 이미지링크
 * @param {func} callback callback
 */
export const imgToDataUrl = (url, callback) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        let reader = new FileReader();
        reader.onloadend = () => {
            if (callback) {
                callback(reader.result);
            }
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
};
