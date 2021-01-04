import produce from 'immer';
import { ValueFormatterService } from 'ag-grid-community';

/**
 * 파일 다운로드
 * @param {object} data blob 데이터
 * @param {string}} filename 파일명
 * @param {string} mime 파일 mime type
 */
const fileDownload = (data, filename, mime) => {
    var blobData = [data];
    var blob = new Blob(blobData, { type: mime || 'application/octet-stream' });
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were
        // revoked by closing the blob for which they were created.
        // These URLs will no longer resolve as the data backing
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var blobURL = window.URL && window.URL.createObjectURL ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);
        var tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobURL;
        tempLink.setAttribute('download', filename);

        // Safari thinks _blank anchor are pop ups. We only want to set _blank
        // target if the browser does not support the HTML5 download attribute.
        // This allows you to download files in desktop safari if pop up blocking
        // is enabled.
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }

        document.body.appendChild(tempLink);
        tempLink.click();

        // Fixes "webkit blob resource error 1"
        setTimeout(function () {
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);
        }, 200);
    }
};

/**
 * blob To File
 * @param {any} blob blob
 * @param {string} fileName 저장할 파일명
 * @param {string} contentType contentType
 */
const blobToFile = (blob, fileName, contentType) => {
    return new File([blob], fileName, { type: contentType });
};

/**
 * 문자열이 빈값인지 체크
 * @param {*} str 문자열
 */
const isEmpty = (str) => {
    return (typeof str == 'string' && !str.trim()) || typeof str == 'undefined' || str === null;
};

/**
 * TreeInfo List Key가 일치하는 TreeNode를 찾는다.
 * @param list TreeInfo List
 * @param key 검색할 Key
 * @returns TreeInfo List Key가 일치하는 TreeNode
 */
function findNode(list, key) {
    let result = null;
    let idx = 0;
    let childrenList = [];
    while (idx < list.length && list[idx].key !== key) {
        if (list[idx].children) {
            childrenList = [...childrenList, ...list[idx].children];
        }
        idx++;
    }

    if (list.length > 0 && idx === list.length) {
        result = findNode(childrenList, key);
    } else {
        result = list[idx];
    }

    return result;
}

/**
 * 매개변수로 전달받은 TreeInfo를 이용해 TreeNode의 자식 Key를 찾는다.
 * @param list TreeInfo List
 * @param info TreeInfo
 * @returns TreeNode 자식 Key List
 */
function findChildNodeKeys(list, info) {
    let childKeys = [];
    if (info.children) {
        childKeys = info.children.map((child) => child.key);
        for (const childKey of childKeys) {
            const childInfo = findNode(list, childKey);
            if (childInfo.children) {
                childKeys = [...childKeys, ...findChildNodeKeys(list, childInfo)];
            }
        }
    }

    return childKeys;
}

/**
 * 매개변수로 전달받은 TreeInfo를 이용해 TreeNode의 부모 Key를 찾는다.
 * @param list TreeInfo List
 * @param info TreeInfo
 * @returns TreeNode 부모 Key List
 */
function findParentNodeKeys(list, info) {
    let parentKeys = [];
    let parentKey = info.parentKey;
    let parentNode = findNode(list, parentKey);

    while (parentKey && parentKey.parentKey !== '00' && parentNode !== undefined) {
        parentKeys = [...parentKeys, parentKey];
        parentKey = parentNode.parentKey;
        parentNode = findNode(list, parentKey);
    }

    return parentKeys;
}

/**
 * 서버에서 전달 받은 Data를 이용하여 TreeList로 변환한다.
 * @param serverData 서버에서 전달받은 데이터
 * @returns TreeList
 */
const toTreeList = (serverData) => {
    return serverData.map((data) => {
        let treeInfos = { key: data.menuId, title: data.menuDisplayNm, selectable: false };
        const parentKey = data.parentMenuId;
        if (parentKey) {
            treeInfos = { ...treeInfos, parentKey };
        }

        if (data.children) {
            const childrenList = toTreeList(data.children);
            treeInfos.children = childrenList;
        }

        return treeInfos;
    });
};

/**
 * 서버에서 전달받은 Data를 이용하여 체크된 Key에 대한 목록으로 변환한다..
 * @param treeInfos Tree 정보
 * @param serverData 서버에서 전달받은 Data
 * @param type 찾을 타입(editYn, usedYn)
 * @returns 체크된 Key에 대한 목록
 */
