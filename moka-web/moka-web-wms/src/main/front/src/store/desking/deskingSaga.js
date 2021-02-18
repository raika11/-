import { takeLatest, takeEvery, put, call, select } from 'redux-saga/effects';
import { createRequestSaga, errorResponse } from '@store/commons/saga';
import { getRowIndex } from '@utils/agGridUtil';
import { getMoveMode } from '@utils/deskingUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import * as api from './deskingApi';
import * as act from './deskingAction';
import { DEFAULT_LANG } from '@/constants';

const DRAG_STOP_RESULT = {
    existRow: { success: false, message: '이미 존재하는 기사입니다' },
    unmovableRow: { success: false, message: '관련기사를 포함한 주기사를 이동하세요' },
    incorrectRow: { success: false, message: '올바른 주기사를 선택하세요' },
};

/**
 * Desking API 호출 => 결과를 COMPONENT_WORK_ 액션에 담는다
 * @param {string} actionType 액션명
 * @param {func} api API 함수
 * @param {string} status 워크의 state
 */
export function createDeskingRequestSaga(actionType, api, status) {
    return function* (action) {
        const payload = action.payload;
        const { callback } = payload;
        let callbackData;

        yield put(startLoading(actionType));

        try {
            const response = yield call(api, action.payload);
            callbackData = { ...response.data, payload };

            if (response.data.header.success) {
                yield put({
                    type: act.COMPONENT_WORK_SUCCESS,
                    payload: { ...response.data, status },
                });
            } else {
                yield put({
                    type: act.COMPONENT_WORK_FAILURE,
                    payload: { ...response.data },
                });
            }
        } catch (e) {
            callbackData = errorResponse(e);
        }

        if (typeof callback === 'function') {
            yield call(callback, { ...callbackData, status });
        }

        yield put(finishLoading(actionType));
    };
}

/**
 * 편집영역 클릭시, 컴포넌트 워크 목록 조회
 */
