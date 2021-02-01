import React, { useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import { MokaInputLabel, MokaInput } from '@components';
import { MokaTableEditCancleButton } from '@components';

const ItemRenderer = ({ dataIndex, item: { seqNo, title, linkUrl }, onDelete }) => {
    const handleChangeBulkinputBox = () => {};
    const handleClickDelete = () => {
        if (onDelete instanceof Function) {
            onDelete(seqNo);
        }
    };
    const handleChangeValue = () => {};

    return (
        <>
            <Row>
                <Col className="align-self-center justify-content-start mb-0 pr-0 pl-3 w-100">{dataIndex + 1}</Col>
                <Col className="d-felx" xs={10}>
                    <Row className="d-felx">
                        <MokaInputLabel
                            name="title"
                            id={`title-${dataIndex}`}
                            label="타이틀"
                            onChange={(e) => handleChangeBulkinputBox(e)}
                            labelWidth={30}
                            value={title}
                            className="col mb-0 pl-0 pr-0"
                        />
                    </Row>
                    <Row className="d-felx">
                        {/* <Col className="d-felx" xs={10}> */}
                        <MokaInputLabel
                            name="linkUrl"
                            id={`linkUrl-${dataIndex}`}
                            label="url"
                            onChange={(e) => handleChangeBulkinputBox(e)}
                            labelWidth={30}
                            value={linkUrl}
                            className="col mb-0 pl-0 pr-0"
                        />
                        {/* </Col> */}
                        <Col className="d-felx mb-0 pl-1 pr-0" xs={3}>
                            <MokaInput as="select" name="targetType" value={'title'} onChange={(e) => handleChangeValue(e)}>
                                <option value="one">본창</option>
                                <option value="two">새창</option>
                            </MokaInput>
                        </Col>
                    </Row>
                </Col>
                <Col className="d-felx align-self-center text-left mb-0 pl-0">
                    <MokaTableEditCancleButton onClick={handleClickDelete} />
                </Col>
            </Row>
        </>
    );
};

export default ItemRenderer;
