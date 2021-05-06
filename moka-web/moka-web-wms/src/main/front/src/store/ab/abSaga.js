import { takeLatest, put, call, select } from 'redux-saga/effects';
import * as api from './abApi';
import * as action from './abAction';
import { finishLoading, startLoading } from '@store/loading';
import produce from 'immer';
import { ABTEST_PURPOSE, ABTEST_TYPE } from '@store/ab/abReducer';
import commonUtil from '@utils/commonUtil';
import moment from 'moment';
import { BASIC_DATEFORMAT, DB_DATEFORMAT } from '@/constants';

const toAbTestTypeNameForTypeCode = (code) => {
    const { ALTERNATIVE_INPUT, DIRECT_DESIGN, JAM, NEWSLETTER } = ABTEST_TYPE;
    let name = '';
    switch (code) {
        case DIRECT_DESIGN:
            name = '직접설계';
            break;
        case ALTERNATIVE_INPUT:
            name = '대안입력';
            break;
        case JAM:
            name = 'JAM';
            break;
        case NEWSLETTER:
            name = '뉴스레터';
            break;
        default:
            break;
    }

    return name;
};

const toAbTestPurposeNameForPurposeCode = (code) => {
    const { DESIGN, DATA, LETTER_SEND_DATE, LETTER_SENDER_NAME, LETTER_TITLE, COMPONENT } = ABTEST_PURPOSE;
    let name = '';
    switch (code) {
        case DESIGN:
            name = '디자인';
            break;
        case DATA:
            name = '데이터';
            break;
        case COMPONENT:
            name = '컴포넌트';
            break;
        case LETTER_SEND_DATE:
            name = '뉴스레터 타이틀';
            break;
        case LETTER_SENDER_NAME:
            name = '뉴스레터 발송자명';
            break;
        case LETTER_TITLE:
            name = '뉴스레터 제목';
            break;
        default:
            break;
    }

    return name;
};

const toAbTestListData = (list) => {
    return list.map((row) => {
        const {
            abtestSeq: seq,
            status,
            abtestTitle,
            abtestType,
            abtestPurpose,
            pageNm: pageNmForServer,
            zoneNm: areaNmForServer,
            regNm,
            regId,
            startDt: startDtForServer,
            endDt: endDtForServer,
            regDt: regDtForServer,
        } = row;

        const abtestTypeNm = toAbTestTypeNameForTypeCode(abtestType);
        const abtestPurposeNm = toAbTestPurposeNameForPurposeCode(abtestPurpose);
        const pageNm = commonUtil.isEmpty(pageNmForServer) ? '' : pageNmForServer;
        const areaNm = commonUtil.isEmpty(areaNmForServer) ? '' : areaNmForServer;
        const startDt = commonUtil.isEmpty(startDtForServer) ? '' : moment(startDtForServer).format(BASIC_DATEFORMAT);
        const endDt = commonUtil.isEmpty(endDtForServer) ? '' : moment(endDtForServer).format(BASIC_DATEFORMAT);
        const regDt = moment(regDtForServer).format(BASIC_DATEFORMAT);

        const periodInfo = `${startDt}\n${endDt}`;

        const regInfo = `${regNm}(${regId})\n${regDt}`;

        return {
            seq,
            status,
            abtestTitle,
            abtestTypeNm,
            abtestPurposeNm,
            typeAndPurpose: `${abtestTypeNm}\n${abtestPurposeNm}`,
            pageAndArea: `${pageNm}\n${areaNm}`,
            periodInfo,
            regInfo,
        };
    });
};

function* getAbTestList({ type, payload: search }) {
    yield put(startLoading(type));
    try {
        const response = yield call(api.getAbTestList, search);
        if (response.data.header.success) {
            yield put({
                type: `${type}_SUCCESS`,
                payload: produce(response, (draft) => {
                    draft.data.body.list = toAbTestListData(response.data.body.list);
                }),
            });
        }
    } catch (e) {
        console.log(e);
    }
    yield put(finishLoading(type));
}

