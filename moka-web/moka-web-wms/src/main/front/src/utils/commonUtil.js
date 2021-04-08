import produce from 'immer';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';

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
 * base64 To blob
 * @param {string} dataURI base64이미지
 */
const base64ToBlob = (dataURI) => {
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
    } else {
        byteString = unescape(dataURI.split(',')[1]);
    }

    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
};

/**
 * blob To File
 * @param {any} blob blob
 * @param {string} fileName 저장할 파일명
 */
const blobToFile = (blob, fileName) => {
    let extension = blob.type.split('/')[1];
    if (extension === 'jpeg') {
        extension = 'jpg';
    }
    return new File([blob], fileName + `.${extension}`, { type: blob.type });
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

    return { list, used, edited, halfCheckedKeys, usedOrg: [...used, ...halfCheckedKeys], editedOrg: edited };
}

/**
 * 타이틀 byte 계산
 * @param {String} text 타이틀
 */
const euckrBytes = (text) => {
    if (text) {
        const euckrLength = ((s, b = 0, i = 0, c = 0) => {
            // eslint-disable-next-line no-cond-assign
            for (i = 0; (c = s.charCodeAt(i++)); b += c >= 128 ? 2 : 1);
            return b;
        })(text);
        return euckrLength;
    } else {
        return 0;
    }
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

const setDefaultValue = (value, defaultValue = '') => {
    return value !== null && value !== undefined && value !== '' ? value : defaultValue;
};

/**
 * 미리보기 데이터 셋팅
 */
const setPreviewData = (form, data) => {
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

    addObject(undefined, data);
};

/**
 * 아티클페이지 미리보기 window.open
 * @param {string} targetUrl submit target url
 * @param {object} params 미리보기 데이터
 * @param {string} winOptions window의 options text
 * @param {*} enctype enctype 여부
 */
const winOpenPreview = (targetUrl, params, winOptions = 'width=665,height=680,location=1,status=1,scrollbars=1,resizable=1', enctype = null) => {
    window.open('about:blank', 'winOpenPreview', winOptions);
    const form = document.createElement('form');
    form.action = targetUrl;
    form.method = 'post';
    form.target = 'winOpenPreview';
    if (enctype !== null) form.enctype = 'multipart/form-data';
    setPreviewData(form, params);
    document.getElementsByTagName('body')[0].appendChild(form);
    form.submit();
    form.remove();
};

/**
 * 아티클페이지 미리보기 new Tab
 * @param {string} targetUrl submit target url
 * @param {object} params 미리보기 데이터
 * @param {*} enctype enctype 여부
 */
const newTabPreview = (targetUrl, params, enctype = null) => {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = targetUrl;
    form.target = '_blank';
    if (enctype !== null) form.enctype = 'multipart/form-data';
    setPreviewData(form, params);
    document.getElementsByTagName('body')[0].appendChild(form);
    form.submit();
    form.remove();
};

/**
 * Delay
 * @param {number} n delay
 */
const delay = (n) => new Promise((resolve) => setTimeout(resolve, n));

/**
 * cancellablePromise
 */
const cancellablePromise = (promise) => {
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

/**
 * dateType에 따른 날짜를 가져온다.(종료일은 오늘)
 * @param dateType 날짜 타입(today: 오늘, thisWeek: 이번주, thisMonth: 이번달, thisYear: 올해)
 * @returns {{startDt: string, endDt: string}}
 */
export const toRangeDateForDateType = (dateType) => {
    const today = moment();
    let startDt = today;
    const endDt = today.set('hour', 23).set('minute', 59).set('seconds', 59).format(DB_DATEFORMAT);
    switch (dateType) {
        case 'today':
            startDt = today;
            break;
        case 'thisWeek':
            startDt = today.day(1);
            break;
        case 'thisMonth':
            startDt = today.set('date', 1);
            break;
        case 'thisYear':
            startDt = today.set('month', 0).set('date', 1);
            break;
        default:
            break;
    }
    startDt = startDt.set('hour', 0).set('minute', 0).set('seconds', 0).format(DB_DATEFORMAT);

    return { startDt, endDt };
};

export const validateForDateRange = (startDt, endDt) => {
    const diff = moment(endDt).diff(moment(startDt));

    let message = '시작일은 종료일 보다 클 수 없습니다.';
    if (diff < 0) {
        message = '종료일은 시작일 보다 작을 수 없습니다.';
    }

    console.log(diff, message);
};

/**
 * 코드를 코드리스트에 포함된 한글명으로 치환한다.
 * @param code 코드
 * @param codes 코드리스트
 * @returns {*|string}
 */
export const toKorFromCode = (code, codes) => {
    const codeItem = codes.filter((data) => data.key === code)[0];
    return codeItem ? codeItem.value : '';
};

/**
 * merge array
 * @param {object} param key등
 * @param {...any} arrays merge할 array리스트
 */
const mergeArray = ({ key }, ...arrays) => {
    const merged_obj = arrays.reduce((all, cv) => {
        const nob = cv.reduce((a, cu) => {
            const name = cu[key];
            return {
                ...a,
                [name]: cu,
            };
        }, {});
        return {
            ...all,
            ...nob,
        };
    }, {});

    const val = Object.values(merged_obj);
    return val;
};

/**
 * unique key 생성 (함수 변경 필요함)
 * @returns 키생성
 */
const getUniqueKey = () => {
    return new Date().getTime();
};

export default {
    fileDownload,
    base64ToBlob,
    blobToFile,
    isEmpty,
    findNode,
    findChildNodeKeys,
    findParentNodeKeys,
    makeRCTreeData,
    euckrBytes,
    dateFormat,
    setDefaultValue,
    delay,
    cancellablePromise,
    newTabPreview,
    winOpenPreview,
    toRangeDateForDateType,
    validateForDateRange,
    toKorFromCode,
    mergeArray,
    getUniqueKey,
};
