import { call, put, takeLatest, select } from 'redux-saga/effects';
import moment from 'moment';
import { DATE_FORMAT, DB_DATEFORMAT } from '@/constants';
import { errorResponse, createRequestSaga } from '@store/commons/saga';
import * as api from '@store/issue/issueApi';
import * as act from '@store/issue/issueAction';
import * as codeApi from '@store/code/codeApi';
import * as codeAct from '@store/code/codeAction';
import { initialState as codeInitialState } from '@store/code';
import { finishLoading, startLoading } from '@store/loading';
import commonUtil from '@utils/commonUtil';
import produce from 'immer';
import { CAT_DIV, initialState } from '@store/issue/issueReducer';
import { messageBox } from '@utils/toastUtil';

/**
 * 이슈 목록 조회
 */
export const toIssueListData = (list) => {
    return list.map((data) => {
        const expYn = data.usedYn === 'N' ? 'N' : 'Y';
        const endYn = data.usedYn === 'E' ? 'Y' : 'N';
        const regDt = commonUtil.isEmpty(data.regDt) ? data.regDt : moment(data.regDt).format(DATE_FORMAT);
        const lastArticleUpdateDate = commonUtil.isEmpty(data.lastArticleUpdateDate) ? data.lastArticleUpdateDate : moment(data.lastArticleUpdateDate).format(DATE_FORMAT);
        let pkgDivName = '';
        if (data.pkgDiv === 'I') {
            pkgDivName = '이슈';
        } else if (data.pkgDiv === 'S') {
            pkgDivName = '시리즈';
        } else if (data.pkgDiv === 'T') {
            pkgDivName = '토픽';
        }

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
                reporter = `${reporters[0]} 외 ${reporterLength - 1}명`;
            } else {
                reporter = reporters;
            }
            reporterNames = reporters.join(',');
        }

        const onClickDirectLink = () => {
            messageBox.alert('바로가기 기능은 준비중 입니다.');
        };

        return { ...data, regDt, lastArticleUpdateDate, category, pkgDivName, categoryNames, reporter, reporterNames, expYn, endYn, onClickDirectLink };
    });
};

function* getIssueList({ type, payload }) {
    yield put(startLoading(type));

    try {
        const startDt = payload.search.startDt && payload.search.startDt.isValid() ? moment(payload.search.startDt).format(DB_DATEFORMAT) : null;
        const endDt = payload.search.endDt && payload.search.endDt.isValid() ? moment(payload.search.endDt).format(DB_DATEFORMAT) : null;
        const search = { ...payload.search, startDt, endDt };

        const response = yield call(api.getIssueList, { search });
        if (response.data.header.success) {
            const list = toIssueListData(response.data.body.list);

            yield put({ type: `${type}_SUCCESS`, payload: { ...response.data, body: { ...response.data.body, list } } });
            if (payload.callback instanceof Function) {
                payload.callback(response.data);
            }
        } else {
            yield put({ type: `${type}_FAILURE`, payload: response.data });
            if (payload.callback instanceof Function) {
                payload.callback(response);
            }
        }
    } catch (e) {
        yield put({ type: `${type}_FAILURE`, payload: errorResponse(e) });
    }
    yield put(finishLoading(type));
}

const getKeyword = (keywords, type) => {
    let defaultKeyword = initialState.initialPkgKeyword;
    const selectKeywords = keywords.filter((keyword) => keyword.catDiv === type);
    const isUsed = selectKeywords.length > 0;
    let keyword = defaultKeyword;
    if (isUsed) {
        keyword = selectKeywords[0];
        keyword = {
            ...keyword,
            schCondi: {
                keyword: keyword.schCondi.indexOf('K') > -1,
                title: keyword.schCondi.indexOf('T') > -1,
            },
        };
    }

    if (type === CAT_DIV.REPORTER) {
        //defaultKeyword = { ...defaultKeyword, reporter: { ordNo: 1, reporterId: null } };
        const reporter = selectKeywords.map((selectKeyword) => ({
            andOr: selectKeyword.andOr,
            ordNo: selectKeyword.ordNo,
            reporterId: selectKeyword.repMaster,
            keyword: selectKeyword.keyword,
            sdate: selectKeyword.sdate,
            edate: selectKeyword.edate,
        }));

        keyword = { ...keyword, reporter };
    }

    return {
        isUsed,
        keyword,
    };
};

