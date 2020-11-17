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

    const existRow = component.deskingWorks.filter((desking) => desking.totalId === data.totalId);
    if (existRow && existRow.length > 0) return;

    const contentOrd = overIndex < 0 ? 1 : overIndex + 1;
    let appendData = null;

    if (data.gridType === 'ARTICLE') {
        appendData = {
            seq: null,
            deskingSeq: null,
            componentSeq: component.componentSeq,
            datasetSeq: component.datasetSeq,
            totalId: data.totalId,
            parentTotalId: null,
            contentType: data.contentType,
            artType: data.artType,
            contentOrd: contentOrd,
            sourceCode: data.sourceCode,
            lang: data.lang,
            title: data.artTitle,
            mobTitle: data.artTitle,
            subTitle: data.subTitle,
            nameplate: null,
            titlePrefix: null,
            bodyHead: data.bodyHead,
            linkUrl: null,
            linkTarget: null,
            moreUrl: null,
            moreTarget: null,
            thumbFileName: data.artThumb,
            rel: false,
            relSeqs: null,
        };
    }

    return appendData;
};

/**
 * 데스킹 ag-grid row drag stop
 */
const deskingDragStop = ({ payload }) => {
    const { source, target, component } = payload;

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

    // TODO 데스킹워크 추가/저장하는 액션과 연결해야함
};

/** saga */
export default function* saga() {
    yield takeLatest(act.GET_COMPONENT_WORK_LIST, getComponentWorkList);
    yield takeLatest(act.DESKING_DRAG_STOP, deskingDragStop);
}
