import React from 'react';
import { MokaIcon } from '@components';

const StatusIdle = () => <div className="justify-content-between mr-3 p-1 pl-2">대기</div>;

const StatusSend = ({ faceBook, twitter }) => {
    return (
        <>
            <div className="d-flex justify-content-between p-1">
                <MokaIcon iconName="fab-facebook-square" size="2x" style={faceBook === 'Y' ? { color: '3B5998' } : { color: 'ADB1BE' }} />
            </div>
            <div className="d-flex justify-content-between p-1">
                <MokaIcon iconName="fab-twitter-square" size="2x" style={twitter === 'Y' ? { color: '00ACEE' } : { color: 'ADB1BE' }} />
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
            <div className="d-flex py-1 justify-content-center">
                <div className="d-flex py-2">{sendFlag === 'Y' ? <StatusSend faceBook={facebook} twitter={twitter} /> : <StatusIdle />}</div>
            </div>
        </>
    );
};

export default SendStatusRenderer;
