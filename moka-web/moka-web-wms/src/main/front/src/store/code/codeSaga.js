import { takeLatest } from 'redux-saga/effects';
import { callApiAfterActions } from '@store/commons/saga';

import * as api from './codeApi';
import * as act from './codeAction';

const getMasterCodeList = callApiAfterActions(act.GET_MASTER_CODE_LIST, api.getMastercodeList, (store) => store.code.master);

const getCodeServiceList = callApiAfterActions(act.GET_CODE_SERVICE_LIST, api.getMastercodeList, (store) => store.code.service);

const getCodeSectionList = callApiAfterActions(act.GET_CODE_SECTION_LIST, api.getMastercodeList, (store) => store.code.section);

const getCodeContentList = callApiAfterActions(act.GET_CODE_CONTENT_LIST, api.getMastercodeList, (store) => store.code.content);

const getCodeKornameList = callApiAfterActions(act.GET_CODE_KORNAME_LIST, api.getMastercodeList, (store) => store.code.korname);

export default function* saga() {
    yield takeLatest(act.GET_MASTER_CODE_LIST, getMasterCodeList);
    yield takeLatest(act.GET_CODE_SERVICE_LIST, getCodeServiceList);
    yield takeLatest(act.GET_CODE_SECTION_LIST, getCodeSectionList);
    yield takeLatest(act.GET_CODE_CONTENT_LIST, getCodeContentList);
    yield takeLatest(act.GET_CODE_KORNAME_LIST, getCodeKornameList);
}
