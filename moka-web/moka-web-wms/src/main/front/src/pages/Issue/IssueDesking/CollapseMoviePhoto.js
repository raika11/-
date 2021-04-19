import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DESK_STATUS_WORK, DESK_STATUS_SAVE, DESK_STATUS_PUBLISH, CHANNEL_TYPE, ISSUE_CHANNEL_TYPE } from '@/constants';
import { MokaInputLabel, MokaTable, MokaLoader } from '@components';
import { autoScroll, classElementsFromPoint, getDisplayedRows } from '@utils/agGridUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { initialState, saveIssueDesking, publishIssueDesking } from '@store/issue';
import { ArticleTabModal } from '@pages/Article/modals';
import { VodModal } from '@pages/Desking/modals';
import { moviePhotoColumnDefs } from './IssueDeskingColumns';
import StatusBadge from './StatusBadge';

/**
 * 패키지관리 > 관련 데이터 편집 > 영상/포토
 */
const CollapseMoviePhoto = forwardRef(({ pkgSeq, compNo, desking, deskingList, MESSAGE }, ref) => {
    const dispatch = useDispatch();
    const [gridInstance, setGridInstance] = useState(null);
    const [status, setStatus] = useState(DESK_STATUS_WORK);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [vodShow, setVodShow] = useState(false);
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
                        pkgSeq,
                        compNo,
                        contentsOrd: cnt + 1,
                        contentsId: data.totalId,
                        thumbFileName: data.artThumb,
                        title: data.artTitle,
                        channelType: ISSUE_CHANNEL_TYPE.A.code,
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
                        pkgSeq,
                        compNo,
                        contentsOrd: cnt + 1,
                        contentsId: data.totalId,
                        thumbFileName: data.ovpThumb,
                        title: data.artTitle,
                        channelType: ISSUE_CHANNEL_TYPE.A.code,
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
     * TODO 영상 등록 ===> 영상 링크 등록할 필드가 없음~~~
     * @param {string} url url path
     * @param {object} data ovp 데이터 (유투브일 경우 null)
     */
    const addMovie = (url, data) => {
        const cnt = gridInstance.api.getDisplayedRowCount();

        gridInstance.api.applyTransaction({
            add: [
                {
                    ...initialState.initialDesking,
                    pkgSeq,
                    compNo,
                    contentsOrd: cnt + 1,
                    contentsId: data.id,
                    thumbFileName: data.thumbFileName,
                    title: data.name,
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
                invalidList.push({ index, message: '라벨을 입력해주세요' });
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
        const displayedRows = open ? getDisplayedRows(gridInstance.api).map((d) => ({ ...d, viewYn })) : [];

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
                    const viewYn = open ? 'Y' : 'N';
                    // rowData 데이터 + viewYn 셋팅
                    const displayedRows = getDisplayedRows(gridInstance.api).map((d) => ({ ...d, viewYn }));
                    dispatch(
                        publishIssueDesking({
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
            getDisplayedRows: () => getDisplayedRows(gridInstance.api).map((d) => ({ ...d, viewYn: open ? 'Y' : 'N' })),
        }),
        [gridInstance, open],
    );

    useEffect(() => {
        if (gridInstance) {
            // title, bodyHead unescapeHtmlArticle 처리
            gridInstance.api.setRowData(
                deskingList.map((d) => ({
                    ...d,
                    title: unescapeHtmlArticle(d.title),
                    afterOnChange: () => setStatus(DESK_STATUS_WORK),
                })),
            );
            setStatus(DESK_STATUS_SAVE);
        }
    }, [gridInstance, deskingList]);

    useEffect(() => {
        setOpen(desking.viewYn === 'Y');
    }, [desking.viewYn]);

    return (
        <div className="position-relative">
            {loading && <MokaLoader />}
            <Row className="py-2 mt-2 d-flex border-bottom" noGutters>
                <Col xs={3}>
                    <MokaInputLabel
                        as="switch"
                        label="영상/포토"
                        id={controls}
                        inputProps={{ checked: open, 'aria-controls': controls, 'aria-expanded': open, 'data-toggle': 'collapse' }}
                        onChange={(e) => setOpen(e.target.checked)}
                    />
                </Col>
                <Col xs={4} className="d-flex align-items-center">
                    <Button variant="searching" size="sm" className="mr-1" onClick={() => setShow(true)}>
                        기사검색
                    </Button>
                    <ArticleTabModal show={show} onHide={() => setShow(false)} onRowClicked={addArticle} />

                    <Button variant="searching" size="sm" className="mr-1" onClick={() => setVodShow(true)}>
                        영상검색
                    </Button>
                    <VodModal show={vodShow} onHide={() => setVodShow(false)} onSave={addMovie} />
                </Col>
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
                        rowHeight={46}
                        header={false}
                        paging={false}
                        columnDefs={moviePhotoColumnDefs}
                        onRowNodeId={(data) => data.contentsId}
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

export default CollapseMoviePhoto;