export const toIssueData = (response) => {
    const { pkgSeq, pkgTitle, pkgDesc, pkgDiv, episView, packageKeywords, seasonNo, catList, reservDt } = response;

    const viewReservDt = commonUtil.isEmpty(reservDt) ? reservDt : moment(reservDt);
    const search = getKeyword(packageKeywords, CAT_DIV.SEARCH_KEYWORD);
    const reporter = getKeyword(packageKeywords, CAT_DIV.REPORTER);
    const section = getKeyword(packageKeywords, CAT_DIV.SECTION);
    const digitalSpecial = getKeyword(packageKeywords, CAT_DIV.DIGITAL_SPECIAL);
    const ovp = getKeyword(packageKeywords, CAT_DIV.OVP);
    // const category = getKeyword(packageKeywords, CAT_DIV.CATEGORY);
    // const pkg = getKeyword(packageKeywords, CAT_DIV.PACKAGE);
    let seasons = [
        { checked: false, value: '' },
        { checked: false, value: '' },
        { checked: false, value: '' },
    ];
    if (!commonUtil.isEmpty(seasonNo)) {
        seasonNo.split(',').forEach((season, index) => {
            let checked = false;
            let value = '';
            if (season !== '') {
                checked = true;
                value = season;
            }
            seasons = produce(seasons, (draft) => {
                draft[index].checked = checked;
                draft[index].value = value;
            });
        });
    }

    /*console.log('searchKeywords', searchKeywords);
    console.log('reporterKeywords', reporterKeywords);
    console.log('sectionKeywords', sectionKeywords);
    console.log('digitalSpecialKeywords', digitalSpecialKeywords);
    console.log('ovpKeywords', ovpKeywords);
    console.log('categoryKeywords', categoryKeywords);*/

    return {
        ...response,
        pkgSeq,
        pkgTitle,
        pkgDesc,
        pkgDiv,
        episView,
        packageKeywords: { search, reporter, section, digitalSpecial, ovp },
        seasons,
        catList,
        reservDt: viewReservDt,
    };
};

function* getIssue({ type, payload }) {
    yield put(startLoading(type));

    try {
        const response = yield call(api.getIssueGroupByOrdNo, payload.pkgSeq);
        if (response.data.header.success) {
            const data = toIssueData(response.data.body);

            yield put({ type: `${type}_SUCCESS`, payload: data });
        } else {
            yield put({ type: `${type}_FAILURE`, payload: response.data });
        }
    } catch (e) {
        console.log(e);
        yield put({ type: `${type}_FAILURE`, payload: errorResponse(e) });
    }
    yield put(finishLoading(type));
}

const toSaveSchCondi = (pkgSchCondi) => {
    const schCondi = [];
    if (pkgSchCondi.keyword) {
        schCondi.push('K');
    }
    if (pkgSchCondi.title) {
        schCondi.push('T');
    }

    return schCondi.join(',');
};

const toSavePackageKeywords = (viewKeywords) => {
    const usedKeywords = Object.keys(viewKeywords).filter((key) => viewKeywords[key].isUsed);
    const packageKeywords = [];
    let ordNo = 1;
    usedKeywords.forEach((key, index) => {
        const keyword = viewKeywords[key].keyword;
        const { schCondi: pkgSchCondi } = keyword;
        const schCondi = toSaveSchCondi(pkgSchCondi);

        if (key === 'reporter') {
            keyword.reporter.forEach((data) => {
                const copyKeyword = { ...keyword };
                const sdate = commonUtil.isEmpty(data.sdate) ? null : moment(data.sdate).format(DATE_FORMAT);
                const edate = commonUtil.isEmpty(data.edate) ? null : moment(data.edate).format(DATE_FORMAT);
                const andOr = data.andOr;
                delete copyKeyword.reporter;

                packageKeywords.push({
                    ...copyKeyword,
                    keyword: data.keyword,
                    repMaster: data.reporterId,
                    schCondi: schCondi,
                    sdate,
                    edate,
                    ordNo,
                    andOr,
                });
                ordNo++;
            });
        } else {
            const sdate = commonUtil.isEmpty(keyword.sdate) ? null : moment(keyword.sdate).format(DATE_FORMAT);
            const edate = commonUtil.isEmpty(keyword.edate) ? null : moment(keyword.edate).format(DATE_FORMAT);
            packageKeywords.push({ ...keyword, schCondi, sdate, edate, ordNo });
            ordNo++;
        }
    });

    return packageKeywords;
};

const toSavePackageSeason = (viewSeasons) => {
    const seasons = viewSeasons.map((season) => season.value);
    return seasons.join(',');
};

const toSavePackage = (pkg) => {
    const { packageKeywords: viewKeywords, seasons: viewSeasons, reservDt: viewReservDt } = pkg;
    const reservDt = commonUtil.isEmpty(viewReservDt) ? null : moment(viewReservDt).format(DB_DATEFORMAT);
    const copyPkg = { ...pkg };
    delete copyPkg.seasons;

    const seasonNo = toSavePackageSeason(viewSeasons);
    const packageKeywords = toSavePackageKeywords(viewKeywords);

    return { ...copyPkg, packageKeywords, seasonNo, reservDt };
};

