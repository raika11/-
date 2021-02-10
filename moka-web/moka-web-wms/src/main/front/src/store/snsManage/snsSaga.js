import * as api from '@store/snsManage/snsApi';
import * as action from '@store/snsManage/snsAction';
import { takeLatest, put, call } from 'redux-saga/effects';

import { finishLoading, startLoading } from '@store/loading';
import { errorResponse } from '@store/commons/saga';
import { BLANK_IMAGE_PATH, DB_DATEFORMAT, IR_URL, PDS_URL, snsNames } from '@/constants';
import commonUtil from '@utils/commonUtil';
import moment from 'moment';
import { unescapeHtml } from '@utils/convertUtil';
/************* 메타 **********************/
function toSaveSnsMeta(data) {
    const params = {};
    data.forEach((data) => {
        params[data.snsType] = {
            usedYn: data.usedYn === true ? 'Y' : 'N',
            reserveDt: data.reserveDt,
            snsPostMsg: data.postMessage,
            imgUrl: data.imgUrl,
            artTitle: data.title,
            artSummary: data.summary,
            snsType: data.snsType.toUpperCase(),
            snsArtSts: 'I',
            imgFile: data.imgFile,
        };
    });

    return params;
}

function toSnsMetaViewData({ snsShare, article }) {
    const { totalId } = article;
    let { articleBasic, snsRegDt } = snsShare;
    if (commonUtil.isEmpty(articleBasic)) {
        articleBasic = {};
    }
    const { fbMetaUsedYn, fbMetaTitle, fbMetaSummary, fbMetaPostMsg, fbMetaImage, fbMetaReserveDt } = article;
    const { twMetaUsedYn, twMetaTitle, twMetaSummary, twMetaPostMsg, twMetaImage, twMetaReserveDt } = article;

    const { serviceFlag, artTitle, artSummary, artThumb, artRegDt } = articleBasic;

    return {
        totalId: commonUtil.setDefaultValue(totalId),
        fb: {
            usedYn: commonUtil.setDefaultValue(fbMetaUsedYn, 'N') === 'Y',
            title: unescapeHtml(commonUtil.setDefaultValue(fbMetaTitle)),
            summary: unescapeHtml(commonUtil.setDefaultValue(fbMetaSummary)),
            postMessage: unescapeHtml(commonUtil.setDefaultValue(fbMetaPostMsg)),
            imgUrl: toMetaImage(
                commonUtil.setDefaultValue(
                    fbMetaImage,
                    'https://ir.joins.com/?t=k&w=100&h=100u=/news/component/htmlphoto_mmdata/202008/21/317e1fcf-38af-4979-91d5-77d782271002.jpg.tn_120.jpg',
                ),
            ),
            isReserve: !commonUtil.isEmpty(fbMetaReserveDt),
            reserveDt: fbMetaReserveDt,
        },
        tw: {
            usedYn: commonUtil.setDefaultValue(twMetaUsedYn, 'N') === 'Y',
            title: unescapeHtml(commonUtil.setDefaultValue(twMetaTitle)),
            summary: unescapeHtml(commonUtil.setDefaultValue(twMetaSummary)),
            postMessage: unescapeHtml(commonUtil.setDefaultValue(twMetaPostMsg)),
            imgUrl: toMetaImage(
                commonUtil.setDefaultValue(
                    twMetaImage,
                    'https://ir.joins.com/?t=k&w=100&h=100u=/news/component/htmlphoto_mmdata/202008/21/317e1fcf-38af-4979-91d5-77d782271002.jpg.tn_120.jpg',
                ),
            ),
            isReserve: !commonUtil.isEmpty(twMetaReserveDt),
            reserveDt: twMetaReserveDt,
        },
        article: {
            serviceFlag: commonUtil.setDefaultValue(serviceFlag, 'N') === 'Y',
            title: unescapeHtml(commonUtil.setDefaultValue(artTitle)),
            summary: unescapeHtml(commonUtil.setDefaultValue(artSummary)),
            imgUrl: toMetaImage(
                commonUtil.setDefaultValue(
                    artThumb,
                    'https://ir.joins.com/?t=k&w=100&h=100u=/news/component/htmlphoto_mmdata/202008/21/317e1fcf-38af-4979-91d5-77d782271002.jpg.tn_120.jpg',
                ),
            ),
            regDt: artRegDt,
            snsRegDt: snsRegDt && moment(snsRegDt).format(DB_DATEFORMAT),
        },
    };
}

