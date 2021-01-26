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
    const { COMMENT_STATUS_CODE, COMMENT_ORDER_CODE, searchGroupId, searchIdTypeList, searchTypeList } = useSelector((store) => ({
        COMMENT_ORDER_CODE: store.app.COMMENT_ORDER_CODE,
        COMMENT_STATUS_CODE: store.app.COMMENT_STATUS_CODE,
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
        dispatch(getCommentList());
    };

    // 차단 모달에서 완료시
    const BlockModalSave = (data) => {
        console.log(data);
    };

    // 최초 로딩시 목록 가지고 옴.
    useEffect(() => {
        dispatch(getCommentList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form className="mb-3">
            <Form.Row>
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput as="select" value={searchData.groupId} onChange={(e) => handleChangeSearchInput(e)} name="groupId" id="groupId">
                        <option value="">전체매체</option>
                        {searchGroupId.map((media, index) => (
                            <option key={index} value={media.id}>
                                {media.name}
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
                            const selectDate = param._d;
                            const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            handleDateChange('startDt', date);
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
                            const selectDate = param._d;
                            const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            handleDateChange('endDt', date);
                        }}
                    />
                </Col>

                <Col xs={2} className="p-0 pr-2 d-flex">
                    <MokaInput as="select" className="mr-1" value={searchData.status} onChange={(e) => handleChangeSearchInput(e)} name="status" id="status">
                        <option value="">상태전체</option>
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
                        {searchIdTypeList.map((idType, index) => (
                            <option key={index} value={idType.id}>
                                {idType.name}
                            </option>
                        ))}
                    </MokaInput>

                    <MokaInput as="select" className="ml-1" value={searchData.searchType} onChange={(e) => handleChangeSearchInput(e)} name="searchType" id="searchType">
                        <option value="">전체</option>
                        {searchTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={5} className="p-0 d-flex">
                    <MokaSearchInput
                        value={searchData.keyword}
                        onChange={(e) => handleChangeSearchInput(e)}
                        onSearch={(e) => handleClickSearchButton(e)}
                        name="keyword"
                        className="flex-fill mr-2"
                    />
                    <Button variant="outline-neutral" className="flex-shrink-0 mr-2" onClick={() => handleClickReloadButton()}>
                        새로고침
                    </Button>
                    <Button variant="positive" className="mr-2 flex-shrink-0" onClick={() => setDefaultInputModalState(true)}>
                        차단등록
                    </Button>
                    <Button variant="negative" className="flex-shrink-0" onClick={() => setDefaultInputModalState(true)}>
                        삭제
                    </Button>
                </Col>
            </Form.Row>

            {defaultInputModalState && (
                <CommentBlockModal
                    ModalUsage={modalUsage}
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
