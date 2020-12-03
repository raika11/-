import React from 'react';
import PropTypes from 'prop-types';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaInputLabel } from '@components';
import Button from 'react-bootstrap/Button';
const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * 등록 버튼 클릭
     * @param {object} template 선택한 데이터셋데이터
     */
    onClickSave: PropTypes.func,
    /**
     * 취소 버튼 클릭
     */
    onClickCancle: PropTypes.func,
    /**
     * 선택된 데이터셋아이디
     */
    selected: PropTypes.number,

    onClick: PropTypes.func,
};
const defaultProps = {};

/**
 * 데이터셋 리스트 공통 모달
 */
const MataModal = (props) => {
    const tempHandleChange = () => {};

    return (
        <MokaModal show={props.show} onHide={props.onHide} title="페이스북 관리용 토큰 등록" size="xl" footerClassName="justify-content-center" width={700} draggable>
            <Form className="mb-gutter">
                {/* 제목 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel label="토큰" className="mb-0" name="title" value={''} onChange={tempHandleChange} />
                    </Col>
                </Form.Row>
            </Form>
            <div className="d-flex justify-content-center" style={{ marginTop: 30 }}>
                <div className="d-flex justify-content-center">
                    <Button variant="positive" className="mr-05">
                        저장
                    </Button>
                    <Button variant="negative" className="mr-05">
                        취소
                    </Button>
                </div>
            </div>
        </MokaModal>
    );
};

MataModal.propTypes = propTypes;
MataModal.defaultProps = defaultProps;

export default MataModal;
