import React from 'react';
import PropTypes from 'prop-types';

import MokaTreeCategory from './MokaTreeCategory';
import MokaTreeItem from './MokaTreeItem';

const propTypes = {
    /**
     * height
     */
    height: PropTypes.number,
    /**
     * 트리 전체 데이터
     */
    data: PropTypes.shape({
        pageSeq: PropTypes.number.isRequired,
        pageName: PropTypes.string.isRequired,
        depth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        nodes: PropTypes.array,
    }),
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
 * 트리뷰 컴포넌트
 */
const MokaTreeView = (props) => {
    const { data, height, loading } = props;

    /**
     * 트리아이템 생성 함수
     */
    const createTreeItem = (nodeData) => {
        const { pageSeq, nodes } = nodeData;

        if (nodes) {
            return (
                <MokaTreeCategory key={pageSeq} nodeId={String(pageSeq)} nodeData={nodeData} {...props}>
                    {nodes.map(createTreeItem)}
                </MokaTreeCategory>
            );
        }
        return <MokaTreeItem key={pageSeq} nodeId={String(pageSeq)} nodeData={nodeData} {...props} />;
    };

    return (
        <div className="border custom-scroll treeview" style={{ height }}>
            <ul className="list-unstyled tree-list">
                {!loading && data && (
                    <MokaTreeCategory
                        nodeId={String(data.pageSeq)}
                        nodeData={{
                            pageName: data.pageName,
                            pageSeq: data.pageSeq,
                            depth: data.depth,
                            usedYn: data.usedYn,
                            match: data.match,
                            pageUrl: data.pageUrl,
                        }}
                        {...props}
                    >
                        {data.nodes &&
                            data.nodes.map((nodes, idx) => {
                                return createTreeItem(nodes, idx);
                            })}
                    </MokaTreeCategory>
                )}
            </ul>
        </div>
    );
};

MokaTreeView.propTypes = propTypes;
MokaTreeView.defaultProps = defaultProps;

export default MokaTreeView;
