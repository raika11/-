import { takeLatest, put, select, call } from 'redux-saga/effects';
import toast from '@/utils/toastUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, errorResponse } from '@store/commons/saga';
import * as jpodAction from './jpodAction';
import * as jpodApi from './jpodApi';
import { PAGESIZE_OPTIONS } from '@/constants';

const getReporterListSaga = callApiAfterActions(jpodAction.GET_REPORTER_LIST, jpodApi.getReporterList, (store) => store.jpod.reporter);
const getChannelPodtyListsaga = callApiAfterActions(jpodAction.GET_CHANNEL_PODTY_LIST, jpodApi.getPodtyChannels, (store) => store.jpod.podtyChannel);
const getChannelsSaga = callApiAfterActions(jpodAction.GET_CHANNELS, jpodApi.getJpods, (store) => store.jpod.channel.jpod);
const getEpisodesSaga = callApiAfterActions(jpodAction.GET_EPISODES, jpodApi.getEpisodes, (store) => store.jpod.episode.episodes);
const getPodtyEpisodeListSaga = callApiAfterActions(jpodAction.GET_PODTY_EPISODE_LIST, jpodApi.getPodtyEpisodesList, (store) => store.jpod.podtyEpisode);
const getEpisodeGubunChannelsSaga = callApiAfterActions(jpodAction.GET_EPISODE_GUBUN_CHANNELS, jpodApi.getEpisodeChannels, (store) => store.jpod.episode.channel);
// const getChEpisodesSaga = callApiAfterActions(GET_CH_EPISODES, getChEpisodes, (payload) => payload);

// 채널 목록에서 채널 정보 가지고 올때 에피소드 텝 목록 용.
// 에피소드 목록 조회 api 와 같은 api 인제 파라미터가 다르고 store 를 구분 하려고 사용.
function* getChEpisodesSaga({ payload: { chnlSeq } }) {
    yield put(startLoading(jpodAction.GET_CH_EPISODES));
    let response;
    try {
        response = yield call(jpodApi.getEpisodes, { search: { page: 0, sort: 'chnlSeq,desc', size: 4, chnlSeq: chnlSeq } });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: jpodAction.GET_CH_EPISODES_SUCCESS, payload: response.data });
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
    yield put(finishLoading(jpodAction.GET_CH_EPISODES));
}