function* getComponentWorkList({ payload }) {
    const { areaSeq, callback } = payload;
    const ACTION = act.GET_COMPONENT_WORK_LIST;
    let response,
        callbackData,
        isNaverChannel = false,
        isNaverStand = false;

    yield put(startLoading(ACTION));
    try {
        response = yield call(api.getComponentWorkList, { areaSeq });
        callbackData = { ...response.data, isNaverChannel, isNaverStand };

        if (response.data.header.success) {
            const { area, desking } = response.data.body;

            if (area.page?.pageUrl === '/naver-channel') {
                // 편집영역의 페이지가 네이버채널 페이지면 컴포넌트 워크의 임시저장된 템플릿 정보를 조회한다
                isNaverChannel = true;
                callbackData.isNaverChannel = isNaverChannel;

                // 컴포넌트가 1개만 있다고 가정 (여러개가 되면 소스 수정해야함)
                const targetComponent = desking[0];
                // 임시저장되어있는 템플릿ID 조회
                const second = yield call(api.getComponentTemplate, { componentSeq: targetComponent?.componentSeq });
                if (second.data.header.success) {
                    // 컴포넌트의 원래 템플릿ID와 임시저장된 템플릿ID가 다르면 ====> 컴포넌트워크의 템플릿ID 변경
                    if (second.data.body.templateSeq !== targetComponent.templateSeq) {
                        const third = yield call(api.putComponentWorkTemplate, { componentWorkSeq: targetComponent.seq, templateSeq: second.data.body?.templateSeq });
                        if (third.data.header.success) {
                            callbackData = { ...callbackData, ...third.data, isNaverChannel };
                        }
                    }
                }
            } else if (area.page?.pageUrl === '/naver-stand') {
                // 편집영역의 페이지가 네이버스탠드 페이지인지 체크
                isNaverStand = true;
                callbackData.isNaverStand = isNaverStand;
            }

            yield put({
                type: act.GET_COMPONENT_WORK_LIST_SUCCESS,
                payload: callbackData,
            });
        } else {
            yield put({
                type: act.GET_COMPONENT_WORK_HISTORY_FAILURE,
                payload: callbackData,
            });
        }
    } catch (e) {
        callbackData = { ...errorResponse(e), isNaverChannel, isNaverStand };
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 컴포넌트 워크 조회
 */
const getComponentWork = createDeskingRequestSaga(act.GET_COMPONENT_WORK, api.getComponentWork, 'work');

/**
 * 컴포넌트 워크 수정(스냅샷 제외)
 */
const putComponentWork = createDeskingRequestSaga(act.PUT_COMPONENT_WORK, api.putComponentWork, 'work');

/**
 * 컴포넌트 워크 스냅샷 수정
 */
const putSnapshotComponentWork = createDeskingRequestSaga(act.PUT_SNAPSHOT_COMPONENT_WORK, api.putSnapshotComponentWork, 'work');

/**
 * 컴포넌트 워크 수정(템플릿만)
 */
const putComponentWorkTemplate = createDeskingRequestSaga(act.PUT_COMPONENT_WORK_TEMPLATE, api.putComponentWorkTemplate, 'work');

/**
 * 데스킹 워크의 관련기사 Row 생성
 * @param {object} data 기사 데이터
 * @param {number} relOrd 관련기사 순서
 * @param {object} parentData 주기사 데이터
 * @param {object} component 컴포넌트워크 데이터
 * @param {object} etc 그 외 데이터
 */
const makeRelRowNode = (data, relOrd, parentData, component, etc) => {
    const cid = data.gridType === 'ARTICLE' ? String(data.totalId) : data.contentId;

    // 주기사 데이터 없음 => 에러
    if (!parentData || parentData.contentId === null) return DRAG_STOP_RESULT.incorrectRow;

    // 이미 존재하는 기사 => 에러
    const existRow = component.deskingWorks.filter((desking) => desking.contentId === cid);
    if (existRow && existRow.length > 0) return DRAG_STOP_RESULT.existRow;

    let appendData = null;
    if (data.gridType === 'ARTICLE') {
        const { areaComp, domain } = etc;

        // 타이틀 변경, 1. 도메인에 따라 PC/M 타이틀 설정, 2. 데스킹파트 설정
        let title = '';
        if (domain?.servicePlatform === 'P') {
            title = data.artEditTitle || data.artJamTitle || data.artTitle;
        } else if (domain.servicePlatform === 'M') {
            title = data.artEditMobTitle || data.artJamMobTitle || data.artTitle;
        }
        if (areaComp?.deskingPart && areaComp?.deskingPart.indexOf('TITLE') < 0) {
            title = data.artTitle;
        }

        appendData = {
            componentWorkSeq: component.seq,
            seq: null,
            deskingSeq: null,
            datasetSeq: component.datasetSeq,
            contentId: String(data.totalId),
            parentContentId: parentData.contentId,
            contentType: data.contentType,
            artType: data.artType,
            sourceCode: data.sourceCode,
            contentOrd: parentData.contentOrd,
            relOrd,
            lang: DEFAULT_LANG,
            distDt: data.serviceDaytime,
            title: unescapeHtmlArticle(title),
            subTitle: unescapeHtmlArticle(data.artSubTitle),
            nameplate: null,
            titlePrefix: null,
            bodyHead: unescapeHtmlArticle(data.artSummary),
            linkUrl: `//${domain?.domainUrl}/article/${data.totalId}`,
            linkTarget: '_self',
            boxUrl: null,
            boxTarget: '_self',
            thumbFileName: data.artPdsThumb,
            rel: true,
            relSeqs: null,
        };
    }

    return { success: true, list: appendData };
};

/**
 * 데스킹 워크의 주기사 Row 생성
 * @param {object} data 기사 데이터
 * @param {number} contentOrd 기사 순서
 * @param {object} component 컴포넌트워크 데이터
 * @param {object} etc 그 외 데이터
 */
const makeRowNode = (data, contentOrd, component, etc) => {
    const cid = data.gridType === 'ARTICLE' ? String(data.totalId) : data.contentId;

    // 데이터가 없거나 기사키가 올바르지 않음 => 에러
    if (!data || cid === null) return DRAG_STOP_RESULT.incorrectRow;

    // 이미 존재하는 기사 => 에러
    const existRow = component.deskingWorks.filter((desking) => desking.contentId === cid);
    if (existRow && existRow.length > 0) return DRAG_STOP_RESULT.existRow;

    let appendData = null;
    if (data.gridType === 'ARTICLE') {
        const { areaComp, domain, isNaverChannel } = etc;

        // 타이틀 변경, 1. 도메인에 따라 PC/M 타이틀 설정, 2. 데스킹파트 설정, 3. 네이버채널일 경우 원본 제목
        let title = '';
        if (domain?.servicePlatform === 'P') {
            title = data.artEditTitle || data.artJamTitle || data.artTitle;
        } else if (domain.servicePlatform === 'M') {
            title = data.artEditMobTitle || data.artJamMobTitle || data.artTitle;
        }
        if (areaComp?.deskingPart && areaComp?.deskingPart.indexOf('TITLE') < 0) {
            title = data.artTitle;
        }
        if (isNaverChannel) {
            title = data.artTitle;
        }

        appendData = {
            componentWorkSeq: component.seq,
            seq: null,
            deskingSeq: null,
            datasetSeq: component.datasetSeq,
            contentId: String(data.totalId),
            parentContentId: null, // 주기사일 경우 null, 관련기사일경우 주기사 키 지정.
            contentType: data.contentType,
            artType: data.artType,
            sourceCode: data.sourceCode,
            contentOrd: contentOrd,
            relOrd: 1,
            lang: DEFAULT_LANG,
            distDt: data.serviceDaytime,
            title: unescapeHtmlArticle(title),
            subTitle: unescapeHtmlArticle(data.artSubTitle),
            nameplate: null,
            titlePrefix: null,
            bodyHead: unescapeHtmlArticle(data.artSummary),
            linkUrl: `//${domain?.domainUrl}/article/${data.totalId}`,
            linkTarget: '_self',
            boxUrl: null,
            boxTarget: '_self',
            thumbFileName: data.artPdsThumb,
            rel: false,
            relSeqs: null,
        };
    } else if (data.gridType === 'DESKING') {
        // 편집 컴포넌트영역 -> 편집컴포넌트 이동
        appendData = {
            ...data,
            regDt: undefined,
            componentWorkSeq: component.seq,
            componentSeq: component.componentSeq,
            datasetSeq: component.datasetSeq,
            contentOrd,
        };
    }

    return { success: true, list: appendData };
};

/**
 * 컴포넌트워크의 ag-grid row drag stop
 */
function* deskingDragStop({ payload }) {
    const { source, target, srcComponent, tgtComponent, areaComp, callback } = payload;
    const domain = yield select((store) => store.desking.area.domain);
    const isNaverChannel = yield select(({ desking }) => desking.isNaverChannel);

    let overIndex = -1,
        addRelArt = false,
        sourceNode = null,
        appendNodes = [];

    if (target.overIndex) {
        overIndex = target.overIndex;
    } else if (source.event) {
        overIndex = getRowIndex(source.event);
    }

    sourceNode = source.api.getSelectedNodes().length > 0 ? source.api.getSelectedNodes() : source.node;
    if (Array.isArray(sourceNode)) {
        // sourceNode 정렬 (childIndex 순으로)
        sourceNode = sourceNode.sort(function (a, b) {
            return a.childIndex - b.childIndex;
        });
    }

    // move api 호출 파악(컴포넌트 워크 간의 이동)
    const bMoveComponents = srcComponent?.seq >= 0;

    // 주기사 추가하는 함수
    const rd = (insertIndex) => {
        let ans = [];

        if (Array.isArray(sourceNode)) {
            // 기사 여러개 이동
            let contentOrdering = insertIndex - 1;
            sourceNode.some((node) => {
                if (!node.data.rel) contentOrdering++;
                const result = makeRowNode(node.data, contentOrdering, tgtComponent, { domain, areaComp, isNaverChannel });
                if (result.success) {
                    ans.push(result.list);
                    return false;
                } else {
                    callback && callback({ header: result });
                    ans = [];
                    return true;
                }
            });
        } else if (typeof sourceNode === 'object') {
            // 기사 1개 이동
            const result = makeRowNode(sourceNode.data, insertIndex, tgtComponent, { domain, areaComp, isNaverChannel });
            if (result.success) ans.push(result.list);
            else callback && callback({ header: result });
        }

        return ans;
    };

    // 관련기사 추가하는 함수
    const rrd = (firstIndex, parentData) => {
        let ans = [];

        if (Array.isArray(sourceNode)) {
            // 기사 여러개 이동
            sourceNode.some((node, idx) => {
                const result = makeRelRowNode(node.data, firstIndex + idx, parentData, tgtComponent, { domain, areaComp });
                if (result.success) {
                    ans.push(result.list);
                    return false;
                } else {
                    callback && callback({ header: result });
                    ans = [];
                    return true;
                }
            });
        } else if (typeof sourceNode === 'object') {
            // 기사 1개 이동
            const result = makeRelRowNode(sourceNode.data, firstIndex, parentData, tgtComponent, { domain, areaComp });
            if (result.success) ans.push(result.list);
            else callback && callback({ header: result });
        }

        return ans;
    };

    if (overIndex < 0) {
        // 1) 비어있는 ag-grid에 처음으로 데스킹할 때
        // 1-1) 워크 간의 이동일 때 이동가능한지 판단
        if (bMoveComponents) {
            const movable = getMoveMode(sourceNode, null);
            if (!movable && callback) {
                yield call(callback, { header: DRAG_STOP_RESULT.unmovableRow });
                return;
            }
        }

        appendNodes = rd(1);
    } else {
        // 2) 기사가 있는 ag-grid에 기사를 추가할 때
        const targetRowData = target.api.getDisplayedRowAtIndex(overIndex).data;

        // 2-1) 워크 간의 이동일 때 이동가능한지 판단
        if (bMoveComponents) {
            const movable = getMoveMode(sourceNode, targetRowData);
            if (!movable && callback) {
                yield call(callback, { header: DRAG_STOP_RESULT.unmovableRow });
                return;
            }
        }

        if (!targetRowData.rel) {
            // 2-2) hover된 row가 주기사 => 관련기사 추가인가? => 체크된 row에 targetRow가 있는지 확인한다
            const selectedNodes = target.api.getSelectedNodes();
            selectedNodes.forEach((s) => {
                if (s.data.contentId === targetRowData.contentId) addRelArt = true;
            });

            if (!addRelArt) {
                // 주기사 추가
                appendNodes = rd(targetRowData.contentOrd + 1);
            } else {
                // 관련기사 추가 (첫번째 index에 넣는다)
                const firstIndex = 1;
                appendNodes = rrd(firstIndex, targetRowData);
            }
        } else {
            // 2-3) hover된 row가 관련기사 => 주기사를 찾아서 체크된 row인지 확인한다
            const parentRow = target.api.getRowNode(targetRowData.parentContentId);

            if (parentRow.isSelected()) {
                // 관련기사 추가 (타겟의 relOrd의 밑으로)
                const firstIndex = targetRowData.relOrd + 1;
                appendNodes = rrd(firstIndex, parentRow.data);
            } else {
                // 주기사 추가 (parentRow의 밑으로)
                appendNodes = rd(parentRow.data.contentOrd + 1);
            }
        }
    }

    if (appendNodes.length < 1) return;
    if (bMoveComponents) {
        // 이동
        yield put({
            type: act.POST_DESKING_WORK_LIST_MOVE,
            payload: {
                componentWorkSeq: tgtComponent.seq,
                datasetSeq: tgtComponent.datasetSeq,
                srcComponentWorkSeq: srcComponent.seq,
                srcDatasetSeq: srcComponent.datasetSeq,
                list: appendNodes,
                callback,
            },
        });
    } else {
        // 추가
        yield put({
            type: act.POST_DESKING_WORK_LIST,
            payload: {
                componentWorkSeq: tgtComponent.seq,
                datasetSeq: tgtComponent.datasetSeq,
                list: appendNodes,
                callback,
            },
        });
    }
}

/**
 * Work컴포넌트 임시저장
 */
const postSaveComponentWork = createDeskingRequestSaga(act.POST_SAVE_COMPONENT_WORK, api.postSaveComponentWork, 'save');

/**
 * Work컴포넌트 전송
 */
const postPublishComponentWork = createDeskingRequestSaga(act.POST_PUBLISH_COMPONENT_WORK, api.postPublishComponentWork, 'publish');

/**
 * 컴포넌트 워크 임시저장 + 전송
 */
function* postSavePublishComponentWork({ payload }) {
    const { componentWorkSeq, areaSeq, callback } = payload;
    const ACTION = act.POST_SAVE_PUBLISH_COMPONENT_WORK;
    let callbackData;

    yield startLoading(ACTION);
    try {
        const saveResponse = yield call(api.postSaveComponentWork, { componentWorkSeq });

        if (saveResponse.data.header.success) {
            const publishResponse = yield call(api.postPublishComponentWork, { componentWorkSeq, areaSeq });
            callbackData = publishResponse.data;

            if (publishResponse.data.header.success) {
                yield put({
                    type: act.COMPONENT_WORK_SUCCESS,
                    payload: { ...publishResponse.data, status: 'publish' },
                });
            } else {
                yield put({
                    type: act.COMPONENT_WORK_FAILURE,
                    payload: publishResponse.data,
                });
            }
        } else {
            callbackData = saveResponse.data;
            yield put({
                type: act.COMPONENT_WORK_FAILURE,
                payload: saveResponse.data,
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
 * 컴포넌트 워크 예약
 */
const postReserveComponentWork = createDeskingRequestSaga(act.POST_RESERVE_COMPONENT_WORK, api.postReserveComponentWork);

/**
 * 컴포넌트 워크 예약 삭제
 */
const deleteReserveComponentWork = createDeskingRequestSaga(act.DELETE_RESERVE_COMPONENT_WORK, api.deleteReserveComponentWork);

/**
 * 컴포넌트 워크에 편집기사 리스트 등록 => 성공 결과) 컴포넌트 워크 데이터가 리턴됨
 */
const postDeskingWorkList = createDeskingRequestSaga(act.POST_DESKING_WORK_LIST, api.postDeskingWorkList, 'work');

/**
 * 컴포넌트 워크 간의 데스킹기사 이동
 */
function* postDeskingWorkListMove({ payload }) {
    const ACTION = act.POST_DESKING_WORK_LIST_MOVE;
    const { callback } = payload;
    let callbackData,
        status = 'work';

    yield put(startLoading(ACTION));

    try {
        const response = yield call(api.postDeskingWorkListMove, payload);
        callbackData = { ...response.data, payload };

        if (response.data.header.success) {
            yield put({
                type: act.POST_DESKING_WORK_LIST_MOVE_SUCCESS,
                payload: { ...response.data, status },
            });
        } else {
            yield put({
                type: act.POST_DESKING_WORK_LIST_MOVE_FAILURE,
                payload: { ...response.data, status },
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, { ...callbackData, status });
    }

    yield put(finishLoading(ACTION));
}

/**
 * 컴포넌트 워크의 기사목록 정렬(컴포넌트 내 정렬)
 */
const putDeskingWorkListSort = createDeskingRequestSaga(act.PUT_DESKING_WORK_LIST_SORT, api.putDeskingWorkListSort, 'work');

/**
 * 공백 기사 추가
 */
const postDeskingWork = createDeskingRequestSaga(act.POST_DESKING_WORK, api.postDeskingWork, 'work');

/**
 * Work컴포넌트 순번수정
 */
// const putDeskingWorkPriority = createDeskingRequestSaga(act.PUT_DESKING_WORK_PRIORITY, api.putDeskingWorkPriority);

/**
 * 컴포넌트워크의 편집기사 1개 수정 => 결과로 컴포넌트워크가 리턴됨
 */
const putDeskingWork = createDeskingRequestSaga(act.PUT_DESKING_WORK, api.putDeskingWork, 'work');

/**
 * work편집기사 삭제
 */
const deleteDeskingWorkList = createDeskingRequestSaga(act.DELETE_DESKING_WORK_LIST, api.deleteDeskingWorkList, 'work');

/**
 * 히스토리 조회(컴포넌트 별)
 */
const getComponentHistory = createRequestSaga(act.GET_COMPONENT_WORK_HISTORY, api.getComponentHistoryList);

/**
 * 히스토리 상세조회(컴포넌트 히스토리 seq의 데스킹 기사 조회)
 */
const getDeskingWorkHistory = createRequestSaga(act.GET_DESKING_WORK_HISTORY, api.getDeskingHistory);

/**
 * 히스토리를 편집기사 워크로 등록
 */
const putDeskingWorkHistory = createDeskingRequestSaga(act.PUT_DESKING_WORK_HISTORY, api.putDeskingWorkHistory, 'work');

/** saga */
export default function* saga() {
    // 컴포넌트 워크
    yield takeLatest(act.GET_COMPONENT_WORK_LIST, getComponentWorkList);
    yield takeLatest(act.GET_COMPONENT_WORK, getComponentWork);
    yield takeLatest(act.PUT_COMPONENT_WORK, putComponentWork);
    yield takeLatest(act.PUT_SNAPSHOT_COMPONENT_WORK, putSnapshotComponentWork);
    yield takeLatest(act.PUT_COMPONENT_WORK_TEMPLATE, putComponentWorkTemplate);

    yield takeLatest(act.POST_SAVE_COMPONENT_WORK, postSaveComponentWork);
    yield takeLatest(act.POST_PUBLISH_COMPONENT_WORK, postPublishComponentWork);
    yield takeLatest(act.POST_SAVE_PUBLISH_COMPONENT_WORK, postSavePublishComponentWork);
    yield takeLatest(act.POST_RESERVE_COMPONENT_WORK, postReserveComponentWork);
    yield takeLatest(act.DELETE_RESERVE_COMPONENT_WORK, deleteReserveComponentWork);

    // 컴포넌트 워크의 데스킹 (편집기사)
    yield takeLatest(act.PUT_DESKING_WORK, putDeskingWork);
    yield takeLatest(act.POST_DESKING_WORK_LIST, postDeskingWorkList);
    yield takeLatest(act.POST_DESKING_WORK_LIST_MOVE, postDeskingWorkListMove);
    yield takeLatest(act.PUT_DESKING_WORK_LIST_SORT, putDeskingWorkListSort);
    yield takeLatest(act.POST_DESKING_WORK, postDeskingWork);
    yield takeLatest(act.DELETE_DESKING_WORK_LIST, deleteDeskingWorkList);

    // 데스킹 드래그 관련
    yield takeEvery(act.DESKING_DRAG_STOP, deskingDragStop);

    // 히스토리
    yield takeLatest(act.GET_COMPONENT_WORK_HISTORY, getComponentHistory);
    yield takeLatest(act.GET_DESKING_WORK_HISTORY, getDeskingWorkHistory);
    yield takeLatest(act.PUT_DESKING_WORK_HISTORY, putDeskingWorkHistory);
}
