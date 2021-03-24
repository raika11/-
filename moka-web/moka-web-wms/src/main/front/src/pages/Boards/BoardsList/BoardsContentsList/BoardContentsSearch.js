import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import { initialState, changeListMenuSearchOption, getListMenuContentsList } from '@store/board';
// import toast from '@utils/toastUtil';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 글 목록 검색
 */
const BoardContentsSearch = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { boardId } = useParams();
    const pagePathName = useSelector((store) => store.board.pagePathName);
    const selectBoard = useSelector((store) => store.board.listMenu.selectBoard);
    const storeSearch = useSelector((store) => store.board.listMenu.contentsList.search);

    const [search, setSearch] = useState(initialState.listMenu.contentsList.search);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 검색 버튼
     */
    const handleClickSearch = () => {
        let ns = {
            ...search,
            startDt: search.startDt && search.startDt.isValid() ? moment(search.startDt).format(DB_DATEFORMAT) : null,
            endDt: search.endDt && search.endDt.isValid() ? moment(search.endDt).format(DB_DATEFORMAT) : null,
            page: 0,
        };
        dispatch(changeListMenuSearchOption(ns));
        dispatch(getListMenuContentsList(boardId));
    };

    /**
     * 초기화 버튼
     */
    const handleClickReset = () => {
        dispatch(changeListMenuSearchOption());
    };

    /**
     * 등록 버튼
     */
    const handleClickAdd = () => {
        // dispatch(clearListMenuContentsInfo());
        history.push(`/${pagePathName}/${boardId}/add`);
    };

    // const handleDateChange = (name, date) => {
    //     if (name === 'startDt') {
    //         const startDt = new Date(date);
    //         const endDt = new Date(search.endDt);

    //         if (startDt > endDt) {
    //             toast.warning('시작일은 종료일 보다 클 수 없습니다.');
    //             return;
    //         }
    //     } else if (name === 'endDt') {
    //         const startDt = new Date(search.startDt);
    //         const endDt = new Date(date);

    //         if (endDt < startDt) {
    //             toast.warning('종료일은 시작일 보다 작을 수 없습니다.');
    //             return;
    //         }
    //     }

    //     setSearch({
    //         ...search,
    //         [name]: date,
    //     });
    // };

    useEffect(() => {
        let startDt = moment(storeSearch.startDt, DB_DATEFORMAT);
        if (!startDt.isValid()) startDt = null;
        let endDt = moment(storeSearch.endDt, DB_DATEFORMAT);
        if (!endDt.isValid()) endDt = null;

        setSearch({
            ...storeSearch,
            startDt,
            endDt,
        });
    }, [storeSearch]);

    useEffect(() => {
        // 마운트 시 현재 날짜로 게시글 목록 검색
        const date = new Date();
        const startDt = moment(date).startOf('day').format(DB_DATEFORMAT);
        const endDt = moment(date).endOf('day').format(DB_DATEFORMAT);
        const ns = { ...initialState.listMenu.contentsList.search, startDt, endDt };
        if (boardId) {
            dispatch(changeListMenuSearchOption(ns));
            dispatch(getListMenuContentsList(boardId));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardId]);

    return (
        <Form className="mb-14">
            {/* 날짜 */}
            <Form.Row className="d-flex mb-2 mr-0">
                <Col xs={5} className="p-0 pr-2 d-flex">
                    {/* 시작 날짜 */}
                    <MokaInput
                        as="dateTimePicker"
                        className="mr-1"
                        name="startDt"
                        id="startDt"
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

                    {/* 종료 날짜 */}
                    <MokaInput
                        as="dateTimePicker"
                        className="ml-1"
                        name="endDt"
                        id="endDt"
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

                {/* 게시판 노출 여부 */}
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput as="select" name="delYn" id="delYn" value={search.delYn} onChange={handleChangeValue}>
                        <option value="">전체</option>
                        <option value="N">노출</option>
                        <option value="Y">삭제</option>
                    </MokaInput>
                </Col>

                {selectBoard?.titlePrefixNm1 && (
                    // 첫번째 분류가 있으면
                    <MokaInput className="mr-2" as="select" name="titlePrefix1" id="titlePrefix1" value={search.titlePrefix1} onChange={handleChangeValue}>
                        <option value="">{selectBoard.titlePrefixNm1}</option>
                        {selectBoard.titlePrefix1
                            .replaceAll(' ', '')
                            .split(',')
                            .map((i, idx) => (
                                <option key={idx} value={i}>
                                    {i}
                                </option>
                            ))}
                    </MokaInput>
                )}

                {selectBoard?.titlePrefixNm2 && (
                    // 두번째 분류가 있으면
                    <MokaInput className="mr-2" as="select" name="titlePrefix2" id="titlePrefix2" value={search.titlePrefix2} onChange={handleChangeValue}>
                        <option value="">{selectBoard.titlePrefixNm2}</option>
                        {selectBoard.titlePrefix2
                            .replaceAll(' ', '')
                            .split(',')
                            .map((i, idx) => (
                                <option key={idx} value={i}>
                                    {i}
                                </option>
                            ))}
                    </MokaInput>
                )}

                {/* 검색 옵션 리셋 */}
                <Button className="flex-shrink-0" variant="negative" onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>

            <Form.Row>
                {/* 채널 선택 */}
                <MokaSearchInput
                    id="keyword"
                    name="keyword"
                    className="mr-1 flex-fill"
                    placeholder={'제목, 내용, 등록자 명'}
                    value={search.keyword}
                    onChange={handleChangeValue}
                    onSearch={handleClickSearch}
                />

                {/* 게시글 등록 버튼 */}
                <Button variant="positive" onClick={handleClickAdd}>
                    등록
                </Button>
            </Form.Row>
        </Form>
    );
};

export default BoardContentsSearch;
