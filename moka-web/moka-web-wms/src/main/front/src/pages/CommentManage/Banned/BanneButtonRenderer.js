import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';

// 등록자 정보
const BanneButtonRenderer = (props) => {
    const { value } = props;

    const tempEvent = () => {};
    useEffect(() => {
        // console.log(props.node.gridApi.gridOptionsWrapper.gridOptions.getRowHeight('asdasd'));
        // console.log(props.node.gridApi.gridOptionsWrapper.gridOptions);
    }, [props]);

    useEffect(() => {
        // console.log(props.node.gridApi.gridOptionsWrapper.gridOptions.getRowHeight('asdasd'));
        // console.log(props.node.gridApi.gridOptionsWrapper.gridOptions);
        // console.log(value);
    });
    return (
        <div className="d-flex align-items-center">
            {value === 'Y' ? (
                <Button variant="outline-table-btn2" className="mr-2" size="sm" onClick={() => tempEvent()}>
                    차단
                </Button>
            ) : (
                <Button variant="outline-table-btn" className="mr-2" size="sm" onClick={() => tempEvent()}>
                    복원
                </Button>
            )}
        </div>
    );
};

export default BanneButtonRenderer;