const toCheckedData = (treeInfos, serverData, type) => {
    let yList = [];
    let halfCheckedKeys = [];
    serverData.forEach((data) => {
        let list = [];
        const menuId = data.menuId;
        const isYn = data[type] === 'Y';

        let childrenLength = 0;
        if (data.children) {
            const node = findNode(treeInfos, menuId);
            const checkData = toCheckedData(treeInfos, data.children, type);
            yList = [...yList, ...checkData['yList']];
            halfCheckedKeys = [...halfCheckedKeys, ...checkData['halfCheckedKeys']];
            childrenLength = findChildNodeKeys(treeInfos, node).length;
        }

        if (isYn) {
            if (list.length === childrenLength) {
                yList.push(menuId);
            } else {
                halfCheckedKeys.push(menuId);
            }
        }
    });
    return { yList, halfCheckedKeys };
};

/**
 * 서버에서 전달받은 Data를 이용하여 RC-Tree에 필요한 Data로 만든다.
 * @param serverData 서버에서 전달받은 Data
 * @returns RC-Tree Data
 */
function makeRCTreeData(serverData) {
    const list = toTreeList(serverData);
    const useKeys = toCheckedData(list, serverData, 'usedYn');
    const used = useKeys['yList'];
    const halfCheckedKeys = useKeys['halfCheckedKeys'];
    const editedKeys = toCheckedData(list, serverData, 'editYn');
    const edited = [...editedKeys['yList'], ...editedKeys['halfCheckedKeys']];

    return { list, used, edited, halfCheckedKeys };
}

/**
 * 이미지 비율을 유지한 채로 프리뷰를 생성한다
 * @param {string} src 이미지 src
 * @param {object} ele img element
 * @param {object} wrapperEle img를 담고 있는 wrapper element
 * @param {func} loadFunc onload 실행
 * @param {func} errorFunc onerror 실행
 */
const makeImgPreview = (src, ele, wrapperEle, loadFunc, errorFunc) => {
    if (ele && ele.src === src) return;

    let image = new Image();
    image.src = src;
    image.onload = (imgProps) => {
        let w = imgProps.path[0].width;
        let h = imgProps.path[0].height;
        let rate = 1;

        if (ele) {
            ele.src = src;
        }
        if (wrapperEle) {
            rate = (wrapperEle.innerWidth || wrapperEle.offsetWidth) / (wrapperEle.innerHeight || wrapperEle.offsetHeight);
        }
        if (w / h > rate) {
            ele.className = 'landscape';
        } else {
            ele.className = 'portrait';
        }

        if (typeof loadFunc === 'function') loadFunc(imgProps);
    };
    image.onerror = () => {
        if (typeof errorFunc === 'function') errorFunc();
    };
};

/**
 * 타이틀 byte 계산
 * @param {String} text 타이틀
 */
const euckrBytes = (text) => {
    const euckrLength = ((s, b = 0, i = 0, c = 0) => {
        // eslint-disable-next-line no-cond-assign
        for (i = 0; (c = s.charCodeAt(i++)); b += c >= 128 ? 2 : 1);
        return b;
    })(text);
    return euckrLength;
};

const dateFormat = (date, format) => {
    if (!date.valueOf()) return '';

    const weekKorName = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekKorShortName = ['일', '월', '화', '수', '목', '금', '토'];
    const weekEngName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekEngShortName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return format.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function (formatter) {
        switch (formatter) {
            case 'yyyy':
                return date.getFullYear(); // 년 (4자리)
            case 'yy':
                return String(date.getFullYear() % 1000).padStart(2, '0'); // 년 (2자리)
            case 'MM':
                return String(date.getMonth() + 1).padStart(2, '0'); // 월 (2자리)
            case 'dd':
                return String(date.getDate()).padStart(2, '0'); // 일 (2자리)
            case 'KS':
                return weekKorShortName[date.getDay()]; // 요일 (짧은 한글)
            case 'KL':
                return weekKorName[date.getDay()]; // 요일 (긴 한글)
            case 'ES':
                return weekEngShortName[date.getDay()]; // 요일 (짧은 영어)
            case 'EL':
                return weekEngName[date.getDay()]; // 요일 (긴 영어)
            case 'HH':
                return date.getHours().padStart(2, '0'); // 시간 (24시간 기준, 2자리)
            case 'hh':
                return String(date.getHours() % 12 ? date.getHours() % 12 : 12).padStart(2, '0'); // 시간 (12시간 기준, 2자리)
            case 'mm':
                return String(date.getMinutes()).padStart(2, '0'); // 분 (2자리)
            case 'ss':
                return String(date.getSeconds()).padStart(2, '0'); // 초 (2자리)
            case 'a/p':
                return date.getHours() < 12 ? '오전' : '오후'; // 오전/오후 구분
            default:
                return formatter;
        }
    });
};

