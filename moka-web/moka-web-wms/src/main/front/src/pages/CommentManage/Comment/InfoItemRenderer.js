import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';

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
    return (
        <>
            <div>
                G{`${value.good}`} B{`${value.bad}`}
            </div>
        </>
    );
};

export default InfoItemRenderer;
