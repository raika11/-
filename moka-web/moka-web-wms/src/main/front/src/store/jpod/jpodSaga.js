import { takeLatest, put, select, call } from 'redux-saga/effects';
import toast from '@/utils/toastUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, errorResponse } from '@store/commons/saga';
import { GET_REPORTER_LIST, GET_CHANNEL_PODTY_LIST, SAVE_JPOD_CHANNEL } from './jpodAction';
import { getReporterList, getPodtyChannels, saveJpodChannel } from './jpodApi';

const getReporterListSaga = callApiAfterActions(GET_REPORTER_LIST, getReporterList, (store) => store.jpod.channel.reporter);
const getChannelPodtyListsaga = callApiAfterActions(GET_CHANNEL_PODTY_LIST, getPodtyChannels, (store) => store.jpod.channel.podty);

function* saveChannelInfoSaga({ payload: { type, channelinfo, callback } }) {
    yield put(startLoading(SAVE_JPOD_CHANNEL));

    let callbackData = {};
    let response;

    try {
        response = yield call(saveJpodChannel, { channelinfo: channelinfo });
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

export default function* jpodSaga() {
    yield takeLatest(GET_REPORTER_LIST, getReporterListSaga);
    yield takeLatest(GET_CHANNEL_PODTY_LIST, getChannelPodtyListsaga);
    yield takeLatest(SAVE_JPOD_CHANNEL, saveChannelInfoSaga);
}
