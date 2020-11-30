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

        if (typeof loadFunc === 'function') loadFunc();
    };
    image.onerror = () => {
        if (typeof errorFunc === 'function') errorFunc();
    };
};

export default {
    fileDownload,
    isEmpty,
    findNode,
    findChildNodeKeys,
    findParentNodeKeys,
    makeRCTreeData,
    makeImgPreview,
};
