import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';

import * as groupAPI from './groupApi';
import * as memberAPI from '../member/memberApi';
import * as groupAction from './groupAction';
import * as menuAPI from '@store/menu/menuApi';
import commonUtil from '@utils/commonUtil';

/**
 * 그룹목록
 */
const getGroupList = callApiAfterActions(groupAction.GET_GROUP_LIST, groupAPI.getGroupList, (state) => state.group);

/**
 * 그룹데이터 조회
 */
const getGroup = createRequestSaga(groupAction.GET_GROUP, groupAPI.getGroup);

function* getGroupMenuAuthList({ type, payload }) {
    const ACTION = type;
    let callbackData;

    yield put(startLoading(ACTION));

    try {
        const response = yield call(menuAPI.getMenuTree, { grpMemId: payload, grpMemDiv: 'G' });

        const serverData = response.data.body.children;
        const treeInfos = commonUtil.makeRCTreeData(serverData);

        //const used = yield call(toGroupMenuUsed, serverData, 'usedYn');
        //const edited = yield call(toGroupMenuUsed, serverData, 'editYn');

        if (response.data.header.success) {
            yield put({
                type: `${ACTION}_SUCCESS`,
                payload: treeInfos,
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

function* updateGroupMenuAuth({ type, payload: { groupCd, changeMenuAuthList, callback } }) {
    yield startLoading('group/GET_GROUP_MENU_LIST');

    const response = yield call(groupAPI.updateGroupMenuAuth, groupCd, changeMenuAuthList);
    callback(response.data);

    yield finishLoading('group/GET_GROUP_MENU_LIST');
}

function* getGroupInMemberList({ type, payload: { search } }) {
    yield put(startLoading(type));
    try {
        const response = yield call(memberAPI.getMemberList, { search });
        const groupInMember = response.data.body.list;
        const total = response.data.body.totalCnt;
        if (response.data.header.success) {
            yield put({
                type: `${type}_SUCCESS`,
                payload: { list: groupInMember, total },
            });
        } else {
            yield put({
                type: `${type}_FAILURE`,
                payload: { list: [], total: 0 },
            });
        }
    } catch (e) {
        console.log(e);
    }
    yield put(finishLoading(type));
}

function* getSearchMemberList({ type, payload: { name, search } }) {
    yield put(startLoading(type));
    try {
        const response = yield call(memberAPI.getMemberList, { search });
        const searchMembers = response.data.body.list;
        const total = response.data.body.totalCnt;

        if (response.data.header.success) {
            yield put({
                type: `${type}_SUCCESS`,
                payload: { list: searchMembers, total },
            });
        } else {
            yield put({
                type: `${type}_FAILURE`,
                payload: {
                    list: [],
                    total: 0,
                },
            });
        }
    } catch (e) {
        console.log(e);
    }

    yield put(finishLoading(type));
}

function* updateGroupInMember({ type, payload: { groupCd, memberIds, useYn, callback } }) {
    yield put(startLoading(type));

    const response = yield call(groupAPI.updateGroupInMember, groupCd, memberIds, useYn);
    callback(response.data);

    yield put(finishLoading(type));
}

function toSearchUserList(allMembers, groupUsers) {
    return allMembers.filter((searchUser) => groupUsers.filter((groupUser) => groupUser.memberId === searchUser.memberId).length === 0);
}

export default function* groupSaga() {
    yield takeLatest(groupAction.GET_GROUP_LIST, getGroupList);
    yield takeLatest(groupAction.GET_GROUP, getGroup);
    yield takeLatest(groupAction.DUPLICATE_GROUP_CHECK, duplicateGroupCheck);
    yield takeLatest(groupAction.SAVE_GROUP, saveGroup);
    yield takeLatest(groupAction.DELETE_GROUP, deleteGroup);
    yield takeLatest(groupAction.HAS_RELATION_LIST, hasRelationList);
    yield takeLatest(groupAction.GET_GROUP_MENU_AUTH, getGroupMenuAuthList);
    yield takeLatest(groupAction.UPDATE_GROUP_MENU_AUTH, updateGroupMenuAuth);
    yield takeLatest(groupAction.GET_GROUP_IN_MEMBER_LIST, getGroupInMemberList);
    yield takeLatest(groupAction.GET_SEARCH_MEMBER_LIST, getSearchMemberList);
    yield takeLatest(groupAction.UPDATE_GROUP_IN_MEMBER, updateGroupInMember);
}
