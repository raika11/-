import React, { useCallback, useEffect, useState, forwardRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { MokaIcon, MokaOverlayTooltipButton } from '@components';
import Dropdown from 'react-bootstrap/Dropdown';
import toast, { messageBox } from '@utils/toastUtil';

import { CommentActionModal, BenneHistoryModal } from '@pages/CommentManage/CommentModal';
import { getCommentsBlocks, blocksUsed } from '@store/commentManage';
import { useDispatch } from 'react-redux';

const DropdownToggle = forwardRef(({ onClick, id }, ref) => {
    return (
        <div ref={ref} className="px-2" onClick={onClick} id={id}>
            삭제
        </div>
    );
});

export const UserInfoRenderer = ({ value }) => {
    const { memNm, memId } = value;
    return (
        <>
            <Col className="d-felx pl-0" style={{ lineHeight: '25px' }}>
                {memId}
            </Col>
            <Col className="d-felx pl-0" style={{ lineHeight: '25px' }}>
                {memNm}
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
        (gubun) => {
            setModalUsage({
                ...modalUsage,
                gubun: gubun,
            });
            setDefaultInputModalState(true);
        },
        [modalUsage],
    );

    const handleClickRestore = () => {
        setModalUsage({
            ...modalUsage,
            gubun: 'type_restore',
        });
        setDefaultInputModalState(true);
    };

    const createDropdownItem = useCallback(() => {
        const items = [
            { text: '이 댓글만 삭제', viewN: false, onClick: () => handleClickBannedButton('type_one') },
            { text: '해당 사용자의 과거 댓글 전체 삭제', viewN: false, onClick: () => handleClickBannedButton('type_two') },
            { text: '해당 사용자 ID 차단 및 과거 댓글 전체 삭제', viewN: false, onClick: () => handleClickBannedButton('type_three') },
            { text: '해당 사용자 ID 차단 및 과거 댓글 전체 삭제', viewN: false, onClick: () => handleClickBannedButton('type_four') },
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
                <MokaOverlayTooltipButton tooltipText="삭제" variant="white" className="p-0">
                    <Dropdown style={{ position: 'unset' }}>
                        <Dropdown.Toggle as={DropdownToggle} id="dropdown-desking-edit" />
                        <Dropdown.Menu>{createDropdownItem()}</Dropdown.Menu>
                    </Dropdown>
                </MokaOverlayTooltipButton>
            ) : (
                <MokaOverlayTooltipButton tooltipText="복구" variant="white" className="p-0" onClick={() => handleClickRestore()}>
                    {` 복구 `}
                </MokaOverlayTooltipButton>
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
    const thirdTime = value && value.length > 10 ? value.substr(10, 9) : value;
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
        value: { usedYn, seqNo, tagType, tagValue, tagDiv, tagDesc },
    } = props;
    const dispatch = useDispatch();

    // 차단 버튼
    const handleClickBanneButton = () => {
        // console.log(usedYn, seqNo, tagType, tagValue, tagDiv, tagDesc);
    };
    const handleClickRestoreButton = () => {
        var formData = new FormData();

        if (usedYn === 'Y') {
            formData.append('usedYn', 'N');
        } else {
            formData.append('usedYn', 'Y');
        }

        dispatch(
            blocksUsed({
                seqNo: seqNo,
                usedForm: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
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
