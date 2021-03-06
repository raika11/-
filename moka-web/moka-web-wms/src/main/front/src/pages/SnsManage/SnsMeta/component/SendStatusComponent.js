import React from 'react';
import { Button } from 'react-bootstrap';
import { MokaIcon } from '@components';

const StatusIdle = () => (
    <div className="d-flex text-center">
        <Button variant="outline-table-btn" size="sm">
            등록/전송
        </Button>
    </div>
);

const StatusSend = ({ faceBook, twitter }) => {
    return (
        <div className="d-flex align-items-center h-100 pl-2">
            <MokaIcon
                iconName="fab-facebook-square"
                style={{
                    color: faceBook ? '3B5998' : 'ADB1BE',
                    fontSize: '20px',
                }}
                className="mr-1"
            />
            <MokaIcon
                iconName="fab-twitter-square"
                style={{
                    color: twitter ? '00ACEE' : 'ADB1BE',
                    fontSize: '20px',
                }}
            />
        </div>
    );
};

const SendStatusComponent = (params) => {
    const {
        sendStatus: { button: sendFlag, facebook, twitter },
    } = params.node.data;

    // sendFlag Y : 보낸기사, N: 보내지 않은 기사.
    // facebook Y: 페이스북 보낸기사. N : 보내지 않은 기사.
    // twitter Y: 트위터 보낸기사. N : 보내지 않은 기사.

    return !sendFlag ? (
        <StatusSend faceBook={facebook} twitter={twitter} />
    ) : (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <div className="d-flex">
                <StatusIdle />
            </div>
        </div>
    );
};

export default SendStatusComponent;
