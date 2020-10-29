import { takeLatest } from 'redux-saga/effects';
import { callApiAfterActions } from '@store/commons/saga';

import * as api from './relationApi';
import * as act from './relationAction';

/**
 * 관련아이템 목록 조회
 */
const getRelationList = callApiAfterActions(act.GET_RELATION_LIST, api.getRelationList, (store) => store.relation);

/** saga */
export default function* saga() {
    yield takeLatest(act.GET_RELATION_LIST, getRelationList);
}