// 채널 등록 수정.
function* saveChannelInfoSaga({ payload: { chnlSeq, channelinfo, callback } }) {
    yield put(startLoading(jpodAction.SAVE_JPOD_CHANNEL));

    let callbackData = {};
    let response;

    try {
        if (chnlSeq) {
            response = yield call(jpodApi.updateJpodChannel, { chnlSeq: chnlSeq, channelinfo: channelinfo });
        } else {
            response = yield call(jpodApi.saveJpodChannel, { channelinfo: channelinfo });
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

    yield put(finishLoading(jpodAction.SAVE_JPOD_CHANNEL));
}

// 에피소드 정보 등록 수정.
function* saveJpodEpisodeSaga({ payload: { chnlSeq, epsdSeq, episodeinfo, callback } }) {
    yield put(startLoading(jpodAction.SAVE_JPOD_EPISODE));

    let callbackData = {};
    let response;

    try {
        if (chnlSeq && epsdSeq) {
            response = yield call(jpodApi.updateJpodEpisode, { chnlSeq: chnlSeq, epsdSeq: epsdSeq, episodeinfo: episodeinfo });
        } else {
            response = yield call(jpodApi.saveJpodEpisode, { chnlSeq: chnlSeq, episodeinfo: episodeinfo });
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

    yield put(finishLoading(jpodAction.SAVE_JPOD_EPISODE));
}

// 채널 정보 가지고 오기.
function* getChannelInfoSaga({ payload: { chnlSeq } }) {
    yield put(startLoading(jpodAction.GET_CHANNEL_INFO));

    let response;
    try {
        response = yield call(jpodApi.getJpodsInfo, { chnlSeq: chnlSeq });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: jpodAction.GET_CHANNEL_INFO_SUCCESS, payload: response.data });
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

    yield put(finishLoading(jpodAction.GET_CHANNEL_INFO));
}

// 채널 삭제 처리.
function* deleteJpodChannelSaga({ payload: { chnlSeq, callback } }) {
    yield put(startLoading(jpodAction.DELETE_JPOD_CHANNEL));

    let callbackData = {};
    let response;

    try {
        response = yield call(jpodApi.deleteJpodChannel, { chnlSeq: chnlSeq });
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

    yield put(finishLoading(jpodAction.DELETE_JPOD_CHANNEL));
}

function* getEpisodesInfoSaga({ payload: { chnlSeq, epsdSeq } }) {
    yield put(startLoading(jpodAction.GET_EPISODES_INFO));

    let response;
    try {
        response = yield call(jpodApi.getEpisodesInfo, { chnlSeq: chnlSeq, epsdSeq: epsdSeq });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: jpodAction.GET_EPISODES_INFO_SUCCESS, payload: response.data });
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

    yield put(finishLoading(jpodAction.GET_EPISODES_INFO));
}

// 브라이트 코브 목록 조회.
function* getBrightOvpSaga() {
    yield put(startLoading(jpodAction.GET_BRIGHT_OVP));

    let response;
    try {
        const search = yield select((state) => state.jpod.brightOvp.search);
        response = yield call(jpodApi.getBrightOvp, { search: search });
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
        yield put({ type: jpodAction.GET_BRIGHT_OVP_SUCCESS, payload: { list: list, total: list.length } });
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(jpodAction.GET_BRIGHT_OVP));
}

// 브라이트 코브 저장.
function* saveBrightovpSaga({ payload: { ovpdata, callback } }) {
    yield put(startLoading(jpodAction.SAVE_BRIGHTOVP));

    let callbackData = {};
    let response;

    try {
        if (ovpdata) {
            response = yield call(jpodApi.saveBrightOvp, { ovpdata: ovpdata });
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

    yield put(finishLoading(jpodAction.SAVE_BRIGHTOVP));
}

// 게시판 게시글 리스트 가지고 오기.
function* getJpodNoticeSaga() {
    yield put(startLoading(jpodAction.GET_JPOD_NOTICE));

    let response;
    try {
        const jpodNotices = yield select((store) => store.jpod.jpodNotice.jpodNotices);
        response = yield call(jpodApi.getNoticesList, jpodNotices);
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: jpodAction.GET_JPOD_NOTICE_SUCCESS, payload: response.data.body });
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

    yield put(finishLoading(jpodAction.GET_JPOD_NOTICE));
}

// 게시글 정보 가지고 오기.
function* getListmenuContentsInfoSaga({ payload: { boardId, boardSeq } }) {
    yield put(startLoading(jpodAction.GET_BOARD_CONTENTS));

    let response;
    try {
        response = yield call(jpodApi.getBoardContentsInfo, { boardId: boardId, boardSeq: boardSeq });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: jpodAction.GET_BOARD_CONTENTS_SUCCESS, payload: response.data });
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

    yield put(finishLoading(jpodAction.GET_BOARD_CONTENTS));
}

// 게시판 채널 (JPOD, 기자) 리스트 가지고 와서 조합 해서 store 에 저장.
function* getBoardChannelListSaga() {
    yield put(startLoading(jpodAction.GET_BOARD_CHANNEL_LIST));
    let response;
    try {
        response = yield call(jpodApi.getBoardJpodChannalList);

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
            yield put({ type: jpodAction.GET_BOARD_CHANNEL_LIST_SUCCESS, payload: tempList });
        } else {
            toast.error(message);
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(jpodAction.GET_BOARD_CHANNEL_LIST));
}

function* getJpodBoardSaga() {
    yield put(startLoading(jpodAction.GET_JPOD_BOARD));
    let response;
    try {
        response = yield call(jpodApi.getBoardInfo, {
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
            yield put({ type: jpodAction.GET_JPOD_BOARD_SUCCESS, payload: list });
        } else {
            toast.error(message);
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(jpodAction.GET_JPOD_BOARD));
}

export default function* jpodSaga() {
    yield takeLatest(jpodAction.GET_REPORTER_LIST, getReporterListSaga); // 기자 검색 모달 리스트
    yield takeLatest(jpodAction.GET_CHANNEL_PODTY_LIST, getChannelPodtyListsaga); // 팟티 검색 모달 리스트
    yield takeLatest(jpodAction.SAVE_JPOD_CHANNEL, saveChannelInfoSaga); // 채널 정보 저장.
    yield takeLatest(jpodAction.GET_CHANNELS, getChannelsSaga); // 채널 리스트
    yield takeLatest(jpodAction.GET_CHANNEL_INFO, getChannelInfoSaga); // 채널 정보 가지고 오기.
    yield takeLatest(jpodAction.DELETE_JPOD_CHANNEL, deleteJpodChannelSaga); // 채널 삭제 처리.
    yield takeLatest(jpodAction.GET_EPISODES, getEpisodesSaga); // 에피소드 리스트 가지고 오기.
    yield takeLatest(jpodAction.GET_EPISODES_INFO, getEpisodesInfoSaga); // 에피소드 리스트 가지고 오기.

    yield takeLatest(jpodAction.GET_PODTY_EPISODE_LIST, getPodtyEpisodeListSaga); // 에피소드 리스트 가지고 오기.
    yield takeLatest(jpodAction.GET_EPISODE_GUBUN_CHANNELS, getEpisodeGubunChannelsSaga); // 에피소드 구분용 채널 리스트 가지고 오기 ( 등록, 수정, 검색 등에 사용).
    yield takeLatest(jpodAction.SAVE_JPOD_EPISODE, saveJpodEpisodeSaga); // 에피소드 등록.
    yield takeLatest(jpodAction.GET_BRIGHT_OVP, getBrightOvpSaga); // 브라이트 코브 목록 조회.
    yield takeLatest(jpodAction.SAVE_BRIGHTOVP, saveBrightovpSaga); // 브라이트 코브 저장.
    yield takeLatest(jpodAction.GET_CH_EPISODES, getChEpisodesSaga); // 브라이트 코브 저장.

    // 보드
    yield takeLatest(jpodAction.GET_JPOD_NOTICE, getJpodNoticeSaga);
    yield takeLatest(jpodAction.GET_BOARD_CONTENTS, getListmenuContentsInfoSaga);
    yield takeLatest(jpodAction.GET_BOARD_CHANNEL_LIST, getBoardChannelListSaga);
    yield takeLatest(jpodAction.GET_JPOD_BOARD, getJpodBoardSaga);
}
