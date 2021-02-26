import React from 'react';
import { Button } from 'react-bootstrap';
import { MokaIcon } from '@components';
import { useHistory } from 'react-router-dom';

const StatusIdle = () => (
    <div className="d-flex text-center">
        <Button variant="outline-table-btn" size="sm">
            등록/전송
        </Button>
    </div>
);

const StatusSend = ({ faceBook, twitter }) => {
    return (
        <>
            <div className="p-1">
                <MokaIcon
                    iconName="fab-facebook-square"
                    style={{
                        color: faceBook ? '3B5998' : 'ADB1BE',
                        fontSize: '20px',
                    }}
                />
            </div>
            <div className="p-1">
                <MokaIcon
                    iconName="fab-twitter-square"
                    style={{
                        color: twitter ? '00ACEE' : 'ADB1BE',
                        fontSize: '20px',
                    }}
                />
            </div>
        </>
    );
};

const SendStatusComponent = (params) => {
    const {
        sendStatus: { button: sendFlag, facebook, twitter },
    } = params.node.data;

    // sendFlag Y : 보낸기사, N: 보내지 않은 기사.
    // facebook Y: 페이스북 보낸기사. N : 보내지 않은 기사.
    // twitter Y: 트위터 보낸기사. N : 보내지 않은 기사.

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <div className="d-flex">{!sendFlag ? <StatusSend faceBook={facebook} twitter={twitter} /> : <StatusIdle />}</div>
        </div>
    );
};

export default SendStatusComponent;
