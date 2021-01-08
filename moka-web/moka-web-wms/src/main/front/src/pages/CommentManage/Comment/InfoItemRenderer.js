import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { MokaIcon } from '@components';

// 정보
const InfoItemRenderer = (props) => {
    const { value } = props;
    useEffect(() => {
        // console.log(value);
        // console.log(props.node.gridApi.gridOptionsWrapper.gridOptions.getRowHeight('asdasd'));
        // console.log(props.node.gridApi.gridOptionsWrapper.gridOptions);
    }, [props, value]);

    useEffect(() => {
        // console.log(props.node.gridApi.gridOptionsWrapper.gridOptions.getRowHeight('asdasd'));
        // console.log(props.node.gridApi.gridOptionsWrapper.gridOptions);
        // console.log(1);
    });

    // thumbs-up
    // thumbs-down
    return (
        <>
            <Row>
                <Col xs={5} className="d-felx mb-0 pr-0">
                    <MokaIcon iconName="fad-thumbs-up" size="1x" /> {`${value.good}`}
                </Col>
                <Col xs={5} className="d-felx mb-0 pl-0">
                    <MokaIcon iconName="fad-thumbs-down" size="1x" /> {`${value.bad}`}
                </Col>
            </Row>
        </>
    );
};

export default InfoItemRenderer;
