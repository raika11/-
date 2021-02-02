import React, { useImperativeHandle, forwardRef, useState } from 'react';
import Button from 'react-bootstrap/Button';

const RcvArticleRegisterBtn = forwardRef(({ node, data }, ref) => {
    const [serviceDaytime, setServiceDaytime] = useState(node.data.serviceDaytime);
    const [iudYn, setIudYn] = useState(node.data.iudYn);

    useImperativeHandle(ref, () => ({
        refresh: ({ data }) => {
            setServiceDaytime(data.serviceDaytime);
            setIudYn(data.iudYn);
            return false;
        },
    }));

    return !serviceDaytime && iudYn === 'N' ? (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <Button variant="outline-table-btn" size="sm" onClick={() => data.handleRegister(node.data)}>
                등록
            </Button>
        </div>
    ) : null;
});

export default RcvArticleRegisterBtn;
