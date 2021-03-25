import { takeLatest, put, select, call } from 'redux-saga/effects';
import toast from '@/utils/toastUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { createRequestSaga, callApiAfterActions, errorResponse } from '@store/commons/saga';
import * as act from './jpodAction';
import * as api from './jpodApi';

/**
 * 팟티 목록
 */
const getChannelPodtyListsaga = callApiAfterActions(act.GET_CHANNEL_PODTY_LIST, api.getPodtyChannels, (store) => store.jpod.podtyChannel);

/**
 * 모든 채널 목록 조회
 */
const getTotalChnlList = callApiAfterActions(act.GET_TOTAL_CHNL_LIST, api.getChnlList, ({ jpod }) => jpod.totalChannel.search);

/**
 * 채널 목록
 */
const getChnlList = createRequestSaga(act.GET_CHNL_LIST, api.getChnlList);

/**
 * 채널 상세
 */
const getChnl = createRequestSaga(act.GET_CHNL, api.getChnl);

/**
 * 채널 > 에피소드
 */
const getChnlEpsdList = createRequestSaga(act.GET_CHNL_EPSD_LIST, api.getEpsdList);

/**
 * 에피소드 목록
 */
const getEpsdList = createRequestSaga(act.GET_EPSD_LIST, api.getEpsdList);

/**
 * 에피소드 상세
 */
const getEpsd = createRequestSaga(act.GET_EPSD, api.getEpsd);

const getPodtyEpisodeListSaga = callApiAfterActions(act.GET_PODTY_EPISODE_LIST, api.getPodtyEpisodesList, (store) => store.jpod.podtyEpisode);

/**
 * 채널 저장
 */
