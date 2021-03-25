import { takeLatest, put, select, call } from 'redux-saga/effects';
import toast from '@/utils/toastUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { createRequestSaga, callApiAfterActions, errorResponse } from '@store/commons/saga';
import * as act from './jpodAction';
import * as api from './jpodApi';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * 팟티 목록
 */
const getChannelPodtyListsaga = callApiAfterActions(act.GET_CHANNEL_PODTY_LIST, api.getPodtyChannels, (store) => store.jpod.podtyChannel);

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
const getChnlEpsdList = createRequestSaga(act.GET_CHNL_EPSD_LIST, api.getEpisodes);

const getEpisodesSaga = callApiAfterActions(act.GET_EPISODES, api.getEpisodes, (store) => store.jpod.episode.episodes);
const getPodtyEpisodeListSaga = callApiAfterActions(act.GET_PODTY_EPISODE_LIST, api.getPodtyEpisodesList, (store) => store.jpod.podtyEpisode);
const getEpisodeGubunChannelsSaga = callApiAfterActions(act.GET_EPISODE_GUBUN_CHANNELS, api.getEpisodeChannels, (store) => store.jpod.episode.channel);

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

// 에피소드 정보 등록 수정.
function* saveJpodEpisodeSaga({ payload: { chnlSeq, epsdSeq, episodeinfo, callback } }) {
    yield put(startLoading(act.SAVE_JPOD_EPISODE));

    let callbackData = {};
    let response;

    try {
        if (chnlSeq && epsdSeq) {
            response = yield call(api.updateJpodEpisode, { chnlSeq: chnlSeq, epsdSeq: epsdSeq, episodeinfo: episodeinfo });
        } else {
            response = yield call(api.saveJpodEpisode, { chnlSeq: chnlSeq, episodeinfo: episodeinfo });
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

    yield put(finishLoading(act.SAVE_JPOD_EPISODE));
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

function* getEpisodesInfoSaga({ payload: { chnlSeq, epsdSeq } }) {
    yield put(startLoading(act.GET_EPISODES_INFO));

    let response;
    try {
        response = yield call(api.getEpisodesInfo, { chnlSeq: chnlSeq, epsdSeq: epsdSeq });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: act.GET_EPISODES_INFO_SUCCESS, payload: response.data });
        } else {
            // 에러 나면 서버 에러 메시지 토스트 전달.
            toast.error(message);
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(act.GET_EPISODES_INFO));
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

// 게시판 게시글 리스트 가지고 오기.
function* getJpodNoticeSaga() {
    yield put(startLoading(act.GET_JPOD_NOTICE));

    let response;
    try {
        const search = yield select((store) => store.jpod.jpodNotice.jpodNotices.search);
        const selectBoard = yield select((store) => store.jpod.jpodNotice.selectBoard);

        response = yield call(api.getNoticesList, {
            boardId: selectBoard.boardId,
            search: search,
        });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: act.GET_JPOD_NOTICE_SUCCESS, payload: response.data.body });
        } else {
            // 에러 나면 서버 에러 메시지 토스트 전달.
            toast.error(message);
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(act.GET_JPOD_NOTICE));
}

// 게시글 정보 가지고 오기.
function* getListmenuContentsInfoSaga({ payload: { boardId, boardSeq } }) {
    yield put(startLoading(act.GET_BOARD_CONTENTS));

    let response;
    try {
        response = yield call(api.getBoardContentsInfo, { boardId: boardId, boardSeq: boardSeq });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: act.GET_BOARD_CONTENTS_SUCCESS, payload: response.data });
        } else {
            // 에러 나면 서버 에러 메시지 토스트 전달.
            toast.error(message);
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(act.GET_BOARD_CONTENTS));
}

// 게시판 채널 (JPOD, 기자) 리스트 가지고 와서 조합 해서 store 에 저장.
function* getBoardChannelListSaga() {
    yield put(startLoading(act.GET_BOARD_CHANNEL_LIST));
    let response;
    try {
        response = yield call(api.getBoardJpodChannalList);

        const {
            header: { success, message },
            body: { list },
        } = response.data;

        if (success === true) {
            let tempList = list.map((data) => {
                return {
                    name: data.chnlNm,
                    value: data.chnlSeq,
                };
            });
            yield put({ type: act.GET_BOARD_CHANNEL_LIST_SUCCESS, payload: tempList });
        } else {
            toast.error(message);
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(act.GET_BOARD_CHANNEL_LIST));
}

function* getJpodBoardSaga() {
    yield put(startLoading(act.GET_JPOD_BOARD));
    let response;
    try {
        response = yield call(api.getBoardInfo, {
            // J팟 게시판 리트스트 가지고 오기.
            search: {
                page: 0,
                sort: 'boardId,desc',
                size: PAGESIZE_OPTIONS[0],
                usedYn: 'Y',
                boardType: 'S',
                channelType: 'BOARD_DIVC1',
            },
        });

        const {
            header: { success, message },
            body: { list },
        } = response.data;

        if (success === true) {
            yield put({ type: act.GET_JPOD_BOARD_SUCCESS, payload: list });
        } else {
            toast.error(message);
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(act.GET_JPOD_BOARD));
}

export default function* jpodSaga() {
    /**
     * 팟티
     */
    yield takeLatest(act.GET_CHANNEL_PODTY_LIST, getChannelPodtyListsaga);

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
    yield takeLatest(act.GET_EPISODES, getEpisodesSaga); // 에피소드 리스트 가지고 오기.
    yield takeLatest(act.GET_EPISODES_INFO, getEpisodesInfoSaga); // 에피소드 리스트 가지고 오기.
    yield takeLatest(act.GET_PODTY_EPISODE_LIST, getPodtyEpisodeListSaga); // 에피소드 리스트 가지고 오기.
    yield takeLatest(act.GET_EPISODE_GUBUN_CHANNELS, getEpisodeGubunChannelsSaga); // 에피소드 구분용 채널 리스트 가지고 오기 ( 등록, 수정, 검색 등에 사용).
    yield takeLatest(act.SAVE_JPOD_EPISODE, saveJpodEpisodeSaga); // 에피소드 등록.

    yield takeLatest(act.GET_BRIGHT_OVP, getBrightOvpSaga); // 브라이트 코브 목록 조회.
    yield takeLatest(act.SAVE_BRIGHTOVP, saveBrightovpSaga); // 브라이트 코브 저장.

    // 보드
    yield takeLatest(act.GET_JPOD_NOTICE, getJpodNoticeSaga);
    yield takeLatest(act.GET_BOARD_CONTENTS, getListmenuContentsInfoSaga);
    yield takeLatest(act.GET_BOARD_CHANNEL_LIST, getBoardChannelListSaga);
    yield takeLatest(act.GET_JPOD_BOARD, getJpodBoardSaga);
}
