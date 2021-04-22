import { takeLatest, put, call, select } from 'redux-saga/effects';
import * as api from './abApi';
import * as action from './abAction';
import { finishLoading, startLoading } from '@store/loading';
import produce from 'immer';
import { ABTEST_PURPOSE, ABTEST_TYPE } from '@store/ab/abReducer';
import commonUtil from '@utils/commonUtil';
import moment from 'moment';
import { BASIC_DATEFORMAT } from '@/constants';

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
    const { DESIGN, DATA } = ABTEST_PURPOSE;
    let name = '';
    switch (code) {
        case DESIGN:
            name = '디자인';
            break;
        case DATA:
            name = '데이터';
            break;
        default:
            break;
    }

    return name;
};

const toAbTestListData = (list) => {
    return list.map((row) => {
        const {
            status,
            abtestTitle,
            abtestType,
            abtestPurpose,
            pageNm: pageNmForServer,
            areaNm: areaNmForServer,
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

        return { status, abtestTitle, typeAndPurpose: `${abtestTypeNm}\n${abtestPurposeNm}`, pageAndArea: `${pageNm}\n${areaNm}`, periodInfo, regInfo };
    });
};

function* getAbTestList({ type, payload: search }) {
    yield startLoading(type);
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
        console.log(response);
    } catch (e) {
        console.log(e);
    }
    yield finishLoading(type);
}

export default function* abSaga() {
    yield takeLatest(action.GET_AB_TEST_LIST, getAbTestList);
}
