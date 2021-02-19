import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { MokaIcon } from '@components';

const propTypes = {
    /**
     * 현재 노드 데이터
     */
    nodeData: PropTypes.shape({
        pageName: PropTypes.string,
        usedYn: PropTypes.oneOf(['Y', 'N']),
    }).isRequired,
    /**
     * 트리라벨에 마우스 hover할 때 나오는 버튼 리스트
     */
    labelHoverButtons: PropTypes.array,
    /**
     * 선택된 노드아이디
     */
    selected: PropTypes.string,
};
const defaultProps = {
    nodeData: {},
    labelHoverButtons: [],
};

const MokaTreeLabel = (props) => {
    const { nodeData, labelHoverButtons } = props;
    const { pageName, usedYn } = nodeData;

    return (
        <React.Fragment>
            <span>
                {usedYn === 'N' && <MokaIcon iconName="fal-file-excel" className="mr-1" />}
                {pageName}
            </span>
            <div className="d-flex align-items-center tree-buttons">
                {labelHoverButtons.map((button, idx) => (
                    <Button
                        key={idx}
                        variant={button.variant}
                        className="btn-pill mr-1"
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (button.onClick) {
                                button.onClick(nodeData, e);
                            }
                        }}
                    >
                        {button.icon || button.text}
                    </Button>
                ))}
            </div>
        </React.Fragment>
    );
};

MokaTreeLabel.propTypes = propTypes;
MokaTreeLabel.defaultProps = defaultProps;

export default MokaTreeLabel;
