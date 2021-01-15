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
    GET_EPISODE_JPOD_CHANNELS,
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
} from './jpodApi';

const getReporterListSaga = callApiAfterActions(GET_REPORTER_LIST, getReporterList, (store) => store.jpod.reporter);
const getChannelPodtyListsaga = callApiAfterActions(GET_CHANNEL_PODTY_LIST, getPodtyChannels, (store) => store.jpod.podtyChannel);
const getChannelsSaga = callApiAfterActions(GET_CHANNELS, getJpods, (store) => store.jpod.channel.jpod);
const getEpisodesSaga = callApiAfterActions(GET_EPISODES, getEpisodes, (store) => store.jpod.episode.episodes);
const getPodtyEpisodeListSaga = callApiAfterActions(GET_PODTY_EPISODE_LIST, getPodtyEpisodesList, (store) => store.jpod.podtyEpisode);
const getEpisodeJpodChannelsSaga = callApiAfterActions(GET_EPISODE_JPOD_CHANNELS, getPodtyChannels, (store) => store.jpod.episode.channel);

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
    yield takeLatest(GET_EPISODE_JPOD_CHANNELS, getEpisodeJpodChannelsSaga); // 에피소드 리스트 가지고 오기.
}
