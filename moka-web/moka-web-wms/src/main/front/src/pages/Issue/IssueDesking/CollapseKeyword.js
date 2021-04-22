import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DESK_STATUS_WORK, DESK_STATUS_SAVE, DESK_STATUS_PUBLISH, ISSUE_CHANNEL_TYPE } from '@/constants';
import { getDisplayedRows } from '@utils/agGridUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { initialState, saveIssueDesking, publishIssueDesking } from '@store/issue';
import { MokaInputLabel, MokaTable, MokaLoader } from '@components';
import StatusBadge from './StatusBadge';
import { keywordColumnDefs } from './IssueDeskingColumns';

/**
 * 패키지관리 > 관련 데이터 편집 > 키워드
 */
const CollapseKeyword = forwardRef(({ pkgSeq, compNo, desking, deskingList, MESSAGE, rowToData }, ref) => {
    const dispatch = useDispatch();
    const [gridInstance, setGridInstance] = useState(null);
    const [status, setStatus] = useState(DESK_STATUS_WORK);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const controls = 'collapse-keyword';

    /**
     * 데이터 유효성 검사
     * @param {array} desking 데스킹 컨텐츠 데이터
     */
    const validate = (desking) => {
        let isInvalid = false;
        let invalidList = [];

        desking.forEach((data, index) => {
            // 제목 검사
            if (!data.title || data.title === '') {
                invalidList.push({ index, message: '제목을 입력해주세요' });
                isInvalid = true;
            }

            // 키워드 검사
            if (!data.bodyHead || data.bodyHead === '') {
                invalidList.push({ index, message: '키워드를 입력해주세요' });
                isInvalid = true;
            }
        });

        invalidList.forEach((d) => {
            toast.warning(d.message, { removeOnHover: false });
        });
        return !isInvalid;
    };

    /**
     * 임시저장
     */
    const saveDesking = () => {
        const viewYn = open ? 'Y' : 'N';
        const displayedRows = open ? rowToData(getDisplayedRows(gridInstance.api), viewYn) : [];

        if (!open || validate(displayedRows)) {
            setLoading(true);
            dispatch(
                saveIssueDesking({
                    compNo,
                    pkgSeq,
                    issueDesking: {
                        ...desking,
                        compNo,
                        pkgSeq,
                        viewYn,
                        issueDeskings: displayedRows,
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
        }
    };

    /**
     * 전송
     */
    const publishDesking = () => {
        if (status === DESK_STATUS_WORK) {
            messageBox.alert(MESSAGE.FAIL_PUBLISH_UNTIL_SAVE);
        } else if (!desking.lastSaveDt) {
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

    useImperativeHandle(
        ref,
        () => ({
            viewYn: open ? 'Y' : 'N',
            gridInstance,
            getDisplayedRows: () => rowToData(getDisplayedRows(gridInstance.api), open ? 'Y' : 'N'),
        }),
        [gridInstance, open, rowToData],
    );

    useEffect(() => {
        if (gridInstance) {
            const data =
                deskingList.length > 0
                    ? {
                          ...initialState.initialDesking,
                          ...deskingList[0],
                          pkgSeq,
                          compNo,
                          channelType: ISSUE_CHANNEL_TYPE.K.code,
                          id: 'keyword-1',
                          afterOnChange: () => setStatus(DESK_STATUS_WORK),
                      }
                    : {
                          ...initialState.initialDesking,
                          pkgSeq,
                          compNo,
                          channelType: ISSUE_CHANNEL_TYPE.K.code,
                          id: 'keyword-1',
                          afterOnChange: () => setStatus(DESK_STATUS_WORK),
                      };
            gridInstance.api.setRowData([data]);
            setStatus(DESK_STATUS_SAVE);
        }
    }, [compNo, deskingList, gridInstance, pkgSeq]);

    useEffect(() => {
        setOpen(desking.viewYn === 'Y');
    }, [desking.viewYn]);

    return (
        <div className="position-relative border-bottom pb-24">
            {loading && <MokaLoader />}
            <Row className="d-flex" noGutters>
                <Col xs={3}>
                    <MokaInputLabel as="switch" label="키워드" id={controls} inputProps={{ checked: open }} onChange={(e) => setOpen(e.target.checked)} />
                </Col>
                <Col xs={4}></Col>
                <Col xs={5} className="d-flex justify-content-end align-items-center">
                    <StatusBadge desking={desking} />
                    <Button variant="positive-a" size="sm" className="mr-1" onClick={saveDesking}>
                        임시저장
                    </Button>
                    <Button variant="positive" size="sm" onClick={publishDesking}>
                        전송
                    </Button>
                </Col>
            </Row>
            <Collapse in={open}>
                <div id={controls} className="mt-2">
                    <MokaTable
                        rowHeight={90}
                        header={false}
                        paging={false}
                        columnDefs={keywordColumnDefs}
                        onRowNodeId={(data) => data.id}
                        setGridInstance={setGridInstance}
                        dragStyle
                    />
                </div>
            </Collapse>
        </div>
    );
});

export default CollapseKeyword;
