import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel, MokaLoader } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { DESK_STATUS_SAVE, DESK_STATUS_PUBLISH } from '@/constants';
import { saveIssueDesking, publishIssueDesking } from '@store/issue';
import StatusBadge from './StatusBadge';

/**
 * 패키지관리 > 관련 데이터 편집 > 기사 (자동)
 */
const CollapseArticleAuto = forwardRef(({ compNo, pkgSeq, desking, MESSAGE }, ref) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [, setStatus] = useState(DESK_STATUS_SAVE);
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
        <div className="position-relative">
            {loading && <MokaLoader />}
            <Row className="py-2 mt-2 d-flex border-bottom" noGutters>
                <Col xs={3}>
                    <MokaInputLabel as="switch" label="메인기사" id={controls} inputProps={{ checked: open }} onChange={(e) => setOpen(e.target.checked)} />
                </Col>
                <Col xs={6} className="d-flex align-items-center">
                    <span>조회수가 가장 높은 기사가 자동으로 노출됩니다</span>
                </Col>
                <Col xs={3} className="d-flex justify-content-end align-items-center">
                    <StatusBadge desking={desking} />
                    <Button variant="positive-a" size="sm" className="flex-shrink-0 mr-1" onClick={saveDesking}>
                        임시저장
                    </Button>
                    <Button variant="positive" size="sm" className="flex-shrink-0" onClick={publishDesking}>
                        전송
                    </Button>
                </Col>
            </Row>
        </div>
    );
});

export default CollapseArticleAuto;
