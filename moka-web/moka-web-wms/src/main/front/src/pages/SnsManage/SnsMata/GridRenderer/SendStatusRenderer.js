import React from 'react';
import { MokaIcon } from '@components';
import { Button } from 'react-bootstrap';

const StatusIdle = () => (
    <div className="d-flex text-center">
        <Button variant="outline-table-btn" className="mr-0">
            등록/전송
        </Button>
    </div>
);

const StatusSend = ({ faceBook, twitter }) => {
    return (
        <>
            <div className="d-flex justify-content-between p-1">
                <MokaIcon iconName="fab-facebook-square" size="2x" style={faceBook ? { color: '3B5998' } : { color: 'ADB1BE' }} />
            </div>
            <div className="d-flex justify-content-between p-1">
                <MokaIcon iconName="fab-twitter-square" size="2x" style={twitter ? { color: '00ACEE' } : { color: 'ADB1BE' }} />
            </div>
        </>
    );
};

const SendStatusRenderer = ({ sendFlag, facebook, twitter }) => {
    // sendFlag Y : 보낸기사, N: 보내지 않은 기사.
    // facebook Y: 페이스북 보낸기사. N : 보내지 않은 기사.
    // twitter Y: 트위터 보낸기사. N : 보내지 않은 기사.

    return (
        <>
            <div className="d-flex py-3 justify-content-center">
                <div className="d-flex">{!sendFlag ? <StatusSend faceBook={facebook} twitter={twitter} /> : <StatusIdle />}</div>
            </div>
        </>
    );
};

export default SendStatusRenderer;
