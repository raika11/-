import React, { useCallback, useState, forwardRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { MokaIcon, MokaOverlayTooltipButton } from '@components';
import Dropdown from 'react-bootstrap/Dropdown';
import toast, { messageBox } from '@utils/toastUtil';

import { CommentActionModal, BenneHistoryModal } from '@pages/CommentManage/CommentModal';
import { getCommentsBlocks, blocksUsed, clearBlocksList } from '@store/commentManage';
import { useDispatch } from 'react-redux';

const DropdownToggle = forwardRef(({ onClick, id }, ref) => {
    return (
        <div ref={ref} className="btn-sm" onClick={onClick} id={id}>
            삭제
        </div>
    );
});

export const UserInfoRenderer = ({ value }) => {
    const { memNm, memId } = value;
    return (
        <>
            {/*<Col className="d-felx pl-0" style={{ lineHeight: '25px' }}>{memId}</Col>*/}
            <Col className="d-flex pl-0" style={{ lineHeight: '1.1em' }}>
                {memNm}({memId})
            </Col>
        </>
    );
};

// 삭제 버튼
export const DeleteButtonRenderer = (props) => {
    const { cmtSeq, status, memNm, memId } = props.value;

    const [modalUsage, setModalUsage] = useState({
        gubun: '',
        status: status,
        cmtSeq: cmtSeq,
        memNm: memNm,
        memId: memId,
    });
    const [viewN] = useState(false);
    const [defaultInputModalState, setDefaultInputModalState] = useState(false);

    const handleClickBannedButton = useCallback(
        (deleteType) => {
            setModalUsage({
                ...modalUsage,
                deleteType: deleteType,
            });
            setDefaultInputModalState(true);
        },
        [modalUsage],
    );

    const handleClickRestore = () => {
        setModalUsage({
            ...modalUsage,
            deleteType: 'restore',
        });
        setDefaultInputModalState(true);
    };

    const createDropdownItem = useCallback(() => {
        const items = [
            { text: '이 댓글만 삭제', viewN: false, onClick: () => handleClickBannedButton('CMT') },
            { text: '해당 사용자의 과거 댓글 전체 삭제', viewN: false, onClick: () => handleClickBannedButton('ALL') },
            { text: '해당 사용자 ID 차단 및 해당 댓글 삭제', viewN: false, onClick: () => handleClickBannedButton('BNC') },
            { text: '해당 사용자 ID 차단 및 과거 댓글 전체 삭제', viewN: false, onClick: () => handleClickBannedButton('BNA') },
        ];

        return (
            <>
                {items
                    .filter((i) => i.viewN === viewN)
                    .map((i, idx) => (
                        <Dropdown.Item key={idx} eventKey={idx} onClick={i.onClick}>
                            {i.text}
                        </Dropdown.Item>
                    ))}
            </>
        );
    }, [handleClickBannedButton, viewN]);

    return (
        <>
            {status === 'A' ? (
                <MokaOverlayTooltipButton tooltipText="삭제" variant="outline-table-btn" className="p-0">
                    <Dropdown style={{ position: 'unset' }}>
                        <Dropdown.Toggle as={DropdownToggle} id={`dropdown-comment-edit-${cmtSeq}`} />
                        <Dropdown.Menu>{createDropdownItem()}</Dropdown.Menu>
                    </Dropdown>
                </MokaOverlayTooltipButton>
            ) : (
                <Button variant="outline-table-btn" className="mr-2" size="sm" onClick={() => handleClickRestore()}>
                    복구
                </Button>
            )}
            <CommentActionModal
                ModalUsage={modalUsage}
                show={defaultInputModalState}
                onHide={() => {
                    setDefaultInputModalState(false);
                }}
            />
        </>
    );
};

export const InfoItemRenderer = (props) => {
    const { value } = props;
    return (
        <>
            <Row>
                <Col xs={5} className="d-felx mb-0 pr-0">
                    <MokaIcon iconName="fad-thumbs-up" size="1x" /> {`${value.good}`}
                </Col>
                <Col xs={5} className="d-felx mb-0 pl-0">
                    <MokaIcon iconName="fad-thumbs-down" size="1x" /> {`${value.bad}`}
                </Col>
            </Row>
        </>
    );
};

export const DateItemRenderer = (props) => {
    const { value } = props;
    const firstTime = value && value.length > 10 ? value.substr(0, 10) : value;
    const thirdTime = value && value.length > 10 ? value.substr(10, 6) : value;
    return (
        <>
            <Col className="d-felx pl-0" style={{ lineHeight: '25px' }}>
                {firstTime}
            </Col>
            <Col className="d-felx pl-0" style={{ lineHeight: '25px' }}>
                {thirdTime}
            </Col>
        </>
    );
};

export const CommentItemRenderer = (props) => {
    const { value } = props;

    return <>{value}</>;
};

// 차단 관리에서 차단 복원 버튼 처리.
export const BanneButtonRenderer = (props) => {
    const {
        value: { usedYn, seqNo },
    } = props;
    const dispatch = useDispatch();

    const handleBlocksUsed = () => {
        dispatch(
            blocksUsed({
                seqNo: seqNo,
                usedYn: usedYn === 'Y' ? 'N' : 'Y',
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        dispatch(clearBlocksList());
                        dispatch(getCommentsBlocks());
                    } else {
                        const { totalCnt, list } = body;
                        if (totalCnt > 0 && Array.isArray(list)) {
                            // 에러 메시지 확인.
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    // 차단 버튼
    const handleClickBanneButton = () => {
        handleBlocksUsed();
    };
    const handleClickRestoreButton = () => {
        handleBlocksUsed();
    };

    // 차단 복원 버튼
    return (
        <div className="d-flex align-items-center">
            {usedYn === 'Y' ? (
                <Button variant="outline-table-btn2" className="mr-2" size="sm" onClick={() => handleClickRestoreButton()}>
                    복원
                </Button>
            ) : (
                <Button variant="outline-table-btn" className="mr-2" size="sm" onClick={() => handleClickBanneButton()}>
                    차단
                </Button>
            )}
        </div>
    );
};

// 차단 히스토리 버튼
export const HistoryButtonRenderer = ({ value }) => {
    const [historyState, setHistoryState] = useState(false);

    const handleClickHistoryModal = () => {
        setHistoryState(true);
    };

    return (
        <div>
            <MokaIcon iconName="fal-history" onClick={() => handleClickHistoryModal()} />

            <BenneHistoryModal
                Element={value}
                show={historyState}
                onHide={() => {
                    setHistoryState(false);
                }}
            />
        </div>
    );
};
