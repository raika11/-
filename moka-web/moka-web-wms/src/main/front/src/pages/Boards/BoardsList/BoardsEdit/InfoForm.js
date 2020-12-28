import React, { useEffect, useState, useRef } from 'react';
import { MokaCard, MokaInputLabel, MokaInput, MokaTableEditCancleButton } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectItem } from '@pages/Boards/BoardConst';
import { initialState, GET_SETMENU_BOARD_INFO, getBoardInfo, clearSetmenuBoardInfo, saveBoardInfo } from '@store/boards';
import toast, { messageBox } from '@utils/toastUtil';

// import SummerEditer from './SummerEditer';

const InfoForm = ({ formMode }) => {
    const tempEvent = () => {};

    return (
        <Form className="mb-gutter">
            {formMode === 'modify' && (
                <Form.Row>
                    <Col xs={6} style={{ fontSize: '1px' }}>
                        {`등록 일시  2020-10-13 11:50 홍길동(hong12)`}
                    </Col>
                    <Col xs={6} style={{ fontSize: '1px' }}>
                        {`수정 일시  2020-10-13 11:50 홍길동(hong12)`}
                    </Col>
                </Form.Row>
            )}
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0">
                    <MokaInputLabel as="select" label="순서" name="orderType" id="orderType" value={null} onChange={(e) => tempEvent(e)}>
                        {selectItem.orderType.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0">
                    <MokaInputLabel as="select" label="채널명" name="channelName" id="channelName" value={null} onChange={(e) => tempEvent(e)}>
                        {selectItem.channelName.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0">
                    <MokaInputLabel as="select" label="말머리1" name="titlePrefix1" id="titlePrefix1" value={null} onChange={(e) => tempEvent(e)}>
                        {selectItem.titlePrefix1.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
                <Col xs={6} className="p-0">
                    <MokaInputLabel as="select" label="말머리2" name="titlePrefix2" id="titlePrefix2" value={null} onChange={(e) => tempEvent(e)}>
                        {selectItem.titlePrefix2.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0">
                    <MokaInput className="mb-0" id="boardtitle" name="boardtitle" placeholder={'제목을 입력해 주세요.'} value={null} onChange={(e) => tempEvent(e)} />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0">
                    <MokaInputLabel
                        as="textarea"
                        className="mb-2"
                        inputClassName="resize-none"
                        inputProps={{ rows: 6 }}
                        name="remark"
                        value={null}
                        onChange={(e) => tempEvent(e)}
                    />
                    {/* <SummerEditer /> */}
                </Col>
            </Form.Row>
            <hr />
            <Form.Row className="mb-2">
                <Col xs={4} className="p-0">
                    <MokaInputLabel
                        label={`첨부파일`}
                        as="none"
                        className="mb-2"
                        inputClassName="resize-none"
                        inputProps={{ rows: 6 }}
                        value={null}
                        onChange={(e) => tempEvent(e)}
                    />
                </Col>
                <Col xs={8} className="p-0 text-right">
                    <Button variant="positive" onClick={() => tempEvent()}>
                        등록
                    </Button>
                </Col>
            </Form.Row>
            <hr />
            <Form.Row className="mb-0">
                <Form.Row className="w-100" style={{ backgroundColor: '#f4f7f9', height: '50px' }}>
                    <Col xs={11} className="w-100 h-100 d-flex align-items-center justify-content-start">
                        htm_2020122312390123908123.jpg
                    </Col>
                    <Col>
                        <MokaTableEditCancleButton onClick={() => tempEvent()} />
                    </Col>
                </Form.Row>
            </Form.Row>
        </Form>
    );
};

export default InfoForm;
