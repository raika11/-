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
        <>
            <div>
                {value === 'Y' ? (
                    <Button variant="positive" className="mr-2" onClick={() => tempEvent()}>
                        차단
                    </Button>
                ) : (
                    <Button variant="negative" className="mr-2" onClick={() => tempEvent()}>
                        복원
                    </Button>
                )}
            </div>
        </>
    );
};

export default BanneButtonRenderer;
