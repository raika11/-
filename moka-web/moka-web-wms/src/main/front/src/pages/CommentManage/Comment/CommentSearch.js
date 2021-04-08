import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import CommentBlockModal from '@pages/CommentManage/CommentModal/CommentBlockModal';
import { initialState, getInitData, getCommentList, changeSearchOption } from '@store/commentManage';
import toast, { messageBox } from '@utils/toastUtil';
import { DB_DATEFORMAT } from '@/constants';
import { AuthButton } from '@pages/Auth/AuthButton';

moment.locale('ko');

/**
 * 댓글 관리 > 댓글 목록 검색
 */
const CommentSearch = ({ selectBannedItem }) => {
    const dispatch = useDispatch();
    const { COMMENT_STATUS_CODE, COMMENT_ORDER_CODE, COMMENT_MEDIA_CODE, COMMENT_SITE_CODE } = useSelector(({ comment }) => ({
        COMMENT_ORDER_CODE: comment.common.COMMENT_ORDER_CODE,
        COMMENT_STATUS_CODE: comment.common.COMMENT_STATUS_CODE,
        COMMENT_MEDIA_CODE: comment.common.COMMENT_MEDIA_CODE,
        COMMENT_SITE_CODE: comment.common.COMMENT_SITE_CODE,
    }));
    const storeSearch = useSelector((store) => store.comment.comments.search);
    const [search, setSearch] = useState(initialState.comments.search);
    const [defaultInputModalState, setDefaultInputModalState] = useState(false); // 차단 등록 모달 state

    /**
     * 검색 옵션 변경
     */
    const handleChangeSearchInput = (e) => {
        const { name, value } = e.target;
        setSearch({
            ...search,
            [name]: value,
        });
    };

    /**
     * 검색
     */
    const handleClickSearch = () => {
        let startDiff = moment(search.startDt).diff(moment(search.endDt));
        let endDiff = moment(search.endDt).diff(moment(search.startDt));
        if (startDiff > 0) {
            toast.warning('시작일은 종료일보다 클 수 없습니다.');
            return;
        }

        if (endDiff < 0) {
            toast.warning('종료일은 시작일보다 작을 수 없습니다.');
            return;
        }

        dispatch(
            getCommentList(
                changeSearchOption({
                    ...search,
                    page: 0,
                    startDt: search.startDt ? moment(search.startDt).format(DB_DATEFORMAT) : '',
                    endDt: search.endDt ? moment(search.endDt).format(DB_DATEFORMAT) : '',
                }),
            ),
        );
    };

    /**
     * 초기화
     */
    const handleClickReset = () => {
        setSearch(initialState.comments.search);
    };

    /**
     * 차단 등록
     */
    const handleClickBlock = () => {
        if (selectBannedItem.length === 0) {
            messageBox.alert('차단할 댓글을 선택해 주세요.');
            return;
        }
        setDefaultInputModalState(true);
    };

    // const handleCLickDelete = () => {
    //     messageBox.alert('서비스 준비 중입니다.');
    // };

    useEffect(() => {
        // 초기 설정 정보, 댓글 목록 조회
        dispatch(
            getCommentList(
                getInitData(),
                changeSearchOption({
                    ...search,
                    startDt: moment().startOf('day').format(DB_DATEFORMAT),
                    endDt: moment().endOf('day').format(DB_DATEFORMAT),
                }),
            ),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        let ssd = moment(storeSearch.startDt, DB_DATEFORMAT);
        if (!ssd.isValid()) ssd = null;
        let esd = moment(storeSearch.endDt, DB_DATEFORMAT);
        if (!esd.isValid()) esd = null;

        setSearch({
            ...storeSearch,
            startDt: ssd,
            endDt: esd,
        });
    }, [storeSearch]);

    return (
        <>
            <Form className="mb-14">
                <Form.Row>
                    <Col xs={1} className="p-0 pr-2">
                        <MokaInput as="select" value={search.groupId} onChange={handleChangeSearchInput} name="groupId" id="groupId">
                            <option value="">전체매체</option>
                            {COMMENT_MEDIA_CODE &&
                                COMMENT_MEDIA_CODE.map((item, index) => (
                                    <option key={index} value={item.dtlCd}>
                                        {item.cdNm}
                                    </option>
                                ))}
                        </MokaInput>
                    </Col>
                    <Col xs={3} className="p-0 pr-2 d-flex">
                        <MokaInput
                            as="dateTimePicker"
                            name="startDt"
                            className="mr-1"
                            value={search.startDt}
                            inputProps={{ timeFormat: null, timeDefault: 'start' }}
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setSearch({ ...search, startDt: date });
                                } else if (date === '') {
                                    setSearch({ ...search, startDt: null });
                                }
                            }}
                        />
                        <MokaInput
                            as="dateTimePicker"
                            name="endDt"
                            className="ml-1"
                            value={search.endDt}
                            inputProps={{ timeFormat: null, timeDefault: 'end' }}
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setSearch({ ...search, endDt: date });
                                } else if (date === '') {
                                    setSearch({ ...search, endDt: null });
                                }
                            }}
                        />
                    </Col>
                    <Col xs={2} className="p-0 pr-2 d-flex">
                        <MokaInput as="select" className="mr-1" value={search.status} onChange={handleChangeSearchInput} name="status" id="status">
                            <option value="Y">상태전체</option>
                            {COMMENT_STATUS_CODE &&
                                COMMENT_STATUS_CODE.map((status, index) => (
                                    <option key={index} value={status.code}>
                                        {status.name}
                                    </option>
                                ))}
                        </MokaInput>
                        <MokaInput as="select" className="ml-1" value={search.orderType} onChange={handleChangeSearchInput} name="orderType" id="orderType">
                            <option value="">전체</option>
                            {COMMENT_ORDER_CODE &&
                                COMMENT_ORDER_CODE.map((order, index) => (
                                    <option key={index} value={order.code}>
                                        {order.name}
                                    </option>
                                ))}
                        </MokaInput>
                    </Col>
                    <Col xs={2} className="p-0 pr-2 d-flex">
                        <MokaInput as="select" className="mr-1" value={search.memType} onChange={handleChangeSearchInput} name="memType" id="memType">
                            <option value="">전체계정</option>
                            {COMMENT_SITE_CODE &&
                                COMMENT_SITE_CODE.map((item, index) => (
                                    <option key={index} value={item.dtlCd}>
                                        {item.cdNm}
                                    </option>
                                ))}
                        </MokaInput>
                        <MokaInput as="select" className="ml-1" value={search.searchType} onChange={handleChangeSearchInput} name="searchType" id="searchType">
                            <option value="memNm">이름</option>
                            <option value="memId">ID</option>
                            <option value="cont">댓글 내용</option>
                        </MokaInput>
                    </Col>
                    <Col xs={4} className="p-0 d-flex">
                        <MokaSearchInput className="mr-1 flex-fill" value={search.keyword} onChange={handleChangeSearchInput} onSearch={handleClickSearch} name="keyword" />
                        <Button variant="negative" className="mr-1 flex-shrink-0" onClick={handleClickReset}>
                            초기화
                        </Button>
                        <AuthButton variant="primary" className="flex-shrink-0" onClick={handleClickBlock}>
                            등록
                        </AuthButton>
                        {/* <AuthButton variant="negative" className="flex-shrink-0" onClick={handleCLickDelete}>
                        삭제
                    </AuthButton> */}
                    </Col>
                </Form.Row>
            </Form>
            <CommentBlockModal
                modalUsage="comment"
                selectBannedItem={selectBannedItem}
                show={defaultInputModalState}
                onHide={() => {
                    setDefaultInputModalState(false);
                }}
            />
        </>
    );
};

export default CommentSearch;
