import { takeLatest } from 'redux-saga/effects';
import { createRequestSaga } from '@store/commons/saga';
import { getRowIndex } from '@utils/agGridUtil';

import * as api from './deskingApi';
import * as act from './deskingAction';

/**
 * 편집영역 클릭시, Work 컴포넌트 목록 조회
 */
const getComponentWorkList = createRequestSaga(act.GET_COMPONENT_WORK_LIST, api.getComponentWorkList);

/**
 * rowNode 생성
 */
const makeRowNode = (data, overIndex, component) => {
    if (!data || data.totalId === null) return;

    // const existRow = component.deskingWorks.filter((desking) => desking.totalId === data.totalId);
    // if (existRow && existRow.length > 0) return;

    // const contentsOrder = overIndex < 0 ? 1 : overIndex + 1;
    let appendData = null;

    if (data.gridType === 'ARTICLE') {
        appendData = {
            datasetSeq: component.datasetSeq,
            totalId: data.totalId,
            parentTotalId: null,
            contentType: data.artType,
            contentOrd: data.contentOrd,
            lang: data.lang,
            title: data.artTitle,
            mobTitle: data.artTitle,
            subTitle: '',
            nameplate: null,
            titlePrefix: null,
            bodyHead: data.bodyHead,
            linkUrl: null,
            linkTarget: null,
            moreUrl: null,
            moreTarget: null,
            thumbFileName: data.thumbFileName,
            thumbSize: 0,
            thumbWidth: 0,
            thumbHeight: 0,
            rel: false,
            relSeqs: null,
            componentSeq: component.componentSeq,
        };
    }

    return appendData;
};

/**
 * 데스킹 ag-grid row drag stop
 */
const deskingDragStop = ({ payload }) => {
    const { api, target, component } = payload;

    let overIndex = -1;
    if (target.overIndex) {
        overIndex = target.overIndex;
    } else if (target.event) {
        overIndex = getRowIndex(target.event);
    }

    let appendNodes = [],
        rowNodeData = null;

    if (target.nodes) {
        // 기사 여러개
        target.nodes.forEach((node) => {
            rowNodeData = makeRowNode(node.data, overIndex, component);
            if (rowNodeData) {
                overIndex++;
                appendNodes.push(rowNodeData);
            }
        });
    } else if (target.node) {
        // 기사 1건
        rowNodeData = makeRowNode(target.node.data, overIndex, component);
        if (rowNodeData) {
            appendNodes.push(rowNodeData);
        }
    }
};

/** saga */
export default function* saga() {
    yield takeLatest(act.GET_COMPONENT_WORK_LIST, getComponentWorkList);
    yield takeLatest(act.DESKING_DRAG_STOP, deskingDragStop);
}
