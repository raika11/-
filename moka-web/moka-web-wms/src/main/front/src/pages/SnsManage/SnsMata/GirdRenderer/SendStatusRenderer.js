import React from 'react';
import { MokaIcon } from '@components';

const StatusIdle = () => <div className="justify-content-between mr-3 p-1">대기</div>;

const StatusSend = ({ FaceBook, Twitter }) => {
    return (
        <>
            <div className="justify-content-between mr-3 p-1">
                <MokaIcon iconName="fab-facebook" size="lg" width={20} height={20} className={FaceBook === 'Y' ? 'color-positive' : 'color-gray150'} />
            </div>
            <div className="justify-content-between mr-3 p-1">
                <MokaIcon iconName="fab-twitter" size="lg" width={20} height={20} className={Twitter === 'Y' ? 'color-positive' : 'color-gray150'} />
            </div>
        </>
    );
};

const SendStatusRenderer = ({ value: { sendFlag, facebook, twitter } }) => {
    // sendFlag Y : 보낸기사, N: 보내지 않은 기사.
    // facebook Y: 페이스북 보낸기사. N : 보내지 않은 기사.
    // twitter Y: 트위터 보낸기사. N : 보내지 않은 기사.

    return (
        <>
            <div className="d-flex py-1">
                <div className="d-flex py-2">{sendFlag === 'Y' ? <StatusSend FaceBook={facebook} Twitter={twitter} /> : <StatusIdle />}</div>
            </div>
        </>
    );
};

export default SendStatusRenderer;
