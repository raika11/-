import { takeEvery, takeLatest, put } from 'redux-saga/effects';
import produce from 'immer';
import { DEFAULT_LINK_TARGET, DEFAULT_MORE_TARGET } from '~/constants';
import { makeTitleEx, getAgGridNodeBeingDraggedOver } from '~/utils/agGridUtil';
import * as gridStore from './gridStore';
import * as deskingStore from './deskingStore';

/**
 * 단일 Row 추가
 * @param {object} data 편집기사 데이타(RowNode)
 * @param {number} overIndex 등록을 위해 over한 index(zero base)
 * @param {number} component 등록될 work컴포넌트
 */
function addOneRecordToGrid(data, overIndex, component) {
    if (!data || data.contentsId == null) {
        return null;
    }

    const alreadyRow = component.deskingWorks.filter((d) => d.contentsId === data.contentsId);
    if (alreadyRow && alreadyRow.length > 0) {
        return null;
    }

    // 오버된 편집기사의 아래로 추가. (contentsOrder는 1로 시작, overIndex는 0으로 시작함)
    const contentsOrder = overIndex < 0 ? 1 : overIndex + 2;

    let appendDesking = null;
    if (data.gridType === 'DESKING') {
        // 편집 컴포넌트영역 -> 편집컴포넌트 이동
        appendDesking = {
            ...data,
            componentWorkSeq: component.seq,
            componentSeq: component.componentSeq,
            datasetSeq: component.datasetSeq,
            editionSeq: component.editionSeq,
            contentsOrder
        };
    } else if (data.gridType === 'ARTICLE') {
        // 컨텐츠영역 -> 편집컴포넌트로 이동 : 데이타 맞추는것 필요.
        appendDesking = {
            gridType: 'DESKING',
            componentWorkSeq: component.seq,
            componentSeq: component.componentSeq,
            seq: null,
            deskingSeq: null,
            creator: null,
            datasetSeq: component.datasetSeq,
            editionSeq: component.editionSeq,
            contentsId: data.contentsId,
            contentsAttr: 'A',
            lang: data.lang,
            distYmdt: data.distYmdt,
            contentsOrder,
            title: data.title,
            mobileTitle: data.title,
            subtitle: data.subtitle,
            nameplate: null,
            titlePrefix: null,
            bodyHead: data.text,
            linkUrl: null,
            linkTarget: DEFAULT_LINK_TARGET,
            moreUrl: null,
            moreTarget: DEFAULT_MORE_TARGET,
            thumbnailFileName: data.thumbnailFileName,
            thumbnailSize: null,
            thumbnailWidth: null,
            thumbnailHeight: null,
            pvCount: 0,
            uvCount: 0,
            contentsOrderEx: '',
            titleEx: makeTitleEx(data.title, data.distYmdt, 0, 0, 0)
        };
    }

    return appendDesking;
}

function* dragStopSaga(action) {
    const { srcGrid, tgtGrid, srcComponent, tgtComponent, nodes } = action.payload;
    let overIndex = -1;
    if (srcGrid.event) {
        overIndex = getAgGridNodeBeingDraggedOver(srcGrid.event, tgtGrid);
    }
    // let deleteNodes = [];
    let appendNodes = [];
    let result = null;
    if (srcGrid.nodes) {
        // 복수 기사 이동
        for (let i = 0; i < srcGrid.nodes.length; i++) {
            const node = srcGrid.nodes[i];
            result = addOneRecordToGrid(node.data, overIndex, tgtComponent);
            if (result) {
                overIndex++;
                // deleteNodes.push(node.data);
                appendNodes.push(result);
            }
        }
    } else if (srcGrid.node) {
        // 단일 기사 이동
        result = addOneRecordToGrid(srcGrid.node.data, overIndex, tgtComponent);
        if (result) {
            // deleteNodes.push(srcGrid.node.data);
            appendNodes.push(result);
        }
    } else if (nodes) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            result = addOneRecordToGrid(node, overIndex, tgtComponent);
            if (result) {
                overIndex++;
                // deleteNodes.push(node);
                appendNodes.push(result);
            }
        }
    }

    // 컴포넌트간의 이동여부 : 기사목록에서 편집컴포넌트로 드래그드롭됐을때, 기사목록의 체크박스 제거
    const bMoveComponents = srcComponent && srcComponent.seq >= 0;

    if (appendNodes.length > 0) {
        if (bMoveComponents) {
            // 이동
            const option = {
                componentWorkSeq: tgtComponent.seq,
                datasetSeq: tgtComponent.datasetSeq,
                srcComponentWorkSeq: srcComponent.seq,
                srcDatasetSeq: srcComponent.datasetSeq,
                list: appendNodes
            };
            yield put({
                type: deskingStore.MOVE_DESKING_WORK_LIST,
                payload: option
            });
        } else {
            // 추가
            const option = {
                componentWorkSeq: tgtComponent.seq,
                datasetSeq: tgtComponent.datasetSeq,
                list: appendNodes
            };
            yield put({
                type: deskingStore.POST_DESKING_WORK_LIST,
                payload: option
            });
            srcGrid.api.deselectAll();
        }
    }

    // 추가
    // if (appendNodes.length > 0) {
    //     const option = {
    //         componentWorkSeq: tgtComponent.seq,
    //         datasetSeq: tgtComponent.datasetSeq,
    //         list: appendNodes
    //     };
    //     yield put({
    //         type: deskingStore.POST_DESKING_WORK_LIST,
    //         payload: option
    //     });
    // }

    // // 삭제
    // if (deleteNodes.length > 0 && srcComponent) {
    //     const option = {
    //         componentWorkSeq: srcComponent.seq,
    //         datasetSeq: srcComponent.datasetSeq,
    //         list: deleteNodes,
    //         noMessage: true
    //     };
    //     yield put({
    //         type: deskingStore.DELETE_DESKING_WORK,
    //         payload: option
    //     });
    // }
}

function* sortGridSaga(action) {
    const { grid, component } = action.payload;

    if (!grid.api) {
        console.warn('AgGrid GridOptions Not Existing');
        return;
    }

    const list = [];
    grid.api.forEachNode((rowNode, index) => {
        const node = {
            ...rowNode.data,
            contentsOrder: index + 1,
            contentsOrderEx: `00${index + 1}`.substr(-2)
        };
        list.push(node);
    });
    grid.api.setRowData(list);

    const newComponentWorkVO = produce(component, (draft) => {
        draft.deskingWorks = list;
    });

    yield put({
        type: deskingStore.PUT_DESKING_WORK_PRIORITY,
        payload: { component: newComponentWorkVO }
    });
}

// saga watcher
function* gridSaga() {
    yield takeEvery(gridStore.DRAG_STOP_GRID, dragStopSaga);
    yield takeLatest(gridStore.SORT_GRID, sortGridSaga);
}

export default gridSaga;
