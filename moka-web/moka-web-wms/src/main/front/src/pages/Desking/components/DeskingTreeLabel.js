import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    /**
     * 현재 노드 데이터
     */
    nodeData: PropTypes.shape({
        areaNm: PropTypes.string,
    }).isRequired,
    /**
     * 트리라벨에 마우스 hover할 때 나오는 버튼 리스트
     */
    labelHoverButtons: PropTypes.array,
};
const defaultProps = {
    nodeData: {},
};

/**
 * Desking Tree 라벨 컴포넌트
 */
const DeskingTreeLabel = (props) => {
    const { nodeData } = props;
    const { areaNm } = nodeData;

    return <span>{areaNm}</span>;
};

DeskingTreeLabel.propTypes = propTypes;
DeskingTreeLabel.defaultProps = defaultProps;

export default DeskingTreeLabel;