function* saveIssue({ type, payload }) {
    const { pkg: viewData, callback } = payload;

    const pkg = toSavePackage(viewData);
    let saveApi = api.postIssueGroupByOrdno;
    if (pkg.pkgSeq) {
        saveApi = api.putIssueGroupByOrdno;
    }
    const response = yield call(saveApi, { pkg });
    if (callback instanceof Function) {
        callback(response);
    }
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
                // const category = scResponse.data.body.list.map((sc) => sc.masterCode).join(',');
                const category = '';
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

function* existsIssueTitle({ type, payload }) {
    const { pkgTitle, callback } = payload;

    const response = yield call(api.existsIssueTitle, { pkgTitle });
    if (callback instanceof Function) {
        callback(response.data);
    }
}

function* updateFinishIssue({ type, payload }) {
    const { pkgSeq, callback } = payload;

    const response = yield call(api.finishIssue, { pkgSeq });
    if (callback instanceof Function) {
        callback(response);
    }
}

/**
 * 이슈 컨텐츠 목록 조회 (모달)
 */
const getIssueContentsListModal = createRequestSaga(act.GET_ISSUE_CONTENTS_LIST_MODAL, api.getIssueContentsList);

/**
 * 이슈 데스킹 조회
 */
const getIssueDesking = createRequestSaga(act.GET_ISSUE_DESKING, api.getIssueDesking);

/**
 * 이슈 데스킹 임시저장
 */
function* saveIssueDesking({ payload }) {
    const ACTION = act.SAVE_ISSUE_DESKING;
    const { callback, ...rest } = payload;
    let callbackData;

    try {
        const response = yield call(api.saveIssueDesking, rest);
        callbackData = response.data;
        if (response.data.header.success) {
            let desking = yield select(({ issue }) => issue.desking);
            desking = produce(desking, (draft) => {
                const idx = desking.findIndex((d) => d.compNo === response.data.body.compNo);
                if (idx > -1) draft.splice(idx, 1, response.data.body);
            });
            yield put({
                type: act.GET_ISSUE_DESKING_SUCCESS,
                payload: { body: { list: desking } },
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 이슈 데스킹 전송
 */
function* publishIssueDesking({ payload }) {
    const ACTION = act.SAVE_ISSUE_DESKING;
    const { callback, ...rest } = payload;
    let callbackData;

    try {
        const response = yield call(api.publishIssueDesking, rest);
        callbackData = response.data;
        if (response.data.header.success) {
            let desking = yield select(({ issue }) => issue.desking);
            desking = produce(desking, (draft) => {
                const idx = desking.findIndex((d) => d.compNo === response.data.body.compNo);
                if (idx > -1) draft.splice(idx, 1, response.data.body);
            });
            yield put({
                type: act.GET_ISSUE_DESKING_SUCCESS,
                payload: { body: { list: desking } },
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 이슈 데스킹 히스토리 목록 조회
 */
const getIssueDeskingHistoryList = createRequestSaga(act.GET_ISSUE_DESKING_HISTORY_LIST, api.getIssueDeskingHistoryList);

/**
 * 이슈 데스킹 히스토리 상세 조회
 */
const getIssueDeskingHistory = createRequestSaga(act.GET_ISSUE_DESKING_HISTORY, api.getIssueDeskingHistory);

/**
 * 이슈 데스킹 예약
 */
const postReserveIssueDesking = createRequestSaga(act.POST_RESERVE_ISSUE_DESKING, api.reserveIssueDesking);

/**
 * 이슈 데스킹 예약 삭제
 */
const deleteReserveIssueDesking = createRequestSaga(act.DELETE_RESERVE_ISSUE_DESKING, api.deleteReserveIssueDesking);

/**
 * saga
 */
export default function* saga() {
    yield takeLatest(act.GET_ISSUE_LIST, getIssueList);
    yield takeLatest(act.GET_RECOMMEND_ISSUE_MODAL_LIST, getIssueList);
    yield takeLatest(act.GET_ISSUE, getIssue);
    yield takeLatest(act.SAVE_ISSUE, saveIssue);
    yield takeLatest(act.FINISH_ISSUE, updateFinishIssue);
    yield takeLatest(act.GET_ISSUE_LIST_MODAL, getIssueListModal);
    yield takeLatest(act.GET_ISSUE_CONTENTS_LIST_MODAL, getIssueContentsListModal);
    yield takeLatest(act.EXISTS_ISSUE_TITLE, existsIssueTitle);
    yield takeLatest(act.GET_ISSUE_DESKING, getIssueDesking);
    yield takeLatest(act.SAVE_ISSUE_DESKING, saveIssueDesking);
    yield takeLatest(act.PUBLISH_ISSUE_DESKING, publishIssueDesking);
    yield takeLatest(act.GET_ISSUE_DESKING_HISTORY_LIST, getIssueDeskingHistoryList);
    yield takeLatest(act.GET_ISSUE_DESKING_HISTORY, getIssueDeskingHistory);
    yield takeLatest(act.POST_RESERVE_ISSUE_DESKING, postReserveIssueDesking);
    yield takeLatest(act.DELETE_RESERVE_ISSUE_DESKING, deleteReserveIssueDesking);
}
