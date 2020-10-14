import React from 'react';
import PropTypes from 'prop-types';

import MokaTreeCategory from './MokaTreeCategory';
import MokaTreeItem from './MokaTreeItem';

const propTypes = {
    /**
     * 트리 데이터
     */
    data: PropTypes.shape({
        pageSeq: PropTypes.number.isRequired,
        pageName: PropTypes.string.isRequired,
        nodes: PropTypes.array,
    }),
    /**
     * 확장 노드 리스트
     */
    expanded: PropTypes.array,
    /**
     * 노드 클릭 콜백
     */
    onNodeSelect: PropTypes.func,
    /**
     * 노드 토글 콜백
     */
    onNodeToggle: PropTypes.func,
};
const defaultProps = {};

/**
 * 트리뷰 컴포넌트
 */
const MokaTreeView = (props) => {
    const { data, expanded, onExpanded, onNodeSelect, onNodeToggle, onInsert, onDelete, height } = props;

    /**
     * 트리아이템 생성 함수
     */
    const createTreeItem = (nodeData) => {
        const { pageSeq, nodes } = nodeData;

        if (nodes) {
            return (
                <MokaTreeCategory key={pageSeq} {...nodeData} {...props}>
                    {nodes.map(createTreeItem)}
                </MokaTreeCategory>
            );
        }
        return <MokaTreeItem key={pageSeq} {...nodeData} {...props} />;
    };

    return (
        <div className="border custom-scroll treeview" style={{ height }}>
            <ul className="list-unstyled tree-list">
                <MokaTreeCategory key={data.pageSeq} id={data.pageSeq} pageName={data.pageName}>
                    {data.nodes.map((nodes, idx) => {
                        return createTreeItem(nodes, idx);
                    })}
                </MokaTreeCategory>
            </ul>
        </div>
    );
};

MokaTreeView.propTypes = propTypes;
MokaTreeView.defaultProps = defaultProps;

export default MokaTreeView;
