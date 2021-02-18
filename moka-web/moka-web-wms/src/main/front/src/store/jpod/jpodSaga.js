import { takeLatest, put, select, call } from 'redux-saga/effects';
import toast from '@/utils/toastUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, errorResponse } from '@store/commons/saga';
import {
    GET_REPORTER_LIST,
    GET_CHANNEL_PODTY_LIST,
    SAVE_JPOD_CHANNEL,
    GET_CHANNELS,
    GET_CHANNEL_INFO,
    GET_CHANNEL_INFO_SUCCESS,
    DELETE_JPOD_CHANNEL,
    GET_EPISODES,
    GET_EPISODES_INFO,
    GET_EPISODES_INFO_SUCCESS,
    GET_PODTY_EPISODE_LIST,
    GET_EPISODE_GUBUN_CHANNELS,
    SAVE_JPOD_EPISODE,
    GET_BRIGHT_OVP,
    GET_BRIGHT_OVP_SUCCESS,
    SAVE_BRIGHTOVP,
    GET_CH_EPISODES,
    GET_CH_EPISODES_SUCCESS,
    GET_BOARD_CONTENTS_LIST,
    GET_BOARD_CONTENTS_LIST_SUCCESS,
    GET_BOARD_CONTENTS,
    GET_BOARD_CONTENTS_SUCCESS,
    GET_BOARD_CHANNEL_LIST,
} from './jpodAction';
import {
    getReporterList,
    getPodtyChannels,
    saveJpodChannel,
    getJpods,
    getJpodsInfo,
    updateJpodChannel,
    deleteJpodChannel,
    getEpisodes,
    getEpisodesInfo,
    getPodtyEpisodesList,
    saveJpodEpisode,
    updateJpodEpisode,
    getBrightOvp,
    saveBrightOvp,
    getEpisodeChannels,
    getBoardContentsList,
    getBoardContentsInfo,
    getBoardJpodChannalList,
} from './jpodApi';

const getReporterListSaga = callApiAfterActions(GET_REPORTER_LIST, getReporterList, (store) => store.jpod.reporter);
const getChannelPodtyListsaga = callApiAfterActions(GET_CHANNEL_PODTY_LIST, getPodtyChannels, (store) => store.jpod.podtyChannel);
const getChannelsSaga = callApiAfterActions(GET_CHANNELS, getJpods, (store) => store.jpod.channel.jpod);
const getEpisodesSaga = callApiAfterActions(GET_EPISODES, getEpisodes, (store) => store.jpod.episode.episodes);
const getPodtyEpisodeListSaga = callApiAfterActions(GET_PODTY_EPISODE_LIST, getPodtyEpisodesList, (store) => store.jpod.podtyEpisode);
const getEpisodeGubunChannelsSaga = callApiAfterActions(GET_EPISODE_GUBUN_CHANNELS, getEpisodeChannels, (store) => store.jpod.episode.channel);
// const getChEpisodesSaga = callApiAfterActions(GET_CH_EPISODES, getChEpisodes, (payload) => payload);

// 채널 목록에서 채널 정보 가지고 올때 에피소드 텝 목록 용.
// 에피소드 목록 조회 api 와 같은 api 인제 파라미터가 다르고 store 를 구분 하려고 사용.
function* getChEpisodesSaga({ payload: { chnlSeq } }) {
    yield put(startLoading(GET_CH_EPISODES));
    let response;
    try {
        response = yield call(getEpisodes, { search: { page: 0, sort: 'chnlSeq,desc', size: 4, chnlSeq: chnlSeq } });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: GET_CH_EPISODES_SUCCESS, payload: response.data });
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
    yield put(finishLoading(GET_CH_EPISODES));
}

