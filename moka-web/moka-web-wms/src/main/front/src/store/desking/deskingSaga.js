import { takeLatest } from 'redux-saga/effects';
import { createRequestSaga } from '@store/commons/saga';

import * as api from './deskingApi';
import * as act from './deskingAction';

/**
 * 편집영역 클릭시, Work 컴포넌트 목록 조회
 */
const getComponentWorkList = createRequestSaga(act.GET_COMPONENT_WORK_LIST, api.getComponentWorkList);

/** saga */
export default function* saga() {
    yield takeLatest(act.GET_COMPONENT_WORK_LIST, getComponentWorkList);
}