export const setDefaultValue = (value, defaultValue = '') => {
    return value !== null && value !== undefined && value !== '' ? value : defaultValue;
};

export default {
    fileDownload,
    blobToFile,
    isEmpty,
    findNode,
    findChildNodeKeys,
    findParentNodeKeys,
    makeRCTreeData,
    makeImgPreview,
    euckrBytes,
    dateFormat,
    setDefaultValue,
};

/**
 * 미리보기 팝업띄움.
 */
export const popupPreview = (targetUrl, params, enctype = null) => {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = targetUrl;
    form.target = '_blank';
    if (enctype !== null) {
        form.enctype = 'multipart/form-data';
    }

    const addField = (fieldName, fieldValue) => {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = fieldName;
        hiddenField.value = fieldValue;
        form.appendChild(hiddenField);
    };

    const addArray = (arrName, arrValue) => {
        for (let i = 0; i < arrValue.length; i++) {
            if (typeof arrValue[i] === 'object') {
                var key = `${arrName}[${i}]`;
                addObject(key, arrValue[i]);
            } else {
                addField(arrName, arrValue[i]);
            }
        }
    };

    const addObject = (objKey, objValue) => {
        for (const loopKey in objValue) {
            if (objValue.hasOwnProperty(loopKey)) {
                var key = `${objKey === undefined ? '' : objKey + '.'}${loopKey}`;
                const value = produce(objValue[loopKey], (draft) => draft);
                if (value instanceof Array) {
                    addArray(key, value);
                } else if (typeof value === 'object') {
                    addObject(key, value);
                } else {
                    addField(key, value);
                }
            }
        }
    };

    addObject(undefined, params);

    document.getElementsByTagName('body')[0].appendChild(form);
    form.submit();
    form.remove();

    // // 폼 생성
    // const f = document.createElement('form');
    // f.setAttribute('method', 'post');
    // f.setAttribute('action', targetUrl);
    // f.setAttribute('target', '_blank');
    // if (enctype !== null) {
    //     f.setAttribute('enctype', 'multipart/form-data');
    // }

    // // eslint-disable-next-line no-restricted-syntax
    // for (const propName in item) {
    //     if (typeof item[propName] === 'object') {
    //         const subObject = item[propName];
    //         // eslint-disable-next-line no-restricted-syntax
    //         for (const inPropName in subObject) {
    //             typeof subObject[inPropName] === 'object' ? console.log('obj') : console.log('not obj');
    //             if (Object.prototype.hasOwnProperty.call(subObject, inPropName)) {
    //                 const input = document.createElement('input');
    //                 input.type = 'hidden';
    //                 input.name = `${propName}.${inPropName}`;
    //                 input.value = item[propName][inPropName];
    //                 f.appendChild(input);
    //             }
    //         }
    //     } else if (Object.prototype.hasOwnProperty.call(item, propName)) {
    //         const input = document.createElement('input');
    //         input.type = 'hidden';
    //         input.name = propName;
    //         input.value = item[propName];
    //         f.appendChild(input);
    //     }
    // }

    // document.getElementsByTagName('body')[0].appendChild(f);
    // f.submit();
    // f.remove();
};

/**
 * Delay
 * @param {number} n delay
 */
export const delay = (n) => new Promise((resolve) => setTimeout(resolve, n));

/**
 * cancellablePromise
 */
export const cancellablePromise = (promise) => {
    let isCanceled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            (value) => (isCanceled ? reject({ isCanceled, value }) : resolve(value)),
            (error) => reject({ isCanceled, error }),
        );
    });

    return {
        promise: wrappedPromise,
        cancel: () => (isCanceled = true),
    };
};
