import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaInputLabel, MokaInput } from '@components';
import { blockReason } from '@pages/CommentManage/CommentConst';

/**
 * ModalBody로 Input 한개 있는 Modal
 */
const CommentBlockModal = (props) => {
    const { show, onHide, inputData, onSave, ModalUsage } = props;
    const [data, setData] = useState({ title: '', value: '', isInvalid: false });

    const [tempValue, setTempValue] = useState(null);
    const tempEvent = (e) => {
        console.log(e);
    };

    /**
     * 닫기
     */
    const handleClickHide = () => {
        // setData({ title: '', value: '', isInvalid: false });
        onHide();
    };

    /**
     * input 값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        setData({
            ...data,
            value: e.target.value,
        });
    };

    /**
     * 저장 버튼 클릭 이벤트
     */
    const handleClickSave = () => {
        onSave(data, invalidCheckCallback);
    };

    const invalidCheckCallback = (isInvalid) => {
        setData({ ...data, isInvalid });
    };

    /**
     * inputData 값 변경
     */
    useEffect(() => {
        setData(inputData);
    }, [inputData]);

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleClickHide}
            title={`차단 등록`}
            size="md"
            buttons={[
                { text: '저장', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickHide },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                {/* <MokaInputLabel label={data.title} labelWidth={90} className="mb-0" value={data.value} onChange={handleChangeValue} isInvalid={data.isInvalid} /> */}
                <Form.Row className="mb-2">
                    {(function () {
                        console.log(ModalUsage);
                        if (ModalUsage.usage && ModalUsage.usage === `comment`) {
                            return (
                                <>
                                    <Col xs={3} className="p-0">
                                        <MokaInputLabel
                                            as="radio"
                                            className="mb-0 h-100"
                                            label="차단 종류"
                                            value="N"
                                            id="dataset-type1"
                                            inputProps={{ custom: true, label: 'ID', checked: false }}
                                            onChange={tempEvent}
                                            name="autoCreateYn"
                                        />
                                    </Col>
                                    <Col xs={1} className="p-0 mr-10">
                                        <MokaInput
                                            as="radio"
                                            className="mb-0 h-100 align-items-center d-flex"
                                            value="Y"
                                            id="dataset-type2"
                                            inputProps={{ custom: true, label: 'IP', checked: true }}
                                            onChange={tempEvent}
                                            name="autoCreateYn"
                                        />
                                    </Col>
                                </>
                            );
                        } else if (ModalUsage.usage && ModalUsage.usage === `id`) {
                            return (
                                <>
                                    <Col className="p-0">
                                        <MokaInputLabel label="차단 ID" className="mb-0 h-100" id="id" name="id" value={tempValue} onChange={(e) => tempEvent(e)} />
                                    </Col>
                                </>
                            );
                        } else if (ModalUsage.usage && ModalUsage.usage === `ip`) {
                            return (
                                <>
                                    <Col className="p-0">
                                        <MokaInputLabel label="차단 IP" className="mb-0 h-100" id="ip" name="ip" value={tempValue} onChange={(e) => tempEvent(e)} />
                                    </Col>
                                </>
                            );
                        } else if (ModalUsage.usage && ModalUsage.usage === `word`) {
                            return (
                                <>
                                    <Col className="p-0">
                                        <MokaInputLabel label="금지어" className="mb-0 h-100" id="word" name="word" value={tempValue} onChange={(e) => tempEvent(e)} />
                                    </Col>
                                </>
                            );
                        }
                    })()}
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel as="select" label="차단사유" name="channelId" id="channelId" value={tempValue} onChange={(e) => tempEvent(e)}>
                            <option value="">선택</option>
                            {blockReason.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            label="차단 내용"
                            className="mb-2"
                            inputClassName="resize-none"
                            inputProps={{ rows: 6 }}
                            id="content"
                            name="content"
                            value={tempValue}
                            onChange={(e) => tempEvent(e)}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </MokaModal>
    );
};

export default CommentBlockModal;
