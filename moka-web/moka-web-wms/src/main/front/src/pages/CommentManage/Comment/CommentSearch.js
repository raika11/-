import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import CommentBlockModal from '@pages/CommentManage/CommentModal/CommentBlockModal';
import { initialState, getCommentList, changeSearchOption } from '@store/commentManage';
import toast, { messageBox } from '@utils/toastUtil';
import { DB_DATEFORMAT } from '@/constants';
import { AuthButton } from '@pages/Auth/AuthButton';

moment.locale('ko');

/**
 * 댓글 관리 > 댓글 목록 검색
 */
const CommentSearch = ({ selectBannedItem }) => {
    // 차단 모달에 전달해줄 값 설정.
    const modalUsage = {
        usage: 'comment',
    };
    const dispatch = useDispatch();
    const [defaultInputModalState, setDefaultInputModalState] = useState(false); // 차단 등록 모달용 스테이트
    const [searchData, setSearchData] = useState({
        // 검색옵션
        ...initialState.comments.search,
        startDt: moment().startOf('day'),
        endDt: moment().endOf('day'),
    });

    // 검색용 select 값과 store 값을 연결
    const { COMMENT_STATUS_CODE, COMMENT_ORDER_CODE, COMMENT_MEDIA_CODE, COMMENT_SITE_CODE } = useSelector(({ comment }) => ({
        COMMENT_ORDER_CODE: comment.common.COMMENT_ORDER_CODE,
        COMMENT_STATUS_CODE: comment.common.COMMENT_STATUS_CODE,
        COMMENT_MEDIA_CODE: comment.common.COMMENT_MEDIA_CODE,
        COMMENT_SITE_CODE: comment.common.COMMENT_SITE_CODE,
    }));

    /**
     * 검색 옵션 변경
     */
    const handleChangeSearchInput = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };

    /**
     * 검색 날짜 변경 처리
     */
    const handleDateChange = (name, date) => {
        if (name === 'startDt') {
            const startDt = new Date(date);
            const endDt = new Date(searchData.endDt);

            if (startDt > endDt) {
                toast.warning('시작일은 종료일 보다 클 수 없습니다.');
                return;
            }
        } else if (name === 'endDt') {
            const startDt = new Date(searchData.startDt);
            const endDt = new Date(date);

            if (endDt < startDt) {
                toast.warning('종료일은 시작일 보다 작을 수 없습니다.');
                return;
            }
        }

        setSearchData({
            ...searchData,
            [name]: date,
        });
    };

    /**
     * 검색 버튼 처리
     */
    const handleClickSearchButton = () => {
        dispatch(
            changeSearchOption({
                ...searchData,
                startDt: searchData.startDt ? moment(searchData.startDt).format(DB_DATEFORMAT) : '',
                endDt: searchData.endDt ? moment(searchData.endDt).format(DB_DATEFORMAT) : '',
            }),
        );
        dispatch(getCommentList());
    };

    /**
     * 새로고침
     */
    const handleClickReloadButton = () => {
        dispatch(changeSearchOption(initialState.comments.search));
        setSearchData(initialState.comments.search);
        //dispatch(getCommentList());
    };

    /**
     * 차단 모달 완료
     */
    const BlockModalSave = (data) => {
        // console.log(data);
    };

    const handleClickBlockButton = () => {
        if (selectBannedItem.length === 0) {
            messageBox.alert('차단할 댓글을 선택해 주세요.');
            return;
        }
        setDefaultInputModalState(true);
    };

    // const handleCLickDeleteButton = () => {
    //     messageBox.alert('서비스 준비 중입니다.');
    // };

    useEffect(() => {
        // 최초 로딩시 목록 가지고 옴
        dispatch(
            changeSearchOption({
                ...searchData,
                startDt: searchData.startDt ? moment(searchData.startDt).format(DB_DATEFORMAT) : '',
                endDt: searchData.endDt ? moment(searchData.endDt).format(DB_DATEFORMAT) : '',
            }),
        );
        dispatch(getCommentList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <Form className="mb-14">
            <Form.Row>
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput as="select" value={searchData.groupId} onChange={handleChangeSearchInput} name="groupId" id="groupId">
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
                        label="시작일"
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                        className="mr-1"
                        name="startDt"
                        value={searchData.startDt}
                        onChange={(param) => {
                            handleDateChange('startDt', param);
                        }}
                    />
                    <MokaInput
                        as="dateTimePicker"
                        label="종료일"
                        inputProps={{ timeFormat: null, timeDefault: 'end' }}
                        className="ml-1"
                        name="endDt"
                        value={searchData.endDt}
                        onChange={(param) => {
                            handleDateChange('endDt', param);
                        }}
                    />
                </Col>
                <Col xs={2} className="p-0 pr-2 d-flex">
                    <MokaInput as="select" className="mr-1" value={searchData.status} onChange={handleChangeSearchInput} name="status" id="status">
                        <option value="Y">상태전체</option>
                        {COMMENT_STATUS_CODE &&
                            COMMENT_STATUS_CODE.map((status, index) => (
                                <option key={index} value={status.code}>
                                    {status.name}
                                </option>
                            ))}
                    </MokaInput>
                    <MokaInput as="select" className="ml-1" value={searchData.orderType} onChange={handleChangeSearchInput} name="orderType" id="orderType">
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
                    <MokaInput as="select" className="mr-1" value={searchData.memType} onChange={handleChangeSearchInput} name="memType" id="memType">
                        <option value="">전체계정</option>
                        {COMMENT_SITE_CODE &&
                            COMMENT_SITE_CODE.map((item, index) => (
                                <option key={index} value={item.dtlCd}>
                                    {item.cdNm}
                                </option>
                            ))}
                    </MokaInput>
                    <MokaInput as="select" className="ml-1" value={searchData.searchType} onChange={handleChangeSearchInput} name="searchType" id="searchType">
                        <option value="memNm">이름</option>
                        <option value="memId">ID</option>
                        <option value="cont">댓글 내용</option>
                    </MokaInput>
                </Col>
                <Col xs={4} className="p-0 d-flex">
                    <MokaSearchInput className="mr-1 flex-fill" value={searchData.keyword} onChange={handleChangeSearchInput} onSearch={handleClickSearchButton} name="keyword" />
                    <Button variant="negative" className="mr-1 flex-shrink-0" onClick={handleClickReloadButton}>
                        초기화
                    </Button>
                    <AuthButton variant="primary" className="mr-1 flex-shrink-0" onClick={handleClickBlockButton}>
                        등록
                    </AuthButton>
                    {/* <AuthButton variant="negative" className="flex-shrink-0" onClick={handleCLickDeleteButton}>
                        삭제
                    </AuthButton> */}
                </Col>
            </Form.Row>

            {defaultInputModalState && (
                <CommentBlockModal
                    modalUsage={modalUsage}
                    selectBannedItem={selectBannedItem}
                    show={defaultInputModalState}
                    onHide={() => {
                        setDefaultInputModalState(false);
                    }}
                    onSave={(e, i) => {
                        BlockModalSave(e, i);
                    }}
                />
            )}
        </Form>
    );
};

export default CommentSearch;
