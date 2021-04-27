import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DESK_STATUS_WORK, DESK_STATUS_SAVE, DESK_STATUS_PUBLISH, CHANNEL_TYPE, ISSUE_CHANNEL_TYPE, ARTICLE_URL } from '@/constants';
import { initialState, saveIssueDesking, publishIssueDesking } from '@store/issue';
import { MokaInputLabel, MokaTable, MokaLoader, MokaOverlayTooltipButton, MokaIcon } from '@components';
import { getDisplayedRows } from '@utils/agGridUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { ArticleTabModal } from '@pages/Article/modals';
import { liveColumnDefs } from './IssueDeskingColumns';
import { DeskingHistoryModal } from '../modal';
import StatusBadge from './StatusBadge';
import ReserveWork from './ReserveWork';

const defaultProps = {
    desking: {},
    deskingList: [],
};

/**
 * 패키지관리 > 관련 데이터 편집 > 라이브기사
 */
const CollapseLive = forwardRef(({ pkgSeq, compNo, desking, deskingList, MESSAGE, rowToData, rowHeight, preview }, ref) => {
    const dispatch = useDispatch();
    const [gridInstance, setGridInstance] = useState(null);
    const [status, setStatus] = useState(DESK_STATUS_WORK);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [histShow, setHistShow] = useState(false);
    const id = 'live-1';
    const controls = 'collapse-live';

    /**
     * 기사 등록
     * @param {string} channelType channelType
     * @param {object} data data
     */
    const addArticle = (channelType, data) => {
        if (channelType === CHANNEL_TYPE.A.code || channelType === CHANNEL_TYPE.M.code) {
            const firstNode = gridInstance.api.getDisplayedRowAtIndex(0);
            const ndata = {
                ...initialState,
                id,
                pkgSeq,
                compNo,
                title: data.artTitle,
                contentsId: data.totalId,
                linkUrl: `${ARTICLE_URL}${data.totalId}`,
                channelType: ISSUE_CHANNEL_TYPE.L.code,
                afterOnChange: () => setStatus(DESK_STATUS_WORK),
            };
            if (!firstNode.data.contentsId) {
                gridInstance.api.setRowData([ndata]);
                setShow(false);
            } else {
                messageBox.confirm(
                    '라이브 기사 등록은 1개만 등록 가능합니다.\n등록된 기사를 삭제 후 등록하시겠습니까?',
                    () => {
                        gridInstance.api.setRowData([ndata]);
                        setShow(false);
                    },
                    () => {},
                );
            }
            setStatus(DESK_STATUS_WORK);
        } else {
            messageBox.alert('기사, 영상 탭에서 선택해주세요.');
        }
    };

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
            // url 검사
            if (!data.linkUrl || data.linkUrl === '') {
                invalidList.push({ index, message: 'URL을 입력해주세요' });
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

        if (open && displayedRows.length < 1) {
            messageBox.alert(MESSAGE.FAIL_SAVE_NO_DATA);
            return;
        }

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
        const data =
            deskingList.length > 0
                ? {
                      ...initialState.initialDesking,
                      ...deskingList[0],
                      title: unescapeHtmlArticle(deskingList[0].title),
                      id,
                      pkgSeq,
                      compNo,
                      channelType: ISSUE_CHANNEL_TYPE.L.code,
                      afterOnChange: () => setStatus(DESK_STATUS_WORK),
                  }
                : {
                      ...initialState.initialDesking,
                      id,
                      pkgSeq,
                      compNo,
                      channelType: ISSUE_CHANNEL_TYPE.L.code,
                      afterOnChange: () => setStatus(DESK_STATUS_WORK),
                  };
        if (gridInstance) {
            gridInstance.api.setRowData([data]);
            setStatus(DESK_STATUS_SAVE);
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
                    <ReserveWork reserveDt={desking.reserveDt} pkgSeq={pkgSeq} compNo={compNo} status={status} onReserve={onReserve} />
                    <MokaInputLabel
                        as="switch"
                        label="라이브기사"
                        id={controls}
                        style={{ height: 'auto' }}
                        inputProps={{ checked: open, 'aria-controls': controls, 'aria-expanded': open, 'data-toggle': 'collapse' }}
                        labelClassName={status === DESK_STATUS_WORK ? 'color-positive' : status === DESK_STATUS_PUBLISH ? 'color-info' : 'color-gray-900'}
                        onChange={onChange}
                    />
                </Col>
                <Col xs={3} className="d-flex align-items-center">
                    <Button variant="searching" size="sm" className="mr-1" onClick={() => setShow(true)}>
                        기사검색
                    </Button>
                    <ArticleTabModal show={show} onHide={() => setShow(false)} onRowClicked={addArticle} />
                </Col>
                <Col xs={5} className="d-flex justify-content-end align-items-center">
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
                        <DeskingHistoryModal show={histShow} onHide={() => setHistShow(false)} pkgSeq={pkgSeq} compNo={compNo} />
                    </div>
                </Col>
            </Row>
            <Collapse in={open}>
                <div id={controls} className="mt-2">
                    <MokaTable
                        rowHeight={rowHeight}
                        header={false}
                        paging={false}
                        columnDefs={liveColumnDefs}
                        onRowNodeId={(data) => data.id}
                        setGridInstance={setGridInstance}
                        dragStyle
                    />
                </div>
            </Collapse>
        </div>
    );
});

CollapseLive.defaultProps = defaultProps;

export default CollapseLive;