function toSnsMetaListData(response) {
    return response.map((data) => {
        const id = data.totalId;
        const { thumbnail, snsFlag } = setThumbnail(data.artThumb, data.fbMetaImage);
        const forwardDate = moment(new Date(data.serviceDt)).format('YYYY-MM-DD');
        const title = data.artTitle;
        const summary = data.fbMetaTitle;
        const sendStatus = setHasSendSnsIcons(data);
        const status = setStatus(data);
        const sendDt = data.sendDt;
        const hasSnsArticleSendButtons = setHasSnsArticleSendButtons(data);

        return { id, thumbnail, snsFlag, forwardDate, title, summary, status, sendStatus, sendDt, hasSnsArticleSendButtons };
    });
}

function setHasSnsArticleSendButtons({ iud, insDt, sendDt, statusMsg, sourceCode, fbStatusId, fbArticleId }) {
    const hasButtons = { send: false, reSend: false, delete: false };
    const nFbArticleId = parseInt(fbArticleId);

    if (commonUtil.isEmpty(insDt) && nFbArticleId === 0) {
        hasButtons['send'] = true;
    } else if (!commonUtil.isEmpty(insDt) && nFbArticleId === 0) {
        if (statusMsg.toUpperCase().startsWith('FAILED')) {
            if (iud === 'I' || iud === 'U') {
                hasButtons['reSend'] = true;
            } else {
                hasButtons['delete'] = true;
            }
        }
    } else if (!commonUtil.isEmpty(insDt) && nFbArticleId > 0) {
        if (iud === 'I' || iud === 'U') {
            hasButtons['reSend'] = true;
            if (statusMsg.toUpperCase().startsWith('FAILED')) {
                hasButtons['delete'] = true;
            }
        } else {
            if (statusMsg.toUpperCase().startsWith('FAILED')) {
                hasButtons['delete'] = true;
            } else {
                hasButtons['reSend'] = true;
            }
        }
    }

    return hasButtons;
}

function setHasSendSnsIcons({ sendSnsType, fbSendSnsArtId, fbSendSnsArtSts, twSendSnsArtId, twSendSnsArtSts }) {
    const hasIcons = { facebook: false, twitter: false, button: true };
    if (!commonUtil.isEmpty(sendSnsType)) {
        if (sendSnsType.toUpperCase().indexOf('FB') >= 0) {
            hasIcons.button = false;
            if (!commonUtil.isEmpty(fbSendSnsArtId) && !commonUtil.isEmpty(fbSendSnsArtSts)) {
                hasIcons.facebook = true;
            }
        }
        if (sendSnsType.toUpperCase().indexOf('TW') >= 0) {
            hasIcons.button = false;
            if (!commonUtil.isEmpty(twSendSnsArtId) && !commonUtil.isEmpty(twSendSnsArtSts)) {
                hasIcons.twitter = true;
            }
        }
    }
    return hasIcons;
}

function setThumbnail(articleThumbnailUrl, snsThumbnailUrl) {
    let thumbnail = IR_URL + BLANK_IMAGE_PATH;
    let snsFlag = false;
    if (!commonUtil.isEmpty(articleThumbnailUrl)) {
        if (!commonUtil.isEmpty(snsThumbnailUrl)) {
            thumbnail = snsThumbnailUrl;
            snsFlag = true;
        } else {
            thumbnail = PDS_URL + articleThumbnailUrl;
        }
    }

    return { thumbnail, snsFlag };
}

function setStatus({ iud, insDt, sendDt, statusMsg, fbStatusId, fbArticleId }) {
    let sendType = '';
    let sendStatus = '';
    //const nFbStatusId = parseInt(fbStatusId);
    const nFbArticleId = parseInt(fbArticleId);
    if (!commonUtil.isEmpty(insDt)) {
        switch (iud) {
            case 'I':
            case 'U':
                sendType = '전송';
                break;
            default:
                sendType = '삭제';
                break;
        }
        if (commonUtil.isEmpty(sendDt)) {
            sendStatus = ' / 대기';
        } else if (!commonUtil.isEmpty(sendDt) && nFbArticleId === 0) {
            if (statusMsg.toUpperCase().startsWith('FAILED')) {
                sendStatus = ' / 오류';
            } else {
                sendStatus = ' / 대기FB';
            }
        } else {
            if (statusMsg.toUpperCase().startsWith('FAILED')) {
                sendStatus = ' / 오류';
            } else {
                sendStatus = ' / 완료';
            }
        }
    } else {
        sendType = '미전송';
    }

    return sendType + sendStatus;
}

