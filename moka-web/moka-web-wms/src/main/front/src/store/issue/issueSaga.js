import { call, put, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { errorResponse } from '@store/commons/saga';
import * as api from '@store/issue/issueApi';
import * as act from '@store/issue/issueAction';
import * as codeApi from '@store/code/codeApi';
import * as codeAct from '@store/code/codeAction';
import { initialState as codeInitialState } from '@store/code';
import { finishLoading, startLoading } from '@store/loading';
import commonUtil from '@utils/commonUtil';

/**
 * 이슈 목록 조회
 */
const toIssueListData = (list) => {
    return list.map((data) => {
        const { catList, repList } = data;
        let category = '';
        let categoryNames = '';
        if (!commonUtil.isEmpty(catList)) {
            const categories = catList.split(',').map((info) => info.split('|')[1]);
            const categoryLength = categories.length;
            if (categoryLength > 1) {
                category = `${categories[0]} 외`;
            } else {
                category = categories;
            }
            categoryNames = categories.join(', ');
        }

        let reporter = '';
        let reporterNames = '';
        if (!commonUtil.isEmpty(repList)) {
            const reporters = repList.split(',').map((info) => info.split('|')[1]);
            const reporterLength = reporters.length;
            if (reporters.length > 1) {
                reporter = `${reporters[1]} 외 ${reporterLength - 1}명`;
            } else {
                reporter = reporters;
            }
            reporterNames = reporters.join(',');
        }

        return { ...data, category, categoryNames, reporter, reporterNames };
    });
};

function* getIssueList({ type, payload }) {
    yield put(startLoading(type));

    try {
        const startDt = payload.startDt && payload.startDt.isValid() ? moment(payload.startDt).format(DB_DATEFORMAT) : null;
        const endDt = payload.endDt && payload.endDt.isValid() ? moment(payload.endDt).format(DB_DATEFORMAT) : null;
        const search = { ...payload, startDt, endDt };

        const response = yield call(api.getIssueList, { search });
        if (response.data.header.success) {
            const list = toIssueListData(response.data.body.list);

            yield put({ type: `${type}_SUCCESS`, payload: { ...response.data, body: { ...response.data.body, list } } });
        } else {
            yield put({ type: `${type}_FAILURE`, payload: response.data });
        }
    } catch (e) {
        yield put({ type: `${type}_FAILURE`, payload: errorResponse(e) });
    }
    yield put(finishLoading(type));
}

/**
 * 이슈 목록 조회 (모달)
 */
function* getIssueListModal({ payload }) {
    const { search: payloadSearch, getServiceCodeList = false, callback } = payload;
    const ACTION = act.GET_ISSUE_LIST_MODAL;
    let callbackData,
        search = payloadSearch;

    yield put(startLoading(ACTION));
    try {
        if (getServiceCodeList) {
            // 서비스코드 조회
            const scResponse = yield call(codeApi.getMastercodeList, { search: codeInitialState.service.search });
            if (scResponse.data.header.success) {
                yield put({ type: codeAct.GET_CODE_SERVICE_LIST_SUCCESS, payload: scResponse.data });
                const category = scResponse.data.body.list.map((sc) => sc.masterCode).join(',');
                search = { ...payloadSearch, category };
            } else {
                callbackData = errorResponse(scResponse.data);
                if (typeof callback === 'function') {
                    yield call(callback, callbackData);
                }

                yield put(finishLoading(ACTION));
                return;
            }
        }

        const response = yield call(api.getIssueList, { search });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, { ...callbackData, search });
    }

    yield put(finishLoading(ACTION));
}

/**
 * saga
 */
export default function* saga() {
    yield takeLatest(act.GET_ISSUE_LIST, getIssueList);
    yield takeLatest(act.GET_ISSUE_LIST_MODAL, getIssueListModal);
}
