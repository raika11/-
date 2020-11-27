import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaInputLabel, MokaInput, MokaSearchInput, MokaTable } from '@components';
import Button from 'react-bootstrap/Button';
import clsx from 'clsx';
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
    const testValue = '테스트';

    const tempHandleChange = () => {};

    return (
        <MokaModal show={props.show} onHide={props.onHide} title="메타 등록" size="xl" footerClassName="justify-content-center" width={700} draggable>
            <Form className="mb-gutter">
                {/* 시작일/종료일 */}
                <Form.Row className="mb-2">
                    <label className="px-0 mb-0 position-relative text-right mr-3 form-label" htmlFor="none" style={{ width: '70px', minWidth: '70px' }}>
                        사용유무
                    </label>
                    <Col xs={3} className="p-0 mr-05">
                        <MokaInputLabel as="switch" name="facebook" id="facebook" className="mb-1" label="페이스북" inputProps={{ checked: 'Y' }} onChange={tempHandleChange} />
                    </Col>
                    <Col xs={3} className="p-0">
                        <MokaInputLabel as="switch" name="twitter" id="twitter" className="mb-2" label="트위터" inputProps={{ checked: 'Y' }} onChange={tempHandleChange} />
                    </Col>
                </Form.Row>

                {/* 제목 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel label="타이틀" className="mb-0" name="title" value={''} onChange={tempHandleChange} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            label="설명(리드문)"
                            className="mb-0"
                            inputClassName="resize-none"
                            name="profile"
                            id="profile"
                            value={''}
                            onChange={tempHandleChange}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            label="메시지"
                            className="mb-0"
                            inputClassName="resize-none"
                            name="profile"
                            id="profile"
                            value={''}
                            onChange={tempHandleChange}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    {/* 이미지 */}
                    <MokaInputLabel
                        as="imageFile"
                        className="mb-2"
                        name="selectImg"
                        isInvalid={null}
                        label={
                            <React.Fragment>
                                SNS 이미지
                                <br />
                                (850*350)
                                <br />
                                <Button
                                    className="mt-1"
                                    size="sm"
                                    variant="negative"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                >
                                    편집
                                </Button>
                                <Button
                                    className="mt-1"
                                    size="sm"
                                    variant="negative"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                >
                                    신규등록
                                </Button>
                            </React.Fragment>
                        }
                        ref={null}
                        inputProps={{
                            height: 120,
                            width: 420,
                            img: null,
                            selectAccept: ['image/jpeg'], // 이미지중 업로드 가능한 타입 설정.
                        }}
                        labelClassName="justify-content-end mr-3"
                    />
                </Form.Row>
                <Form.Row className="mb-2">
                    <label className="px-0 mb-0 position-relative text-right mr-3 form-label" htmlFor="none" style={{ width: '70px', minWidth: '70px' }}>
                        예약
                    </label>
                    <Col className="p-1 mr-04 col-2">
                        <Form.Check label="예약 노출" type="checkbox" name="checkbox-test" style={{ width: '80px' }} />
                    </Col>
                    <Col xs={3} className="p-0 pr-2">
                        <MokaInput
                            as="dateTimePicker"
                            className="mb-0"
                            name="viewSDate"
                            value={null}
                            onChange={tempHandleChange}
                            inputProps={{ timeFormat: null }}
                            disabled={null}
                        />
                    </Col>
                    <div className="p-0 mr-01 col-2 col">
                        <div className="d-flex align-items-center p-0 form-group">
                            <input name="title" type="text" className="flex-fill form-control" value="" />
                            <label className="px-0 mb-0 position-relative text-right mr-3 form-label" htmlFor="none" style={{ width: '8px', minWidth: '8px' }}>
                                시
                            </label>
                        </div>
                    </div>
                    <Col xs={2} className="p-0 mr-01">
                        <MokaInputLabel label="분" className="p-0" name="title" value={''} onChange={tempHandleChange} />
                    </Col>
                </Form.Row>
            </Form>

            <Form.Group className="mb-3 d-flex justify-content-between">
                <div className="d-flex">
                    <Button variant="positive" className="mr-05" onClick={tempHandleChange}>
                        FB 전송
                    </Button>
                    <Button variant="negative" className="mr-05" onClick={tempHandleChange}>
                        TW 전송
                    </Button>
                </div>
                <div className="d-flex">
                    <Button variant="positive" className="mr-05" onClick={tempHandleChange}>
                        저장
                    </Button>
                    <Button variant="negative" className="mr-05" onClick={tempHandleChange}>
                        임시저장
                    </Button>
                    <Button variant="negative" className="mr-05" onClick={tempHandleChange}>
                        토큰관리
                    </Button>
                    <Button variant="negative" className="mr-05" onClick={tempHandleChange}>
                        미리보기
                    </Button>
                </div>
            </Form.Group>
        </MokaModal>
    );
};

export default MataModal;
