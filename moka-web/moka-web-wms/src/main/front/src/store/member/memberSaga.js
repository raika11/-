import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';

import * as memberAPI from './memberApi';
import * as memberAction from './memberAction';
import * as menuAPI from '@store/menu/menuApi';
import commonUtil from '@utils/commonUtil';

/**
 * 목록
 */
//const getMemberList = callApiAfterActions(memberAction.GET_MEMBER_LIST, memberAPI.getMemberList, (state) => state.member);
function* getMemeberAuthMenuList({ type, payload }) {
    const ACTION = type;
    let callbackData;

    try {
        const response = yield call(menuAPI.getMenuTree, { grpMemId: payload, grpMemDiv: 'U' });

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
        yield put({
            type: `${ACTION}_FAILURE`,
            payload: callbackData,
        });
    }

    yield put(finishLoading(ACTION));
}

function* updateMemberMenuAuth({ type, payload: { memberId, changeMenuAuthList, callback } }) {
    yield startLoading('member/GET_MEMBER_MENU_AUTH_LIST');

    const response = yield call(memberAPI.updateMemberMenuAuth, memberId, changeMenuAuthList);
    callback(response.data);

    yield finishLoading('member/GET_MEMBER_MENU_AUTH_LIST');
}

/**
 * 사용 목록 조회
 */
function* getMemberList({ payload }) {
    const ACTION = memberAction.GET_MEMBER_LIST;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        if (payload && payload.length > 0) {
            for (let i = 0; i < payload.length; i++) {
                const act = payload[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }

        const search = yield select((store) => store.member.search);
        const statusList = yield select((store) => store.app.MEMBER_STATUS_CODE);
        const response = yield call(memberAPI.getMemberList, { search });

        if (response.data.header.success) {
            callbackData = response.data;
            response.data.body.list = response.data.body.list.map((member) => {
                //상태 코드명 추가
                const statusNm = getStatusName(statusList, member.status);
                return {
                    ...member,
                    statusNm,
                };
            });

            yield put({
                type: memberAction.GET_MEMBER_LIST_SUCCESS,
                payload: response.data,
                meta: response,
            });
        } else {
            yield put({
                type: memberAction.GET_MEMBER_LIST_FAILURE,
                payload: response.data,
                error: true,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: memberAction.GET_MEMBER_LIST_FAILURE,
            payload: callbackData,
        });
    }
    yield put(finishLoading(ACTION));
}

function getStatusName(statusList, statusCode) {
    let statusName = '';
    for (let i = 0; i < statusList.length; i++) {
        const status = statusList[i];
        if (status.code === statusCode) {
            statusName = status.name;
            return statusName;
        }
    }
    return statusName;
}

/**
 * 데이터 조회
 */
const getMember = createRequestSaga(memberAction.GET_MEMBER, memberAPI.getMember);

/**
 * 사용자아이디 중복 체크
 * @param {string} param0.payload.memberId 사용자아이디
 * @param {func} param0.payload.callback 콜백
 */
function* duplicateCheck({ payload: { memberId, callback } }) {
    const ACTION = memberAction.DUPLICATE_CHECK;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(memberAPI.duplicateCheck, memberId);
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
function* saveMember({ payload: { type, actions, callback } }) {
    const ACTION = memberAction.SAVE_MEMBER;
    let callbackData = {};

    yield put(startLoading(ACTION));

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

        // 사용자 데이터
        const member = yield select((store) => store.member.member);
        const response = type === 'insert' ? yield call(memberAPI.postMember, { member }) : yield call(memberAPI.putMember, { member });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: memberAction.GET_MEMBER_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: memberAction.GET_MEMBER_LIST });
        } else {
            yield put({
                type: memberAction.GET_MEMBER_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: memberAction.GET_MEMBER_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 로그인 이력 조회
 */
const getLoginHistoryList = callApiAfterActions(memberAction.GET_LOGIN_HISTORY_LIST, memberAPI.getLoginHistoryList, (state) => state.member);

export default function* memberSaga() {
    yield takeLatest(memberAction.GET_MEMBER_LIST, getMemberList);
    yield takeLatest(memberAction.GET_MEMBER, getMember);
    yield takeLatest(memberAction.DUPLICATE_CHECK, duplicateCheck);
    yield takeLatest(memberAction.SAVE_MEMBER, saveMember);
    yield takeLatest(memberAction.GET_LOGIN_HISTORY_LIST, getLoginHistoryList);
    yield takeLatest(memberAction.GET_MEMBER_MENU_AUTH, getMemeberAuthMenuList);
    yield takeLatest(memberAction.updateMemberMenuAuth, updateMemberMenuAuth);
}
