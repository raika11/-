import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel, MokaLoader, MokaOverlayTooltipButton, MokaIcon } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { DESK_STATUS_WORK, DESK_STATUS_SAVE, DESK_STATUS_PUBLISH } from '@/constants';
import { saveIssueDesking, publishIssueDesking } from '@store/issue';
import StatusBadge from './StatusBadge';
import ReserveWork from './ReserveWork';

const defaultProps = {
    desking: {},
};

/**
 * 패키지관리 > 관련 데이터 편집 > 기사 (자동)
 */
const CollapseArticleAuto = forwardRef(({ compNo, pkgSeq, desking, MESSAGE, preview }, ref) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(DESK_STATUS_SAVE);
    const controls = 'collapse-art-auto';

    /**
     * 임시저장
     */
    const saveDesking = () => {
        const viewYn = open ? 'Y' : 'N';
        setLoading(true);
        dispatch(
            saveIssueDesking({
                compNo,
                pkgSeq,
                issueDesking: {
                    compNo,
                    pkgSeq,
                    viewYn,
                    issueDeskings: [],
                },
                callback: ({ header }) => {
                    if (header.success) {
                        setStatus(DESK_STATUS_SAVE);
                        toast.success(header.message);
                    } else {
                        messageBox.alert(header.message);
                    }
                    setLoading(false);
                },
            }),
        );
    };

    /**
     * 전송
     */
    const publishDesking = () => {
        if (!desking.lastSaveDt) {
            messageBox.alert(MESSAGE.FAIL_PUBLISH_NO_SAVE);
        } else {
            messageBox.confirm(
                '전송하시겠습니까?',
                () => {
                    setLoading(true);
                    dispatch(
                        publishIssueDesking({
                            compNo,
                            pkgSeq,
                            callback: ({ header }) => {
                                if (header.success) {
                                    setStatus(DESK_STATUS_PUBLISH);
                                    toast.success(header.message);
                                } else {
                                    messageBox.alert(header.message);
                                }
                                setLoading(false);
                            },
                        }),
                    );
                },
                () => {},
            );
        }
    };

    /**
     * 예약 완료
     */
    const onReserve = ({ header }) => {
        if (header.success) {
            setStatus(DESK_STATUS_PUBLISH);
        }
    };

    /**
     * on/off 변경
     */
    const onChange = (e) => {
        setOpen(e.target.checked);
        setStatus(DESK_STATUS_WORK);
    };

    useEffect(() => {
        setOpen(desking.viewYn === 'Y');
    }, [desking.viewYn]);

    useImperativeHandle(
        ref,
        () => ({
            viewYn: open ? 'Y' : 'N',
        }),
        [open],
    );

    return (
        <div className="position-relative border-bottom pb-24">
            {loading && <MokaLoader />}
            <Row className="d-flex position-relative" noGutters>
                <Col xs={4} className="d-flex align-items-center position-unset">
                    <ReserveWork compNo={compNo} reserveDt={desking.reserveDt} pkgSeq={pkgSeq} status={status} onReserve={onReserve} />
                    <MokaInputLabel
                        as="switch"
                        label="데이터기사"
                        id={controls}
                        inputProps={{ checked: open }}
                        onChange={onChange}
                        style={{ height: 'auto' }}
                        labelClassName={status === DESK_STATUS_WORK ? 'color-positive' : status === DESK_STATUS_PUBLISH ? 'color-info' : 'color-gray-900'}
                    />
                </Col>
                <Col xs={8} className="d-flex justify-content-end align-items-center">
                    <div className="d-flex">
                        <StatusBadge desking={desking} />
                        <MokaOverlayTooltipButton className="work-btn mr-2" tooltipText="미리보기" variant="white" onClick={preview}>
                            <MokaIcon iconName="fal-file-search" />
                        </MokaOverlayTooltipButton>
                        <MokaOverlayTooltipButton className="work-btn mr-2" tooltipText="임시저장" variant="white" onClick={saveDesking}>
                            <MokaIcon iconName="Save" feather />
                        </MokaOverlayTooltipButton>
                        <MokaOverlayTooltipButton className="work-btn" tooltipText="전송" variant="white" onClick={publishDesking}>
                            <MokaIcon iconName="Send" feather />
                        </MokaOverlayTooltipButton>
                    </div>
                </Col>
            </Row>
        </div>
    );
});

CollapseArticleAuto.defaultProps = defaultProps;

export default CollapseArticleAuto;
