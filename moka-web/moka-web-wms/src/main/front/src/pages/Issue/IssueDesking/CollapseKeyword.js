import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux';
import Collapse from 'react-bootstrap/Collapse';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DESK_STATUS_WORK, DESK_STATUS_SAVE, DESK_STATUS_PUBLISH, ISSUE_CHANNEL_TYPE } from '@/constants';
import { getDisplayedRows } from '@utils/agGridUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { initialState, saveIssueDesking, publishIssueDesking } from '@store/issue';
import { MokaInputLabel, MokaTable, MokaLoader, MokaOverlayTooltipButton, MokaIcon } from '@components';
import { DeskingHistoryModal } from '../modal';
import StatusBadge from './StatusBadge';
import ReserveWork from './ReserveWork';
import { keywordColumnDefs } from './IssueDeskingColumns';

const defaultProps = {
    desking: {},
    deskingList: [],
};

/**
 * 패키지관리 > 관련 데이터 편집 > 키워드
 */
const CollapseKeyword = forwardRef(({ pkgSeq, compNo, desking, deskingList, MESSAGE, rowToData, rowHeight, preview }, ref) => {
    const dispatch = useDispatch();
    const [gridInstance, setGridInstance] = useState(null);
    const [status, setStatus] = useState(DESK_STATUS_SAVE);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [histShow, setHistShow] = useState(false);
    const id = 'keyword-1';
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

    /**
     * 히스토리 불러오기
     * @param {array} histories 히스토리 목록
     */
    const onLoad = (histories) => {
        if (histories) {
            gridInstance.api.setRowData(
                histories.map((d) => ({
                    ...d,
                    id,
                    title: unescapeHtmlArticle(d.title),
                    afterOnChange: () => setStatus(DESK_STATUS_WORK),
                })),
            );
            setStatus(DESK_STATUS_WORK);
        } else {
            toast.warning('불러올 히스토리 목록이 없습니다');
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
        setStatus(DESK_STATUS_SAVE);
    }, [pkgSeq]);

    useEffect(() => {
        if (gridInstance) {
            const data =
                deskingList.length > 0
                    ? {
                          ...initialState.initialDesking,
                          ...deskingList[0],
                          pkgSeq,
                          compNo,
                          title: unescapeHtmlArticle(deskingList[0].title),
                          channelType: ISSUE_CHANNEL_TYPE.K.code,
                          id,
                          afterOnChange: () => setStatus(DESK_STATUS_WORK),
                      }
                    : {
                          ...initialState.initialDesking,
                          pkgSeq,
                          compNo,
                          channelType: ISSUE_CHANNEL_TYPE.K.code,
                          id,
                          afterOnChange: () => setStatus(DESK_STATUS_WORK),
                      };
            gridInstance.api.setRowData([data]);
        }
    }, [compNo, deskingList, gridInstance, pkgSeq]);

    useEffect(() => {
        setOpen(desking.viewYn === 'Y');
    }, [desking.viewYn]);

    return (
        <div className="position-relative border-bottom mb-24 pb-24">
            {loading && <MokaLoader />}
            <Row className="d-flex position-relative" noGutters>
                <Col xs={4} className="d-flex align-items-center position-unset">
                    <ReserveWork compNo={compNo} reserveDt={desking.reserveDt} pkgSeq={pkgSeq} status={status} onReserve={onReserve} />
                    <MokaInputLabel
                        as="switch"
                        label="연관키워드"
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
                        <MokaOverlayTooltipButton className="work-btn mr-2" tooltipText="전송" variant="white" onClick={publishDesking}>
                            <MokaIcon iconName="Send" feather />
                        </MokaOverlayTooltipButton>
                        <MokaOverlayTooltipButton className="work-btn" tooltipText="히스토리" variant="white" onClick={() => setHistShow(true)}>
                            <MokaIcon iconName="fal-history" />
                        </MokaOverlayTooltipButton>
                        <DeskingHistoryModal show={histShow} onHide={() => setHistShow(false)} pkgSeq={pkgSeq} compNo={compNo} onLoad={onLoad} />
                    </div>
                </Col>
            </Row>
            <Collapse in={open}>
                <div id={controls} className="mt-2">
                    <MokaTable
                        rowHeight={rowHeight}
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

CollapseKeyword.defaultProps = defaultProps;

export default CollapseKeyword;
