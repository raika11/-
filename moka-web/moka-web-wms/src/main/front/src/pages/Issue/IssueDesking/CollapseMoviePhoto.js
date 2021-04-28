import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DESK_STATUS_WORK, DESK_STATUS_SAVE, DESK_STATUS_PUBLISH, CHANNEL_TYPE, ISSUE_CHANNEL_TYPE } from '@/constants';
import { MokaInputLabel, MokaTable, MokaLoader, MokaOverlayTooltipButton, MokaIcon } from '@components';
import { autoScroll, classElementsFromPoint, getDisplayedRows } from '@utils/agGridUtil';
import common from '@utils/commonUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { initialState, saveIssueDesking, publishIssueDesking } from '@store/issue';
import { ArticleTabModal } from '@pages/Article/modals';
import { moviePhotoColumnDefs } from './IssueDeskingColumns';
import { DeskingHistoryModal } from '../modal';
import StatusBadge from './StatusBadge';
import ReserveWork from './ReserveWork';

const defaultProps = {
    desking: {},
    deskingList: [],
};

/**
 * 패키지관리 > 관련 데이터 편집 > 영상/포토
 */
const CollapseMoviePhoto = forwardRef(({ pkgSeq, compNo, desking, deskingList, MESSAGE, rowToData, rowHeight, preview }, ref) => {
    const dispatch = useDispatch();
    const [gridInstance, setGridInstance] = useState(null);
    const [status, setStatus] = useState(DESK_STATUS_SAVE);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [histShow, setHistShow] = useState(false);
    const controls = 'collapse-mp';

    /**
     * 기사 등록
     * @param {string} channelType channelType
     * @param {object} data data
     */
    const addArticle = (channelType, data) => {
        const cnt = gridInstance.api.getDisplayedRowCount();

        if (channelType === CHANNEL_TYPE.A.code) {
            gridInstance.api.applyTransaction({
                add: [
                    {
                        ...initialState.initialDesking,
                        id: `${pkgSeq}-${ISSUE_CHANNEL_TYPE.M.code}-${common.getUniqueKey()}`,
                        pkgSeq,
                        compNo,
                        contentsOrd: cnt + 1,
                        thumbFileName: data.artThumb,
                        title: data.artTitle,
                        channelType: ISSUE_CHANNEL_TYPE.M.code,
                        afterOnChange: () => setStatus(DESK_STATUS_WORK),
                    },
                ],
            });
            setStatus(DESK_STATUS_WORK);
        } else if (channelType === CHANNEL_TYPE.M.code) {
            gridInstance.api.applyTransaction({
                add: [
                    {
                        ...initialState.initialDesking,
                        id: `${pkgSeq}-${ISSUE_CHANNEL_TYPE.M.code}-${common.getUniqueKey()}`,
                        pkgSeq,
                        compNo,
                        contentsOrd: cnt + 1,
                        thumbFileName: data.ovpThumb,
                        title: data.artTitle,
                        channelType: ISSUE_CHANNEL_TYPE.M.code,
                        afterOnChange: () => setStatus(DESK_STATUS_WORK),
                    },
                ],
            });
            setStatus(DESK_STATUS_WORK);
        } else {
            messageBox.alert('기사, 영상탭에서 선택해주세요.');
        }
    };

    /**
     * 영상포토 추가
     */
    const addMp = () => {
        const cnt = gridInstance.api.getDisplayedRowCount();
        gridInstance.api.applyTransaction({
            add: [
                {
                    ...initialState.initialDesking,
                    id: `${pkgSeq}-${ISSUE_CHANNEL_TYPE.M.code}-${common.getUniqueKey()}`,
                    pkgSeq,
                    compNo,
                    contentsOrd: cnt + 1,
                    channelType: ISSUE_CHANNEL_TYPE.M.code,
                    afterOnChange: () => setStatus(DESK_STATUS_WORK),
                },
            ],
        });
        setStatus(DESK_STATUS_WORK);
    };

    /**
     * 스크롤 처리
     */
    const handleRowDragMove = React.useCallback((params) => {
        const scrollBox = classElementsFromPoint(params.event, 'scrollable');
        autoScroll(scrollBox, { clientX: params.event.clientX, clientY: params.event.clientY });
    }, []);

    /**
     * 드래그 후 ordNo 정렬
     * @param {object} params grid instance
     */
    const handleRowDragEnd = (params) => {
        const displayedRows = getDisplayedRows(params.api);
        const ordered = displayedRows.map((data, idx) => ({
            ...data,
            ordNo: idx + 1,
        }));
        params.api.applyTransaction({ update: ordered });
        setStatus(DESK_STATUS_WORK);
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
                invalidList.push({ index, message: '타이틀을 입력해주세요' });
                isInvalid = true;
            }
        });

        invalidList.forEach((d) => {
            toast.warning(`${d.index + 1}번째 컨텐츠의 ${d.message}`, { removeOnHover: false });
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

    /**
     * 히스토리 불러오기
     * @param {array} histories 히스토리 목록
     */
    const onLoad = (histories) => {
        if (histories) {
            gridInstance.api.setRowData(
                histories.map((d) => ({
                    ...d,
                    id: `${pkgSeq}-${ISSUE_CHANNEL_TYPE.M.code}-${common.getUniqueKey()}`,
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
            // title, bodyHead unescapeHtmlArticle 처리
            gridInstance.api.setRowData(
                deskingList.map((d) => ({
                    ...d,
                    id: `${pkgSeq}-${ISSUE_CHANNEL_TYPE.M.code}-${common.getUniqueKey()}`,
                    title: unescapeHtmlArticle(d.title),
                    afterOnChange: () => setStatus(DESK_STATUS_WORK),
                })),
            );
        }
    }, [gridInstance, pkgSeq, deskingList]);

    useEffect(() => {
        setOpen(desking.viewYn === 'Y');
    }, [desking.viewYn]);

    return (
        <div className="position-relative border-bottom mb-24 pb-24">
            {loading && <MokaLoader />}
            <Row className="d-flex position-relative" noGutters>
                <Col xs={4} className="d-flex align-items-center position-unset">
                    <ReserveWork pkgSea={pkgSeq} status={status} compNo={compNo} reserveDt={desking.reserveDt} onReserve={onReserve} />
                    <MokaInputLabel
                        as="switch"
                        label="영상포토"
                        id={controls}
                        inputProps={{ checked: open, 'aria-controls': controls, 'aria-expanded': open, 'data-toggle': 'collapse' }}
                        labelClassName={status === DESK_STATUS_WORK ? 'color-positive' : status === DESK_STATUS_PUBLISH ? 'color-info' : 'color-gray-900'}
                        style={{ height: 'auto' }}
                        onChange={onChange}
                    />
                </Col>
                <Col xs={3} className="d-flex align-items-center">
                    <Button variant="searching" size="sm" className="mr-1" onClick={() => setShow(true)}>
                        기사검색
                    </Button>
                    <ArticleTabModal show={show} onHide={() => setShow(false)} onRowClicked={addArticle} />
                    <Button variant="positive" size="sm" className="mr-1" onClick={addMp}>
                        추가
                    </Button>
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
                        <DeskingHistoryModal show={histShow} pkgSeq={pkgSeq} compNo={compNo} onHide={() => setHistShow(false)} onLoad={onLoad} />
                    </div>
                </Col>
            </Row>
            <Collapse in={open}>
                <div id={controls} className="mt-2">
                    <MokaTable
                        rowHeight={rowHeight}
                        header={false}
                        paging={false}
                        columnDefs={moviePhotoColumnDefs}
                        onRowNodeId={(data) => data.id}
                        setGridInstance={setGridInstance}
                        animateRows
                        rowDragManaged
                        suppressMoveWhenRowDragging
                        onRowDragMove={handleRowDragMove}
                        onRowDragEnd={handleRowDragEnd}
                        dragStyle
                    />
                </div>
            </Collapse>
        </div>
    );
});

CollapseMoviePhoto.defaultProps = defaultProps;

export default CollapseMoviePhoto;
