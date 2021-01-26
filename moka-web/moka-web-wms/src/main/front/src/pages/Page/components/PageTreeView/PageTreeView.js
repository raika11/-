import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import TreeCategory from './TreeCategory';
import TreeItem from './TreeItem';
import { MokaLoader } from '@components';

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
    className: PropTypes.string,
};
const defaultProps = {
    expanded: [],
    hoverButtons: [],
    loading: false,
};

/**
 * 페이지관리 > 트리뷰 컴포넌트
 */
const PageTreeView = (props) => {
    const { data, height, loading, className } = props;
    const scrollbarRef = useRef(null);

    /**
     * 트리아이템 생성 함수
     */
    const createTreeItem = (nodeData) => {
        const { pageSeq, nodes } = nodeData;

        if (nodes) {
            return (
                <TreeCategory key={pageSeq} scrollbarRef={scrollbarRef} nodeId={String(pageSeq)} nodeData={nodeData} {...props}>
                    {nodes.map(createTreeItem)}
                </TreeCategory>
            );
        }
        return <TreeItem key={pageSeq} nodeId={String(pageSeq)} nodeData={nodeData} {...props} />;
    };

    return (
        <PerfectScrollbar
            className={clsx('treeview', className)}
            style={{ height }}
            ref={scrollbarRef}
            options={{ handlers: ['drag-thumb', 'keyboard', 'wheel', 'touch'], wheelSpeed: 0.5 }}
        >
            <ul className="list-unstyled tree-list">
                {loading && <MokaLoader />}
                {!loading && data && (
                    <TreeCategory
                        scrollbarRef={scrollbarRef}
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
                    </TreeCategory>
                )}
            </ul>
        </PerfectScrollbar>
    );
};

PageTreeView.propTypes = propTypes;
PageTreeView.defaultProps = defaultProps;

export default PageTreeView;