function* publishSnsMeta({ type, payload }) {
    yield put(startLoading(action.GET_SNS_META));
    const data = toSaveSnsMeta(payload.data);
    yield saveSnsMeta({
        type,
        payload: {
            ...payload,
            callback: function* (saveResponse) {
                if (saveResponse.header.success) {
                    if (data[saveResponse.body.id.snsType]) {
                        const snsData = data[saveResponse.body.id.snsType];
                        const response = yield call(api.postSnsPublish, {
                            totalId: payload.totalId,
                            message: snsData.snsPostMsg,
                            reserveDt: snsData.reserveDt,
                            snsType: snsData.snsType,
                        });
                        if (payload.callback instanceof Function) {
                            payload.callback(response.data);
                        }
                    }
                } else {
                    if (payload.callback instanceof Function) {
                        payload.callback(saveResponse);
                    }
                }

                yield put(finishLoading(action.GET_SNS_META));
            },
        },
    });
}

function toMetaImage(metaImageUrl) {
    let toMetaImageUrl = metaImageUrl;

    if (toMetaImageUrl.indexOf(IR_URL) < 0) {
        if (toMetaImageUrl.indexOf('https://') < 0 && toMetaImageUrl.indexOf('http://') < 0) {
            toMetaImageUrl = PDS_URL + toMetaImageUrl;
        }

        if (toMetaImageUrl.indexOf('.tn_120') > 0) {
            toMetaImageUrl = toMetaImageUrl.split('.tn_120')[0];
        }
    }
    return toMetaImageUrl;
}

function* saveSnsMeta({ type, payload: { totalId, data, callback } }) {
    yield put(startLoading(action.GET_SNS_META));
    const params = toSaveSnsMeta(data);
    if (params['FB']) {
        const response = yield call(api.putSnsMeta, totalId, params['FB']);
        if (callback instanceof Function) {
            const callbackResponse = response.data;
            yield callback({ ...callbackResponse, header: { ...callbackResponse.header, message: `${snsNames['fb']} ${callbackResponse.header.message}` } });
        }
    }

    if (params['TW']) {
        const response = yield call(api.putSnsMeta, totalId, params['TW']);
        if (callback instanceof Function) {
            const callbackResponse = response.data;
            yield callback({ ...callbackResponse, header: { ...callbackResponse.header, message: `${snsNames['tw']} ${callbackResponse.header.message}` } });
        }
    }

    yield put(finishLoading(action.GET_SNS_META));
}

function* getSnsMeta({ type, payload: totalId }) {
    yield put(startLoading(type));

    try {
        const response = yield call(api.getSnsMeta, totalId);
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

function* getSnsMetaList({ type, payload }) {
    yield put(startLoading(type));
    try {
        const search = { ...payload, startDt: moment(payload.startDt).format(DB_DATEFORMAT), endDt: moment(payload.endDt).format(DB_DATEFORMAT) };
        const response = yield call(api.getSnsMetaList, { search });

        if (response.data.header.success) {
            const list = toSnsMetaListData(response.data.body.list);

            yield put({ type: `${type}_SUCCESS`, payload: { ...response.data, body: { ...response.data.body, list } } });
        } else {
            yield put({ type: `${type}_FAILURE`, payload: response.data });
        }
    } catch (e) {
        yield put({ type: `${type}_FAILURE`, payload: errorResponse(e) });
    }
    yield put(finishLoading(type));
}

/************* 메타 **********************/
/************* 전송기사 **********************/
function toSnsSendArticleListData(response) {
    return response.map((data) => ({
        id: data.id.totalId,
        title: unescapeHtml(data.artTitle),
        imgUrl: data.imgUrl,
        usedYn: data.usedYn,
        sendDt: data.snsInsDt,
    }));
}

function* getSnsSendArticle({ type, payload }) {
    yield put(startLoading(type));

    const response = yield call(api.getSnsSendArticleList, { search: payload });
    const list = toSnsSendArticleListData(response.data.body.list);
    yield put({ type: `${type}_SUCCESS`, payload: { ...response.data, body: { ...response.data.body, list } } });

    yield put(finishLoading(type));
}

export default function* snsSaga() {
    /************* 메타 **********************/
    yield takeLatest(action.GET_SNS_META_LIST, getSnsMetaList);
    yield takeLatest(action.GET_SNS_META, getSnsMeta);
    yield takeLatest(action.SAVE_SNS_META, saveSnsMeta);
    yield takeLatest(action.PUBLISH_SNS_META, publishSnsMeta);
    /************* 메타 **********************/
    /************* 전송기사 **********************/
    yield takeLatest(action.GET_SNS_SEND_ARTICLE_LIST, getSnsSendArticle);
}