const toAbTestData = (data) => {
    const { abtestGrpMethod, abtestGrpA, abtestGrpB, ...rest } = data;
    let abtestRandomGrpA = '';
    let abtestRandomGrpB = '';
    let abtestFixGrpA = '';
    let abtestFixGrpB = '';

    if (abtestGrpMethod === 'R') {
        abtestRandomGrpA = abtestGrpA;
        abtestRandomGrpB = abtestGrpB;
    }

    if (abtestGrpMethod === 'S') {
        abtestFixGrpA = abtestGrpA;
        abtestFixGrpB = abtestGrpB;
    }

    return { ...rest, abtestGrpMethod, abtestRandomGrpA, abtestRandomGrpB, abtestFixGrpA, abtestFixGrpB };
};

function* getAbTest({ type, payload: { abtestSeq, callback } }) {
    yield put(startLoading(type));
    try {
        const response = yield call(api.getAbTest, abtestSeq);
        const abtestData = toAbTestData(response.data.body);
        yield put({
            type: `${type}_SUCCESS`,
            payload: abtestData,
        });
    } catch (e) {
        console.log(e);
    }
    yield put(finishLoading(type));
}

const toSaveAbtestData = (data) => {
    const { abtestGrpMethod, abtestRandomGrpA, abtestRandomGrpB, abtestFixGrpA, abtestFixGrpB, startDt: detailStartDt, endDt: detailEndDt, ...rest } = data;
    const startDt = commonUtil.isEmpty(detailStartDt) ? detailStartDt : moment(detailStartDt).format(DB_DATEFORMAT);
    const endDt = commonUtil.isEmpty(detailEndDt) ? detailEndDt : moment(detailEndDt).format(DB_DATEFORMAT);

    let abtestGrpA = '';
    let abtestGrpB = '';

    if (abtestGrpMethod === 'R') {
        abtestGrpA = abtestRandomGrpA;
        abtestGrpB = abtestRandomGrpB;
    }

    if (abtestGrpMethod === 'S') {
        abtestGrpA = abtestFixGrpA;
        abtestGrpB = abtestFixGrpB;
    }

    return { ...rest, abtestGrpMethod, abtestGrpA, abtestGrpB, startDt, endDt };
};

function* saveAbTest({ type, payload }) {
    yield put(startLoading(type));
    const { detail, callback } = payload;
    const saveAbtestData = toSaveAbtestData(detail);

    let apiUrl = api.postAbTest;
    if (!commonUtil.isEmpty(saveAbtestData.abtestSeq) && saveAbtestData.abtestSeq !== '') {
        apiUrl = api.putAbTest;
    }

    const response = yield call(apiUrl, { detail: saveAbtestData });
    if (callback instanceof Function) {
        callback(response.data);
    }
    yield put(finishLoading(type));
}

function* closeAbTest({ type, payload }) {
    yield put(startLoading(type));
    const { abtestSeq, callback } = payload;
    const response = yield call(api.putCloseAbtest, abtestSeq);
    if (callback instanceof Function) {
        callback(response.data);
    }
    yield put(finishLoading(type));
}

function* deleteAbTest({ type, payload }) {
    yield put(startLoading(type));
    const { abtestSeq, callback } = payload;
    const response = yield call(api.deleteAbtest, abtestSeq);
    if (callback instanceof Function) {
        callback(response.data);
    }
    yield put(finishLoading(type));
}

export default function* abSaga() {
    yield takeLatest(action.GET_AB_TEST_LIST, getAbTestList);
    yield takeLatest(action.GET_AB_TEST, getAbTest);
    yield takeLatest(action.SAVE_AB_TEST, saveAbTest);
    yield takeLatest(action.CLOSE_AB_TEST, closeAbTest);
    yield takeLatest(action.DELETE_AB_TEST, deleteAbTest);
}
