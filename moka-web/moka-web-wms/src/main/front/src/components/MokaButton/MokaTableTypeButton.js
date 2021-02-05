import React from 'react';
import PropTypes from 'prop-types';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { MokaIcon } from '@components';

const propTypes = {
    /**
     * 기본 active key
     */
    defaultActiveKey: PropTypes.string,
    /**
     * 버튼 그룹의 버튼 클릭 콜백
     */
    onSelect: PropTypes.func,
};
const defaultProps = {
    defaultActiveKey: 'list',
};

/**
 * 일반테이블 / 썸네일테이블 2가지 중 선택할 수 있는 버튼그룹 컴포넌트
 */
const MokaTableTypeButton = (props) => {
    const { defaultActiveKey, onSelect } = props;

    return (
        <Nav as={ButtonGroup} size="sm" className="mr-auto" defaultActiveKey={defaultActiveKey} onSelect={onSelect}>
            <Nav.Link eventKey="list" as={Button} variant="gray-150">
                <MokaIcon iconName="fas-th-list" />
            </Nav.Link>
            <Nav.Link eventKey="thumbnail" as={Button} variant="gray-150">
                <MokaIcon iconName="fas-th-large" />
            </Nav.Link>
        </Nav>
    );
};

MokaTableTypeButton.propTypes = propTypes;
MokaTableTypeButton.defaultProps = defaultProps;

export default MokaTableTypeButton;
