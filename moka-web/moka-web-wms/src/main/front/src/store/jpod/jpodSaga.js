import { takeLatest, put, select, call } from 'redux-saga/effects';
import toast from '@/utils/toastUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, errorResponse } from '@store/commons/saga';
import { GET_REPORTER_LIST, GET_CHANNEL_PODTY_LIST, SAVE_JPOD_CHANNEL, GET_CHANNELS, GET_CHANNEL_INFO, GET_CHANNEL_INFO_SUCCESS, DELETE_JPOD_CHANNEL } from './jpodAction';
import { getReporterList, getPodtyChannels, saveJpodChannel, getJpods, getJpodsInfo, updateJpodChannel, deleteJpodChannel } from './jpodApi';

const getReporterListSaga = callApiAfterActions(GET_REPORTER_LIST, getReporterList, (store) => store.jpod.channel.reporter);
const getChannelPodtyListsaga = callApiAfterActions(GET_CHANNEL_PODTY_LIST, getPodtyChannels, (store) => store.jpod.channel.podty);
const getChannelsSaga = callApiAfterActions(GET_CHANNELS, getJpods, (store) => store.jpod.channel.jpod);

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

// 게시글 정보 가지고 오기.
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

export default function* jpodSaga() {
    yield takeLatest(GET_REPORTER_LIST, getReporterListSaga);
    yield takeLatest(GET_CHANNEL_PODTY_LIST, getChannelPodtyListsaga);
    yield takeLatest(SAVE_JPOD_CHANNEL, saveChannelInfoSaga);
    yield takeLatest(GET_CHANNELS, getChannelsSaga);
    yield takeLatest(GET_CHANNEL_INFO, getChannelInfoSaga);
    yield takeLatest(DELETE_JPOD_CHANNEL, deleteJpodChannelSaga); // 게시글 게시판 글 정보 저장.
}