// 채널 등록 수정.
function* saveChannelInfoSaga({ payload: { chnlSeq, channelinfo, callback } }) {
    yield put(startLoading(SAVE_JPOD_CHANNEL));

    let callbackData = {};
    let response;

    try {
        if (chnlSeq) {
            response = yield call(updateJpodChannel, { chnlSeq: chnlSeq, channelinfo: channelinfo });
        } else {
            response = yield call(saveJpodChannel, { channelinfo: channelinfo });
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

    yield put(finishLoading(SAVE_JPOD_CHANNEL));
}

// 에피소드 정보 등록 수정.
function* saveJpodEpisodeSaga({ payload: { chnlSeq, epsdSeq, episodeinfo, callback } }) {
    yield put(startLoading(SAVE_JPOD_EPISODE));

    let callbackData = {};
    let response;

    try {
        if (chnlSeq && epsdSeq) {
            response = yield call(updateJpodEpisode, { chnlSeq: chnlSeq, epsdSeq: epsdSeq, episodeinfo: episodeinfo });
        } else {
            response = yield call(saveJpodEpisode, { chnlSeq: chnlSeq, episodeinfo: episodeinfo });
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

    yield put(finishLoading(SAVE_JPOD_EPISODE));
}

// 채널 정보 가지고 오기.
function* getChannelInfoSaga({ payload: { chnlSeq } }) {
    yield put(startLoading(GET_CHANNEL_INFO));

    let response;
    try {
        response = yield call(getJpodsInfo, { chnlSeq: chnlSeq });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: GET_CHANNEL_INFO_SUCCESS, payload: response.data });
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

    yield put(finishLoading(GET_CHANNEL_INFO));
}

// 채널 삭제 처리.
function* deleteJpodChannelSaga({ payload: { chnlSeq, callback } }) {
    yield put(startLoading(DELETE_JPOD_CHANNEL));

    let callbackData = {};
    let response;

    try {
        response = yield call(deleteJpodChannel, { chnlSeq: chnlSeq });
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

    yield put(finishLoading(DELETE_JPOD_CHANNEL));
}

function* getEpisodesInfoSaga({ payload: { chnlSeq, epsdSeq } }) {
    yield put(startLoading(GET_EPISODES_INFO));

    let response;
    try {
        response = yield call(getEpisodesInfo, { chnlSeq: chnlSeq, epsdSeq: epsdSeq });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: GET_EPISODES_INFO_SUCCESS, payload: response.data });
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

    yield put(finishLoading(GET_EPISODES_INFO));
}

// 브라이트 코브 목록 조회.
function* getBrightOvpSaga() {
    yield put(startLoading(GET_BRIGHT_OVP));

    let response;
    try {
        const search = yield select((state) => state.jpod.brightOvp.search);
        response = yield call(getBrightOvp, { search: search });
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
        yield put({ type: GET_BRIGHT_OVP_SUCCESS, payload: { list: list, total: list.length } });
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(GET_BRIGHT_OVP));
}

// 브라이트 코브 저장.
function* saveBrightovpSaga({ payload: { ovpdata, callback } }) {
    yield put(startLoading(SAVE_BRIGHTOVP));

    let callbackData = {};
    let response;

    try {
        if (ovpdata) {
            response = yield call(saveBrightOvp, { ovpdata: ovpdata });
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

    yield put(finishLoading(SAVE_BRIGHTOVP));
}

// 게시판 게시글 리스트 가지고 오기.
function* getBoardContentsListSaga({ payload: { boardId } }) {
    yield put(startLoading(GET_BOARD_CONTENTS_LIST));

    let response;
    try {
        const search = yield select((store) => store.jpod.jpodBoard.jpodBoards.search);
        response = yield call(getBoardContentsList, { boardId: boardId, search: search });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: GET_BOARD_CONTENTS_LIST_SUCCESS, payload: response.data.body });
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

    yield put(finishLoading(GET_BOARD_CONTENTS_LIST));
}

// 게시글 정보 가지고 오기.
function* getListmenuContentsInfoSaga({ payload: { boardId, boardSeq } }) {
    yield put(startLoading(GET_BOARD_CONTENTS));

    let response;
    try {
        response = yield call(getBoardContentsInfo, { boardId: boardId, boardSeq: boardSeq });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: GET_BOARD_CONTENTS_SUCCESS, payload: response.data });
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

    yield put(finishLoading(GET_BOARD_CONTENTS));
}

// 게시판 채널 (JPOD, 기자) 리스트 가지고 와서 조합 해서 store 에 저장.
function* getBoardChannelListSaga({ payload: { type, callback } }) {
    yield put(startLoading(GET_BOARD_CHANNEL_LIST));
    let response;
    let callbackData = {};
    try {
        // jpod 채널 리스트 목록 가지고 오기.
        if (type === 'BOARD_DIVC1') {
            response = yield call(getBoardJpodChannalList);

            const {
                header: { success, message },
                body: { list },
            } = response.data;

            if (success === true) {
                callbackData = list.map((data) => {
                    return {
                        name: data.chnlNm,
                        value: data.chnlSeq,
                    };
                });
            } else {
                toast.error(message);
            }
            // 기자 목록 가지고 오기.
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }
    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(GET_BOARD_CHANNEL_LIST));
}

export default function* jpodSaga() {
    yield takeLatest(GET_REPORTER_LIST, getReporterListSaga); // 기자 검색 모달 리스트
    yield takeLatest(GET_CHANNEL_PODTY_LIST, getChannelPodtyListsaga); // 팟티 검색 모달 리스트
    yield takeLatest(SAVE_JPOD_CHANNEL, saveChannelInfoSaga); // 채널 정보 저장.
    yield takeLatest(GET_CHANNELS, getChannelsSaga); // 채널 리스트
    yield takeLatest(GET_CHANNEL_INFO, getChannelInfoSaga); // 채널 정보 가지고 오기.
    yield takeLatest(DELETE_JPOD_CHANNEL, deleteJpodChannelSaga); // 채널 삭제 처리.
    yield takeLatest(GET_EPISODES, getEpisodesSaga); // 에피소드 리스트 가지고 오기.
    yield takeLatest(GET_EPISODES_INFO, getEpisodesInfoSaga); // 에피소드 리스트 가지고 오기.

    yield takeLatest(GET_PODTY_EPISODE_LIST, getPodtyEpisodeListSaga); // 에피소드 리스트 가지고 오기.
    yield takeLatest(GET_EPISODE_GUBUN_CHANNELS, getEpisodeGubunChannelsSaga); // 에피소드 구분용 채널 리스트 가지고 오기 ( 등록, 수정, 검색 등에 사용).
    yield takeLatest(SAVE_JPOD_EPISODE, saveJpodEpisodeSaga); // 에피소드 등록.
    yield takeLatest(GET_BRIGHT_OVP, getBrightOvpSaga); // 브라이트 코브 목록 조회.
    yield takeLatest(SAVE_BRIGHTOVP, saveBrightovpSaga); // 브라이트 코브 저장.
    yield takeLatest(GET_CH_EPISODES, getChEpisodesSaga); // 브라이트 코브 저장.

    // 보드
    yield takeLatest(GET_BOARD_CONTENTS_LIST, getBoardContentsListSaga);
    yield takeLatest(GET_BOARD_CONTENTS, getListmenuContentsInfoSaga);
    yield takeLatest(GET_BOARD_CHANNEL_LIST, getBoardChannelListSaga);
}
