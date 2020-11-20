import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';
import qs from 'qs';

import * as groupAPI from './groupApi';
import * as groupAction from './groupAction';
import * as menuAPI from '@store/menu/menuApi';

const toGroupMenuTree = (menus) => {
    const treeInfo = { list: [], used: [], edited: [] };
    if (menus && menus.length > 0) {
        menus.map((menu) => {
            const isMenuUsed = menu.usedYn === 'Y';
            const isMenuEdit = isMenuUsed && menu.editYn === 'Y';

            const treeMenu = { key: menu.menuId, title: menu.menuDisplayNm, selectable: false };

            if (isMenuUsed) {
                treeInfo.used.push(menu.menuId);
            }

            if (isMenuEdit) {
                treeInfo.edited.push(menu.menuId);
            }

            if (menu.children) {
                const parentKey = menu.menuId;
                const treeChildrens = [];
                menu.children.map((children) => {
                    const isChildrenUsed = children.usedYn === 'Y' || isMenuUsed;
                    const isChildrenEdit = isChildrenUsed && (children.editYn === 'Y' || isMenuEdit);

                    if (isChildrenUsed) {
                        treeInfo.used.push(children.menuId);
                    }

                    if (isChildrenEdit) {
                        treeInfo.edited.push(children.menuId);
                    }

                    treeChildrens.push({
                        key: children.menuId,
                        title: children.menuDisplayNm,
                        selectable: false,
                        parentKey,
                    });
                });
                treeMenu.children = treeChildrens;
            }
            treeInfo.list.push(treeMenu);
        });
    }

    return treeInfo;
};

/**
 * 그룹목록
 */
const getGroupList = callApiAfterActions(groupAction.GET_GROUP_LIST, groupAPI.getGroupList, (state) => state.group);

/**
 * 그룹데이터 조회
 */
const getGroup = createRequestSaga(groupAction.GET_GROUP, groupAPI.getGroup);

function* getGroupMenuList(payload) {
    const ACTION = payload.type;
    let callbackData;

    yield put(startLoading(ACTION));

    try {
        const response = yield call(menuAPI.getMenuTree, { grpMemId: payload.payload, grpMemDiv: 'G' });
        const data = toGroupMenuTree(response.data.body.children);

        if (response.data.header.success) {
            yield put({
                type: `${ACTION}_SUCCESS`,
                payload: data,
            });
        } else {
            yield put({
                type: `${ACTION}_FAILURE`,
                payload: [],
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 그룹코드 중복 체크
 * @param {string} param0.payload.grpCd 그룹코드
 * @param {func} param0.payload.callback 콜백
 */
function* duplicateGroupCheck({ payload: { groupCd, callback } }) {
    const ACTION = groupAction.duplicateGroupCheck;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(groupAPI.duplicateGroupCdCheck, groupCd);
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(true);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveGroup({ payload: { type, actions, callback } }) {
    const ACTION = groupAction.SAVE_GROUP;
    let callbackData = {};

    yield put(startLoading(ACTION));
    //yield put(startLoading(ACTION));

    try {
        // actions 먼저 처리
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }

        // 도메인 데이터
        const group = yield select((store) => store.group.group);
        const response = type === 'insert' ? yield call(groupAPI.postGroup, { group }) : yield call(groupAPI.putGroups, { group });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: groupAction.GET_GROUP_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: groupAction.GET_GROUP_LIST });

            // auth 도메인 목록 다시 조회
            //yield put(getGroup(group.groupCd));
        } else {
            yield put({
                type: groupAction.GET_GROUP_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: groupAction.GET_GROUP_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 관련데이터 확인
 * @param {string} param0.payload.groupCd 그룹코드
 * @param {func} param0.payload.callback 콜백
 */
function* hasRelationList({ payload: { groupCd, callback } }) {
    const ACTION = groupAction.HAS_RELATION_LIST;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(groupAPI.hasRelationList, { groupCd });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData, groupCd);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 삭제
 * @param {string} param0.payload.groupCd 그룹코드
 * @param {func} param0.payload.callback 콜백
 */
function* deleteGroup({ payload: { groupCd, callback } }) {
    const ACTION = groupAction.DELETE_GROUP;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(groupAPI.deleteGroup, { groupCd });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({ type: groupAction.DELETE_GROUP_SUCCESS });

            // 목록 다시 검색
            yield put({ type: groupAction.GET_GROUP_LIST });

            // auth 도메인 목록 다시 조회
            //yield put(getGroupList());
        } else {
            yield put({
                type: groupAction.DELETE_GROUP_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: groupAction.DELETE_GROUP_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

function* updateMenuAuth({ payload: { groupCd, changeMenuAuthList } }) {
    console.log('groupCd', groupCd);
    console.log('useMenuAuthList', changeMenuAuthList);

    const response = yield call(groupAPI.updateGroupMenuAuth, groupCd, changeMenuAuthList);

    console.log(response);
    console.log('aaa');
}

export default function* groupSaga() {
    yield takeLatest(groupAction.GET_GROUP_LIST, getGroupList);
    yield takeLatest(groupAction.GET_GROUP, getGroup);
    yield takeLatest(groupAction.DUPLICATE_GROUP_CHECK, duplicateGroupCheck);
    yield takeLatest(groupAction.SAVE_GROUP, saveGroup);
    yield takeLatest(groupAction.DELETE_GROUP, deleteGroup);
    yield takeLatest(groupAction.HAS_RELATION_LIST, hasRelationList);
    yield takeLatest(groupAction.getGroupMenuList, getGroupMenuList);
    yield takeLatest(groupAction.updateGroupMenuAuth, updateMenuAuth);
}
