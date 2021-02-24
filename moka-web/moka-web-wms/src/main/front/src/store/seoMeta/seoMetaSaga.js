import { call, put, takeLatest } from 'redux-saga/effects';
import { finishLoading, startLoading } from '@store/loading';
import { errorResponse } from '@store/commons/saga';
import moment from 'moment';
import * as api from '@store/seoMeta/seoMetaApi';
import * as action from '@store/seoMeta/seoMetaAction';
import commonUtil from '@utils/commonUtil';
import { unescapeHtml } from '@utils/convertUtil';
import { snsNames } from '@/constants';

function toSeoMetaListData(list) {
    return list.map((data) => {
        return {
            ...data,
            artTitle: unescapeHtml(data.artTitle),
            serviceDt: moment(data.serviceDt).format('YYYY-MM-DD HH:mm'),
            isInsert: data.sendSnsType.indexOf('JA') < 0,
        };
    });
}

/**
 * SNS 메타 목록 조회
 */
function* getSeoMetaList({ type, payload }) {
    yield put(startLoading(type));
    try {
        const response = yield call(api.getSeoMetaList, { search: payload });

        if (response.data.header.success) {
            const list = toSeoMetaListData(response.data.body.list);
            yield put({ type: `${type}_SUCCESS`, payload: { ...response.data, body: { ...response.data.body, list } } });
        } else {
            yield put({ type: `${type}_FAILURE`, payload: response.data });
        }
    } catch (e) {
        yield put({ type: `${type}_FAILURE`, payload: errorResponse(e) });
        console.log(e);
    }
    yield put(finishLoading(type));
}

function toSnsMetaViewData({ snsShare, article }) {
    // 기사정보
    const { totalId, artSummary, artTitle, keywords } = article;
    // SNS 정보
    const { artKeyword: jaKeyword, artTitle: jaMetaTitle, artSummary: jaMetaSummary, regDt, usedYn, id } = snsShare;
    let keyword = '';
    if (!commonUtil.isEmpty(keywords)) {
        keyword = keywords
            .split(',')
            .map((s) => s.split('|:')[1])
            .join(',');
    }

    return {
        totalId,
        title: unescapeHtml(commonUtil.isEmpty(regDt) ? artTitle : jaMetaTitle),
        summary: unescapeHtml(commonUtil.isEmpty(regDt) ? artSummary : jaMetaSummary),
        keyword,
        addKeyword: commonUtil.isEmpty(jaKeyword) ? '' : jaKeyword,
        usedYn: commonUtil.isEmpty(usedYn) ? 'Y' : usedYn,
        isInsert: commonUtil.isEmpty(id),
    };
}

function* getSeoMeta({ type, payload: totalId }) {
    yield put(startLoading(type));

    try {
        const response = yield call(api.getSeoMeta, totalId);
        if (response.data.header.success) {
            yield put({ type: `${type}_SUCCESS`, payload: toSnsMetaViewData(response.data.body) });
        } else {
            yield put({ type: `${type}_FAILURE`, payload: response.data });
        }
    } catch (e) {
        yield put({ type: `${type}_FAILURE`, payload: errorResponse(e) });
    }
    yield put(finishLoading(type));
}

function toSaveSeoMeta(data) {
    return {
        usedYn: data.usedYn,
        artTitle: data.title,
        artSummary: data.summary,
        artKeyword: data.addKeyword,
        snsType: 'JA',
    };
}

function* saveSeoMeta({ type, payload: { data, callback } }) {
    yield put(startLoading(action.GET_SEO_META));
    const params = toSaveSeoMeta(data);

    console.log(params);

    const response = yield call(api.putSeoMeta, data.totalId, params);
    if (callback instanceof Function) {
        const callbackResponse = response.data;
        yield callback({ ...callbackResponse, header: { ...callbackResponse.header, message: `${snsNames['fb']} ${callbackResponse.header.message}` } });
    }

    yield put(finishLoading(action.GET_SEO_META));
}

export default function* seoMetaSaga() {
    yield takeLatest(action.GET_SEO_META_LIST, getSeoMetaList);
    yield takeLatest(action.GET_SEO_META, getSeoMeta);
    yield takeLatest(action.SAVE_SEO_META, saveSeoMeta);
}
