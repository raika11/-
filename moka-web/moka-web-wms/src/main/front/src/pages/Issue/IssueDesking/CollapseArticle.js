import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { DESK_STATUS_WORK, DESK_STATUS_SAVE, DESK_STATUS_PUBLISH, CHANNEL_TYPE, ISSUE_CHANNEL_TYPE, ARTICLE_URL, ISSUE_URL } from '@/constants';
import { MokaInputLabel, MokaTable, MokaLoader } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { autoScroll, classElementsFromPoint, getDisplayedRows } from '@utils/agGridUtil';
import { initialState, saveIssueDesking, publishIssueDesking } from '@store/issue';
import { ArticleTabModal } from '@pages/Article/modals';
import StatusBadge from './StatusBadge';
import { artColumnDefs } from './IssueDeskingColumns';

/**
 * 패키지관리 > 관련 데이터 편집 > 기사 (편집)
 */
const CollapseArticle = ({ pkgSeq, compNo, gridInstance, setGridInstance, desking, deskingList, MESSAGE }) => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState(DESK_STATUS_WORK);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const controls = 'collapse-art';

    /**
     * 기사 등록
     * @param {string} channelType channelType (A|M|P|G)
     * @param {object} data data
     */
    const addArticle = (channelType, data) => {
        const cnt = gridInstance.api.getDisplayedRowCount();

        // 기사모달에서 넘어오는 데이터 unescapeHtmlArticle 처리 되어있음
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
                        bodyHead: data.artSummary,
                        linkUrl: `${ARTICLE_URL}${data.totalId}`,
                        duration: data.duration,
                        channelType: ISSUE_CHANNEL_TYPE.A.code,
                        afterOnChange: () => setStatus(DESK_STATUS_WORK),
                        distDt: data.serviceDaytime, // 기사 등록일
                    },
                ],
            });
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
                        bodyHead: data.artSummary,
                        linkUrl: `${ARTICLE_URL}${data.totalId}`,
                        duration: data.duration,
                        channelType: ISSUE_CHANNEL_TYPE.A.code,
                        afterOnChange: () => setStatus(DESK_STATUS_WORK),
                        distDt: data.serviceDaytime, // 기사 등록일
                    },
                ],
            });
        } else if (channelType === CHANNEL_TYPE.I.code) {
            gridInstance.api.applyTransaction({
                add: [
                    {
                        ...initialState.initialDesking,
                        pkgSeq,
                        compNo,
                        contentsOrd: cnt + 1,
                        contentsId: data.pkgSeq,
                        title: data.pkgTitle,
                        linkUrl: `${ISSUE_URL}${data.pkgSeq}`,
                        channelType: ISSUE_CHANNEL_TYPE.I.code,
                        afterOnChange: () => setStatus(DESK_STATUS_WORK),
                        distDt: data.regDt, // 이슈 생성일
                    },
                ],
            });
        } else if (channelType === CHANNEL_TYPE.G.code) {
        }

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
     * 드래그 후 contentsOrd 정렬
     * @param {object} params grid instance
     */
    const handleRowDragEnd = (params) => {
        const displayedRows = getDisplayedRows(params.api);
        const ordered = displayedRows.map((data, idx) => ({
            ...data,
            contentsOrd: idx + 1,
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
            // 이미지 검사
            if (!data.thumbFileName && !data.thumbFile) {
                invalidList.push({ index, message: '대표 이미지를 지정해주세요' });
                isInvalid = true;
            }
            // 제목 검사
            if (!data.title || data.title === '') {
                invalidList.push({ index, message: '기사 제목을 입력해주세요' });
                isInvalid = true;
            }
            // url 검사
            if (!data.linkUrl || data.linkUrl === '') {
                invalidList.push({ index, message: 'URL을 입력해주세요' });
                isInvalid = true;
            }
        });

        invalidList.forEach((d) => {
            toast.warning(`${d.index + 1}번째 기사의 ${d.message}`, { removeOnHover: false });
        });
        return !isInvalid;
    };

    /**
     * 임시저장
     */
    const saveDesking = () => {
        const viewYn = open ? 'Y' : 'N';
        // rowData 데이터 + viewYn 셋팅
        const displayedRows = getDisplayedRows(gridInstance.api).map((d) => ({ ...d, viewYn }));
        if (validate(displayedRows)) {
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

    useEffect(() => {
        setOpen(desking.viewYn === 'Y');
    }, [desking.viewYn]);

    useEffect(() => {
        if (gridInstance) {
            // title, bodyHead unescapeHtmlArticle 처리
            gridInstance.api.setRowData(
                deskingList.map((d) => ({
                    ...d,
                    title: unescapeHtmlArticle(d.title),
                    bodyHead: unescapeHtmlArticle(d.bodyHead),
                    afterOnChange: () => setStatus(DESK_STATUS_WORK),
                })),
            );
            setStatus(DESK_STATUS_SAVE);
        }
    }, [gridInstance, pkgSeq, deskingList]);

    return (
        <div className="position-relative">
            {loading && <MokaLoader />}
            <Row className="py-2 d-flex border-bottom" noGutters>
                <Col xs={3}>
                    <MokaInputLabel
                        as="switch"
                        label="메인기사"
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
                </Col>
                <Col xs={5} className="d-flex justify-content-end align-items-center">
                    <StatusBadge desking={desking} />
                    <Button variant="outline-neutral" size="sm" className="mr-1">
                        미리보기
                    </Button>
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
                        rowHeight={210}
                        header={false}
                        paging={false}
                        columnDefs={artColumnDefs}
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
};

export default CollapseArticle;
