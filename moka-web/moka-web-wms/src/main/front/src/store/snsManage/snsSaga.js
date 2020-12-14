import * as api from '@store/snsManage/snsApi';
import * as action from '@store/snsManage/snsAction';
import { takeLatest, put, call } from 'redux-saga/effects';

import { finishLoading, startLoading } from '@store/loading';
import { errorResponse } from '@store/commons/saga';
import { IMAGE_DEFAULT_URL } from '@/constants';
import commonUtil from '@utils/commonUtil';
import moment from 'moment';

function* getSnsMeta({ type, payload: totalId }) {
    yield put(startLoading(type));

    const response = yield call(api.getSnsMeta, totalId);
    try {
        if (response.data.header.success) {
            yield put({ type: `${type}_SUCCESS`, payload: toSnsMetaData(response.data.body) });
        } else {
            yield put({ type: `${type}_FAILURE`, payload: response.data });
        }
    } catch (e) {
        yield put({ type: `${type}_FAILURE`, payload: errorResponse(e) });
    }
    yield put(finishLoading(type));
}

function toSnsMetaData({ snsShare, article }) {
    const textArea = document.createElement('textarea');
    textArea.innerText = commonUtil.setDefaultValue(article.fbMetaTitle);

    return {
        totalId: commonUtil.setDefaultValue(article.totalId),
        fb: {
            usedYn: commonUtil.setDefaultValue(article.fbMetaUsedYn, 'N') === 'Y',
            title: commonUtil.setDefaultValue(article.fbMetaTitle),
            summary: commonUtil.setDefaultValue(article.fbMetaSummary),
            postMessage: commonUtil.setDefaultValue(article.fbMetaPostMsg),
            metaImage: toMetaImage(
                commonUtil.setDefaultValue(
                    article.fbMetaImage,
                    'https://ir.joins.com/?t=k&w=100&h=100u=/news/component/htmlphoto_mmdata/202008/21/317e1fcf-38af-4979-91d5-77d782271002.jpg.tn_120.jpg',
                ),
            ),
            isReserve: !commonUtil.isEmpty(article.fbMetaReserveDt),
            reserveDt: article.fbMetaReserveDt,
        },
        tw: {
            usedYn: commonUtil.setDefaultValue(article.twMetaUsedYn, 'N') === 'Y',
            title: commonUtil.setDefaultValue(article.twMetaTitle),
            summary: commonUtil.setDefaultValue(article.twMetaSummary),
            postMessage: commonUtil.setDefaultValue(article.twMetaPostMsg),
            metaImage: toMetaImage(
                commonUtil.setDefaultValue(
                    article.twMetaImage,
                    'https://ir.joins.com/?t=k&w=100&h=100u=/news/component/htmlphoto_mmdata/202008/21/317e1fcf-38af-4979-91d5-77d782271002.jpg.tn_120.jpg',
                ),
            ),
            isReserve: !commonUtil.isEmpty(article.twMetaReserveDt),
            reserveDt: article.twMetaReserveDt,
        },
    };
}

function toMetaImage(metaImageUrl) {
    let toMetaImageUrl = metaImageUrl;
    if (toMetaImageUrl.indexOf('https://ir.joins.com/') < 0) {
        if (toMetaImageUrl.indexOf('https://pds.joins.com') < 0) {
            toMetaImageUrl = `https://pds.joins.com/${toMetaImageUrl}`;
        }

        if (toMetaImageUrl.indexOf('.tn_120') > 0) {
            toMetaImageUrl = toMetaImageUrl.split('.tn_120')[0];
        }
    }

    return toMetaImageUrl;
}

function* getSnsMetaList({ type, payload }) {
    yield put(startLoading(type));
    try {
        const response = yield call(api.getSNSMetaList, { search: payload });

        if (response.data.header.success) {
            const list = toSnsMetaListData(response.data.body.list);

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
    //console.log(totalId, sendSnsType, fbSendSnsArtId, fbSendSnsArtSts, fbSendSnsArtSts, twSendSnsArtId, twSendSnsArtSts);
    if (!commonUtil.isEmpty(sendSnsType)) {
        if (sendSnsType.toUpperCase().indexOf('FB') >= 0) {
            hasIcons.button = false;
            if (!commonUtil.isEmpty(fbSendSnsArtId) && !commonUtil.isEmpty(fbSendSnsArtSts)) {
                hasIcons.facebook = true;
            }
        }
        if (sendSnsType.toUpperCase().indexOf('TW') >= 0) {
            hasIcons.button = false;
            if (!commonUtil.isEmpty(fbSendSnsArtId) && !commonUtil.isEmpty(fbSendSnsArtSts)) {
                hasIcons.twitter = true;
            }
        }
    }
    return hasIcons;
}

function setThumbnail(articleThumbnailUrl, snsThumbnailUrl) {
    let thumbnail = IMAGE_DEFAULT_URL;
    let snsFlag = false;
    if (!commonUtil.isEmpty(articleThumbnailUrl)) {
        if (!commonUtil.isEmpty(snsThumbnailUrl)) {
            thumbnail = snsThumbnailUrl;
            snsFlag = true;
        } else {
            thumbnail = IMAGE_DEFAULT_URL + articleThumbnailUrl;
        }
    } else {
        thumbnail = 'https://ir.joins.com/?t=k&w=100&h=100u=/news/component/htmlphoto_mmdata/202008/21/317e1fcf-38af-4979-91d5-77d782271002.jpg.tn_120.jpg';
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
        } else if (!commonUtil.isEmpty(sendDt) && nFbArticleId == 0) {
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

export default function* snsSaga() {
    yield takeLatest(action.GET_SNS_META_LIST, getSnsMetaList);
    yield takeLatest(action.GET_SNS_META, getSnsMeta);
}
