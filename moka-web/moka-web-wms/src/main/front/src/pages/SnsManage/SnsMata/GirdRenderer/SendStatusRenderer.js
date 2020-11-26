import React from 'react';
import { faAddressBook, faDiceTwo } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatusIdle = () => <div className="justify-content-between mr-3 p-1">대기</div>;

const StatusSend = ({ FaceBook, Twitter }) => {
    console.log({ FaceBook: FaceBook, Twitter: Twitter });

    return (
        <>
            <div className="justify-content-between mr-3 p-1">
                <FontAwesomeIcon icon={faAddressBook} fixedWidth className={FaceBook === 'Y' ? 'color-positive' : 'color-gray150'} />
            </div>
            <div className="justify-content-between mr-3 p-1">
                <FontAwesomeIcon icon={faDiceTwo} fixedWidth className={Twitter === 'Y' ? 'color-positive' : 'color-gray150'} />
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
            <div className="d-flex py-2">
                <div className="d-flex py-2">{sendFlag === 'Y' ? <StatusSend FaceBook={facebook} Twitter={twitter} /> : <StatusIdle />}</div>
            </div>
        </>
    );
};

export default SendStatusRenderer;