function* saveChnl({ payload: { chnl, callback } }) {
    const ACTION = act.SAVE_CHNL;
    yield put(startLoading(ACTION));
    let callbackData = {};
    let response;

    try {
        if (chnl.chnlSeq) {
            response = yield call(api.putChnl, { chnl });
        } else {
            response = yield call(api.postChnl, { chnl });
        }
        callbackData = response.data;

        if (response.data.header.success) {
            // // 성공 액션 실행 => 데이터 업데이트 치면 안됨 관련 정보를 빠져서 옴
            // yield put({
            //     type: act.GET_CHNL_SUCCESS,
            //     payload: response.data,
            // });

            // 목록 다시 검색
            const search = yield select(({ jpod }) => jpod.channel.search);
            yield put({ type: act.GET_CHNL_LIST, payload: { search } });
        } else {
            const { body } = response.data;
            if (body && body.list && Array.isArray(body.list)) {
                // invalidList 셋팅
                yield put({
                    type: act.CHANGE_CHNL_INVALID_LIST,
                    payload: body.list,
                });
            }
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 에피소드 저장
 */
function* saveEpsd({ payload: { epsd, callback } }) {
    const ACTION = act.SAVE_EPSD;
    let callbackData = {};
    let response;

    yield put(startLoading(ACTION));
    try {
        if (epsd.chnlSeq && epsd.epsdSeq) {
            response = yield call(api.putEpsd, { epsd });
        } else {
            response = yield call(api.postEpsd, { epsd });
        }
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 다시 검색
            const search = yield select(({ jpod }) => jpod.episode.search);
            yield put({ type: act.GET_EPSD_LIST, payload: { search } });
        } else {
            const { body } = response.data;
            if (body && body.list && Array.isArray(body.list)) {
                // invalidList 셋팅
                yield put({
                    type: act.CHANGE_EPSD_INVALID_LIST,
                    payload: body.list,
                });
            }
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 채널 삭제
 */
function* deleteChnl({ payload: { chnlSeq, callback } }) {
    const ACTION = act.DELETE_CHNL;
    let callbackData = {};
    let response;

    yield put(startLoading(ACTION));
    try {
        response = yield call(api.deleteChnl, { chnlSeq: chnlSeq });
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 다시 검색
            const search = yield select(({ jpod }) => jpod.channel.search);
            yield put({ type: act.GET_CHNL_LIST, payload: { search } });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

// 브라이트 코브 목록 조회.
function* getBrightOvpSaga() {
    yield put(startLoading(act.GET_BRIGHT_OVP));

    let response;
    try {
        const search = yield select((state) => state.jpod.brightOvp.search);
        response = yield call(api.getBrightOvp, { search: search });
        const {
            status,
            data: { body },
        } = response;
        if (status !== 200) {
            throw new Error('네트워크가 불안정 합니다. 다시 시도해 주세요.');
        }
        const resultObject = JSON.parse(body);
        const list = resultObject.map((element) => {
            return {
                id: element.id,
                account_id: element.account_id,
                name: element.name,
                complete: element.complete,
                state: element.state,
                created_at: element.created_at,
            };
        });
        yield put({ type: act.GET_BRIGHT_OVP_SUCCESS, payload: { list: list, total: list.length } });
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(act.GET_BRIGHT_OVP));
}

// 브라이트 코브 저장.
function* saveBrightovpSaga({ payload: { ovpdata, callback } }) {
    yield put(startLoading(act.SAVE_BRIGHTOVP));

    let callbackData = {};
    let response;

    try {
        if (ovpdata) {
            response = yield call(api.saveBrightOvp, { ovpdata: ovpdata });
        }

        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }
    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(act.SAVE_BRIGHTOVP));
}

/**
 * J팟 채널 게시판 조회
 */
function* getJpodBoard() {
    const ACTION = act.GET_JPOD_BOARD;
    let callbackData, response;

    yield put(startLoading(ACTION));

    try {
        response = yield call(api.getJpodBoard, {
            // J팟 채널 게시판은 한 개만 존재함
            search: {
                usedYn: 'Y',
                boardType: 'S',
                channelType: 'BOARD_DIVC1',
            },
        });

        callbackData = response.data;

        if (response.data.header.success) {
            yield put({ type: act.GET_JPOD_BOARD_SUCCESS, payload: callbackData });
            const search = yield select(({ jpod }) => jpod.jpodNotice.search);
            yield put({ type: act.CHANGE_JPOD_NOTICE_SEARCH_OPTION, payload: { ...search, boardId: callbackData.body.list[0].boardId } });
        } else {
            toast.error(callbackData.header.message);
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 게시판 채널 (JPOD) 목록 조회
 */
function* getBoardChannelList() {
    const ACTION = act.GET_JPOD_CHANNEL_LIST;
    let callbackData, response;

    yield put(startLoading(ACTION));

    try {
        response = yield call(api.getBoardJpodChannalList);

        callbackData = response.data;

        if (response.data.header.success) {
            let tempList = callbackData.body.list.map((data) => {
                return {
                    name: data.chnlNm,
                    value: data.chnlSeq,
                };
            });
            yield put({ type: act.GET_JPOD_CHANNEL_LIST_SUCCESS, payload: tempList });
        } else {
            toast.error(callbackData.header.message);
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    yield put(finishLoading(ACTION));
}

/**
 * J팟 공지 게시판 목록 조회
 */
export const getJpodNoticeList = callApiAfterActions(act.GET_JPOD_NOTICE_LIST, api.getJpodNoticeList, (store) => store.jpod.jpodNotice);

/**
 * J팟 공지 게시판 상세 조회
 */
function* getJpodNoticeContents({ payload: { boardId, boardSeq } }) {
    const ACTION = act.GET_JPOD_NOTICE_CONTENTS;
    let callbackData, response;

    yield put(startLoading(ACTION));

    try {
        response = yield call(api.getJpodNoticeContents, { boardId: boardId, boardSeq: boardSeq });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({ type: act.GET_JPOD_NOTICE_CONTENTS_SUCCESS, payload: callbackData });
        } else {
            // 에러
            toast.error(callbackData.header.message);
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    yield put(finishLoading(ACTION));
}

export default function* jpodSaga() {
    /**
     * 팟티
     */
    yield takeLatest(act.GET_CHANNEL_PODTY_LIST, getChannelPodtyListsaga);

    /**
     * 모든 채널 조회 (useTotal === Y)
     */
    yield takeLatest(act.GET_TOTAL_CHNL_LIST, getTotalChnlList);

    /**
     * 채널
     */
    yield takeLatest(act.GET_CHNL_LIST, getChnlList);
    yield takeLatest(act.GET_CHNL, getChnl);
    yield takeLatest(act.SAVE_CHNL, saveChnl);
    yield takeLatest(act.DELETE_CHNL, deleteChnl);
    yield takeLatest(act.GET_CHNL_EPSD_LIST, getChnlEpsdList);

    /**
     * 에피소드
     */
    yield takeLatest(act.GET_EPSD_LIST, getEpsdList);
    yield takeLatest(act.GET_EPSD, getEpsd);
    yield takeLatest(act.SAVE_EPSD, saveEpsd);
    yield takeLatest(act.GET_PODTY_EPISODE_LIST, getPodtyEpisodeListSaga); // 에피소드 리스트 가지고 오기.

    yield takeLatest(act.GET_BRIGHT_OVP, getBrightOvpSaga); // 브라이트 코브 목록 조회.
    yield takeLatest(act.SAVE_BRIGHTOVP, saveBrightovpSaga); // 브라이트 코브 저장.

    /**
     * 공지 게시판
     */
    yield takeLatest(act.GET_JPOD_BOARD, getJpodBoard);
    yield takeLatest(act.GET_JPOD_CHANNEL_LIST, getBoardChannelList);
    yield takeLatest(act.GET_JPOD_NOTICE_LIST, getJpodNoticeList);
    yield takeLatest(act.GET_JPOD_NOTICE_CONTENTS, getJpodNoticeContents);
}
