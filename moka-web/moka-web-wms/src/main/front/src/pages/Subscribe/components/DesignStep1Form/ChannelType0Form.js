import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import DesignCommonForm from './DesignCommonForm';

const defaultProps = {
    scb: {},
};

/**
 * 채널타입 0 폼
 */
const ChannelType0Form = ({ scb, onChangeValue }) => {
    return (
        <React.Fragment>
            <p className="mb-2">중앙일보의 메인 홈을 제외한 전체 서비스 페이지를 대상으로 합니다.</p>
            <div className="flex-fill border p-2 mb-card">
                <ListGroup defaultActiveKey="#link1">
                    <ListGroup.Item href="#link1">중앙일보 전체 페이지(메인 제외)</ListGroup.Item>
                </ListGroup>
            </div>
            <DesignCommonForm scb={scb} onChangeValue={onChangeValue} />
        </React.Fragment>
    );
};

ChannelType0Form.defaultProps = defaultProps;

export default ChannelType0Form;
