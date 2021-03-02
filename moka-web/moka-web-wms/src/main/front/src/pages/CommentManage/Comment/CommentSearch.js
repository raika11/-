import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { MokaInput, MokaSearchInput } from '@components';
import CommentBlockModal from '@pages/CommentManage/CommentModal/CommentBlockModal';
import { initialState, getCommentList, changeSearchOption } from '@store/commentManage';
import toast from '@utils/toastUtil';
import { DB_DATEFORMAT } from '@/constants';
import { messageBox } from '@utils/toastUtil';
import { AuthButton } from '@pages/Auth/AuthButton';

moment.locale('ko');

/**
 * 컨테이너 검색 컴포넌트
 */
const CommentSearch = ({ selectBannedItem }) => {
    // 차단 모달에 전달해줄 값 설정.
    const modalUsage = {
        usage: 'comment',
    };
    const dispatch = useDispatch();
    const [defaultInputModalState, setDefaultInputModalState] = useState(false); // 차단 등록 모달용 스테이트

    // 검색 옵션 설정.
    const [searchData, setSearchData] = useState(initialState.comments.search);

    // 검색용 select 값과 store 값을 연결.
    const { COMMENT_STATUS_CODE, COMMENT_ORDER_CODE, COMMENT_MEDIA_CODE, COMMENT_SITE_CODE } = useSelector((store) => ({
        COMMENT_ORDER_CODE: store.comment.common.COMMENT_ORDER_CODE,
        COMMENT_STATUS_CODE: store.comment.common.COMMENT_STATUS_CODE,
        COMMENT_MEDIA_CODE: store.comment.common.COMMENT_MEDIA_CODE,
        COMMENT_SITE_CODE: store.comment.common.COMMENT_SITE_CODE,
        searchGroupId: store.comment.common.searchGroupId,
        searchStatusList: store.comment.common.searchStatusList,
        searchIdTypeList: store.comment.common.searchIdTypeList,
        searchTypeList: store.comment.common.searchTypeList,
    }));

    // 검색 옵션 변경시 업데이트.
    const handleChangeSearchInput = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };

    // 검색 날짜 변경 처리.
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

    // 검색 버튼 처리.
    const handleClickSearchButton = () => {
        dispatch(changeSearchOption(searchData));
        dispatch(getCommentList());
    };

    // 새로 고침 버튼 처리.
    const handleClickReloadButton = () => {
        dispatch(changeSearchOption(initialState.comments.search));
        setSearchData(initialState.comments.search);
        dispatch(getCommentList());
    };

    // 차단 모달에서 완료시
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

    const handleCLickDeleteButton = () => {
        messageBox.alert('서비스 준비 중입니다.');
    };

    // 최초 로딩시 목록 가지고 옴.
    useEffect(() => {
        dispatch(getCommentList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(initialState.comments.search);
    }, []);

    return (
        <Form className="mb-14">
            <Form.Row>
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput as="select" value={searchData.groupId} onChange={(e) => handleChangeSearchInput(e)} name="groupId" id="groupId">
                        <option value="">전체매체</option>
                        {COMMENT_MEDIA_CODE.map((item, index) => (
                            <option key={index} value={item.dtlCd}>
                                {item.cdNm}
                            </option>
                        ))}
                    </MokaInput>
                </Col>

                <Col xs={2} className="p-0 pr-2 d-flex">
                    <MokaInput
                        as="dateTimePicker"
                        label="시작일"
                        inputProps={{ timeFormat: null }}
                        className="mr-1"
                        name="startDt"
                        value={searchData.startDt}
                        onChange={(param) => {
                            let selectDate = param._d;
                            if (selectDate) {
                                selectDate = moment()
                                    .set('year', selectDate.getFullYear())
                                    .set('month', selectDate.getMonth())
                                    .set('date', selectDate.getDate())
                                    .set('hour', 0)
                                    .set('minute', 0)
                                    .set('seconds', 0)
                                    .format(DB_DATEFORMAT);
                            }

                            handleDateChange('startDt', selectDate);
                        }}
                    />
                    <MokaInput
                        as="dateTimePicker"
                        label="종료일"
                        inputProps={{ timeFormat: null }}
                        className="ml-1"
                        name="endDt"
                        value={searchData.endDt}
                        onChange={(param) => {
                            let selectDate = param._d;

                            if (selectDate) {
                                selectDate = moment()
                                    .set('year', selectDate.getFullYear())
                                    .set('month', selectDate.getMonth())
                                    .set('date', selectDate.getDate())
                                    .set('hour', 23)
                                    .set('minute', 59)
                                    .set('seconds', 59)
                                    .format(DB_DATEFORMAT);
                            }
                            handleDateChange('endDt', selectDate);
                        }}
                    />
                </Col>

                <Col xs={2} className="p-0 pr-2 d-flex">
                    <MokaInput as="select" className="mr-1" value={searchData.status} onChange={(e) => handleChangeSearchInput(e)} name="status" id="status">
                        <option value="Y">상태전체</option>
                        {COMMENT_STATUS_CODE.map((status, index) => (
                            <option key={index} value={status.code}>
                                {status.name}
                            </option>
                        ))}
                    </MokaInput>

                    <MokaInput as="select" className="ml-1" value={searchData.orderType} onChange={(e) => handleChangeSearchInput(e)} name="orderType" id="orderType">
                        <option value="">전체</option>
                        {COMMENT_ORDER_CODE.map((order, index) => (
                            <option key={index} value={order.code}>
                                {order.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>

                <Col xs={2} className="p-0 pr-2 d-flex">
                    <MokaInput as="select" className="mr-1" value={searchData.memType} onChange={(e) => handleChangeSearchInput(e)} name="memType" id="memType">
                        <option value="">전체계정</option>
                        {COMMENT_SITE_CODE.map((item, index) => (
                            <option key={index} value={item.dtlCd}>
                                {item.cdNm}
                            </option>
                        ))}
                    </MokaInput>

                    <MokaInput as="select" className="ml-1" value={searchData.searchType} onChange={(e) => handleChangeSearchInput(e)} name="searchType" id="searchType">
                        <option value="memNm">이름</option>
                        <option value="memId">ID</option>
                        <option value="cont">댓글 내용</option>
                    </MokaInput>
                </Col>
                <Col xs={5} className="p-0 d-flex">
                    <MokaSearchInput
                        value={searchData.keyword}
                        onChange={(e) => handleChangeSearchInput(e)}
                        onSearch={(e) => handleClickSearchButton(e)}
                        name="keyword"
                        className="flex-fill mr-1"
                    />
                    <Button variant="negative" className="flex-shrink-0 mr-1" onClick={() => handleClickReloadButton()}>
                        초기화
                    </Button>
                    <AuthButton variant="primary" className="mr-1 flex-shrink-0" onClick={() => handleClickBlockButton()}>
                        등록
                    </AuthButton>
                    <AuthButton variant="negative" className="flex-shrink-0" onClick={() => handleCLickDeleteButton()}>
                        삭제
                    </AuthButton>
                </Col>
            </Form.Row>

            {defaultInputModalState && (
                <CommentBlockModal
                    ModalUsage={modalUsage}
                    selectBannedItem={selectBannedItem}
                    show={defaultInputModalState}
                    onHide={() => {
                        dispatch(getCommentList());
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
