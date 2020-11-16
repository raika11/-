import React from 'react';
import PropTypes from 'prop-types';

import DeskingTreeCategory from './DeskingTreeCategory';
import DeskingTreeItem from './DeskingTreeItem';
import { MokaLoader, MokaCard } from '@components';

const propTypes = {
    /**
     * height
     */
    height: PropTypes.number,
    /**
     * 트리 전체 데이터
     */
    data: PropTypes.arrayOf(
        PropTypes.shape({
            areaSeq: PropTypes.number.isRequired,
            areaNm: PropTypes.string.isRequired,
            areaDiv: PropTypes.string.isRequired,
            nodes: PropTypes.array,
        }),
    ),
    /**
     * 확장 노드 리스트(노드아이디의 리스트)
     */
    expanded: PropTypes.arrayOf(PropTypes.string),
    /**
     * 노드 확장/축소 콜백
     * @param {object} nodeData
     * @param {bool} 확장 상태 (true: 확장, false: 축소)
     */
    onExpansion: PropTypes.func,
    /**
     * 선택된 노드아이디
     */
    selected: PropTypes.string,
    /**
     * 노드 클릭 콜백
     * @param {object} nodeData
     */
    onSelected: PropTypes.func,
    /**
     * 로딩중 여부
     */
    loading: PropTypes.bool,
};
const defaultProps = {
    expanded: [],
    hoverButtons: [],
    loading: false,
};

/**
 * 데스킹 트리 조회 컴포넌트
 */
const DeskingTreeView = (props) => {
    const { data, height, loading } = props;

    /**
     * 트리아이템 생성 함수
     */
    const createTreeItem = (nodeData) => {
        const { areaSeq, nodes } = nodeData;

        if (nodes) {
            return (
                <DeskingTreeCategory key={areaSeq} nodeId={String(areaSeq)} nodeData={nodeData} {...props}>
                    {nodes.map(createTreeItem)}
                </DeskingTreeCategory>
            );
        }
        return <DeskingTreeItem key={areaSeq} nodeId={String(areaSeq)} nodeData={nodeData} {...props} />;
    };

    return (
        <MokaCard className="mr-gutter treeview" bodyClassName="p-1" width={200} header={false}>
            <ul className="list-unstyled tree-list">
                {loading && <MokaLoader />}
                {!loading &&
                    data &&
                    data.map((nodes, idx) => {
                        return createTreeItem(nodes, idx);
                    })}
            </ul>
        </MokaCard>
    );
};

DeskingTreeView.propTypes = propTypes;
DeskingTreeView.defaultProps = defaultProps;

export default DeskingTreeView;
