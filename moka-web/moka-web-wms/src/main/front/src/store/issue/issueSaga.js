import { call, put, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { errorResponse, createRequestSaga } from '@store/commons/saga';
import * as api from '@store/issue/issueApi';
import * as act from '@store/issue/issueAction';
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
const getIssueListModal = createRequestSaga(act.GET_ISSUE_LIST_MODAL, api.getIssueList, true);

/**
 * saga
 */
export default function* saga() {
    yield takeLatest(act.GET_ISSUE_LIST, getIssueList);
    yield takeLatest(act.GET_ISSUE_LIST_MODAL, getIssueListModal);
}
