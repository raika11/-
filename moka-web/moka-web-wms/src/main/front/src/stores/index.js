import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import loadingStore from './loadingStore';
import snackbarStore from './notification/snackbarStore';
// auth
import authStore from './auth/authStore';
import authSaga from './auth/authSaga';
// 도메인
import domainStore from './domain/domainStore';
import domainSaga from './domain/domainSaga';
// 볼륨
import volumeStore from './volume/volumeStore';
import volumeSaga from './volume/volumeSaga';
// 페이지
import pageSaga from './page/pageSaga';
import pageStore from './page/pageStore';
import mergeStore from './page/mergeStore';
import mergeSaga from './page/mergeSaga';
import pageRelationPGStore, { pageRelationPGSaga } from './page/pageRelationPGStore';
import pageHistoryStore, { pageHistorySaga } from './page/pageHistoryStore';
// 본문스킨
import skinStore, { skinSaga } from './skin/skinStore';
// 컨테이너
import containerStore from './container/containerStore';
import containerSaga from './container/containerSaga';
import containerRelationPGStore, {
    containerRelationPGSaga
} from './container/containerRelationPGStore';
import containerRelationCSStore, {
    containerRelationCSSaga
} from './container/containerRelationCSStore';
import containerRelationCTStore, {
    containerRelationCTSaga
} from './container/containerRelationCTStore';
import containerHistoryStore, { containerHistorySaga } from './container/containerHistoryStore';
// 컴포넌트
import componentStore from './component/componentStore';
import componentSaga from './component/componentSaga';
import componentRelationPGStore from './component/componentRelationPGStore';
import componentRelationCSStore from './component/componentRelationCSStore';
import componentRelationCTStore from './component/componentRelationCTStore';
// 템플릿
import templateStore from './template/templateStore';
import templateSaga from './template/templateSaga';
import templateHistoryStore from './template/templateHistoryStore';
import templateRelationPGStore from './template/templateRelationPGStore';
import templateRelationCSStore from './template/templateRelationCSStore';
import templateRelationCTStore from './template/templateRelationCTStore';
import templateRelationCPStore from './template/templateRelationCPStore';
// 코드
import etccodeStore from './etccode/etccodeStore';
import etccodeSaga from './etccode/etccodeSaga';
// 데이터셋
import datasetSaga from './dataset/datasetSaga';
import datasetStore from './dataset/datasetStore';
import datasetRelationPGStore, { datasetRelationPGSaga } from './dataset/datasetRelationPGStore';
import datasetRelationCSStore, { datasetRelationCSSaga } from './dataset/datasetRelationCSStore';
import datasetRelationCTStore, { datasetRelationCTSaga } from './dataset/datasetRelationCTStore';
import datasetRelationCPStore, { datasetRelationCPSaga } from './dataset/datasetRelationCPStore';
import apiStore, { apiSaga } from './dataset/apiStore';
import datasetAutoStore, { datasetAutoSaga } from './dataset/datasetAutoStore';
// 기타코드
import etccodeTypeStore from './etccodeType/etccodeTypeStore';
import etccodeTypeSaga from './etccodeType/etccodeTypeSaga';
// 분류코드
import codeStore from './code/codeStore';
import codeSaga from './code/codeSaga';
// 예약어
import reservedStore from './reserved/reservedStore';
import reservedSaga from './reserved/reservedSaga';
// 광고
import adStore from './ad/adStore';
import adSaga from './ad/adSaga';
// 화면편집
import deskingStore from './desking/deskingStore';
import deskingHistoryStore from './desking/deskingHistoryStore';
import deskingSaga from './desking/deskingSaga';
import gridStore from './desking/gridStore';
import gridSaga from './desking/gridSaga';
// 기사
import articleStore from './article/articleStore';
import relationArticleStore from './article/relationArticleStore';
import articleSaga from './article/articleSaga';

const rootReducer = combineReducers({
    loadingStore,
    snackbarStore,
    authStore,
    domainStore,
    volumeStore,
    pageStore,
    pageRelationPGStore,
    pageHistoryStore,
    containerStore,
    containerRelationPGStore,
    containerRelationCSStore,
    containerRelationCTStore,
    containerHistoryStore,
    skinStore,
    componentStore,
    componentRelationPGStore,
    componentRelationCSStore,
    componentRelationCTStore,
    templateStore,
    templateHistoryStore,
    templateRelationPGStore,
    templateRelationCSStore,
    templateRelationCTStore,
    templateRelationCPStore,
    etccodeStore,
    datasetStore,
    datasetRelationPGStore,
    datasetRelationCSStore,
    datasetRelationCTStore,
    datasetRelationCPStore,
    apiStore,
    mergeStore,
    datasetAutoStore,
    etccodeTypeStore,
    codeStore,
    reservedStore,
    adStore,
    deskingStore,
    deskingHistoryStore,
    gridStore,
    articleStore,
    relationArticleStore
});

export function* rootSaga() {
    yield all([
        authSaga(),
        domainSaga(),
        volumeSaga(),
        pageSaga(),
        pageRelationPGSaga(),
        pageHistorySaga(),
        containerSaga(),
        containerRelationPGSaga(),
        containerRelationCSSaga(),
        containerRelationCTSaga(),
        containerHistorySaga(),
        skinSaga(),
        componentSaga(),
        templateSaga(),
        etccodeSaga(),
        datasetSaga(),
        datasetRelationPGSaga(),
        datasetRelationCSSaga(),
        datasetRelationCTSaga(),
        datasetRelationCPSaga(),
        apiSaga(),
        mergeSaga(),
        datasetAutoSaga(),
        etccodeTypeSaga(),
        codeSaga(),
        reservedSaga(),
        adSaga(),
        deskingSaga(),
        gridSaga(),
        articleSaga()
    ]);
}

export default rootReducer;
