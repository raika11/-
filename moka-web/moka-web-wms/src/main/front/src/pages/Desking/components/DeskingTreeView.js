import React from 'react';
import PropTypes from 'prop-types';

import DeskingTreeCategory from './DeskingTreeCategory';
import DeskingTreeItem from './DeskingTreeItem';
import { MokaLoader } from '@components';

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
     * 트리라벨에 마우스 hover할 때 나오는 버튼 리스트
     */
    labelHoverButtons: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string,
            icon: PropTypes.node,
            onClick: PropTypes.func,
        }),
    ),
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
 * Desking Tree View 컴포넌트
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
        <div className="border custom-scroll treeview mr-2" style={{ height, width: '200px', backgroundColor: 'white' }}>
            <ul className="list-unstyled tree-list">
                {loading && <MokaLoader />}
                {!loading &&
                    data &&
                    data.map((nodes, idx) => {
                        return createTreeItem(nodes, idx);
                    })}
            </ul>
        </div>
    );
};

DeskingTreeView.propTypes = propTypes;
DeskingTreeView.defaultProps = defaultProps;

export default DeskingTreeView;
