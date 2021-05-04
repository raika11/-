import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const defaultProps = {};

/**
 * 채널타입 0 폼
 */
const ChannelType0Form = () => {
    return (
        <React.Fragment>
            <p className="mb-2">중앙일보의 메인 홈을 제외한 전체 서비스 페이지를 대상으로 합니다.</p>
            <div className="flex-fill input-border px-12 py-2 mb-12">
                <ListGroup defaultActiveKey="#link1">
                    <ListGroup.Item href="#link1">중앙일보 전체 페이지(메인 제외)</ListGroup.Item>
                </ListGroup>
            </div>
        </React.Fragment>
    );
};

ChannelType0Form.defaultProps = defaultProps;

export default ChannelType0Form;
