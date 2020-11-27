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
     * 라벨 클릭 이벤트
     */
    onClick: PropTypes.func,
    /**
     * 트리라벨에 마우스 hover할 때 나오는 버튼 리스트
     */
    labelHoverButtons: PropTypes.array,
};
const defaultProps = {
    nodeData: {},
};

/**
 * 데스킹 트리 라벨 컴포넌트
 */
const DeskingTreeLabel = (props) => {
    const { nodeData, onClick } = props;
    const { areaNm } = nodeData;

    return (
        <span className="ft-12 font-weight-bold" onClick={onClick}>
            {areaNm}
        </span>
    );
};

DeskingTreeLabel.propTypes = propTypes;
DeskingTreeLabel.defaultProps = defaultProps;

export default DeskingTreeLabel;
