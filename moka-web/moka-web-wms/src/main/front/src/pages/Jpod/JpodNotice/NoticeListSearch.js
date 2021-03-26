import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaSearchInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import toast from '@utils/toastUtil';
import { initialState, changeJpodNoticeSearchOption, getJpodNoticeList, getJpodChannelList } from '@store/jpod';

/**
 * J팟 관리 - 공지 게시판 검색
 */
const NoticeListSearch = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const storeSearch = useSelector((store) => store.jpod.jpodNotice.search);
    const channelList = useSelector((store) => store.jpod.jpodNotice.channelList);
    const jpodBoard = useSelector((store) => store.jpod.jpodNotice.jpodBoard);
    const [search, setSearch] = useState(initialState.jpodNotice.search);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 검색 날짜 변경 처리.
     * @param {string} name target 이름
     * @param {object} date 날짜 객체
     */
    const handleDateChange = (name, date) => {
        if (name === 'startDt') {
            const diff = moment(date).diff(moment(search.endDt));
            if (diff > 0) {
                toast.warning('시작일은 종료일보다 클 수 없습니다.');
                return;
            }
        } else if (name === 'endDt') {
            const diff = moment(date).diff(moment(search.startDt));
            if (diff < 0) {
                toast.warning('종료일은 시작일보다 작을 수 없습니다.');
                return;
            }
        }

        setSearch({ ...search, [name]: date });
    };

    /**
     * 초기화
     */
    const handleClickReset = () => {
        setSearch({
            ...initialState.jpodNotice.search,
            boardId: jpodBoard.boardId,
            startDt: moment().startOf('day').format(DB_DATEFORMAT),
            endDt: moment().endOf('day').format(DB_DATEFORMAT),
        });
    };

    /**
     * 검색
     */
    const handleClickSearch = () => {
        dispatch(
            getJpodNoticeList(
                changeJpodNoticeSearchOption({
                    ...search,
                    startDt: search.startDt && search.startDt.isValid() ? moment(search.startDt).format(DB_DATEFORMAT) : null,
                    endDt: search.endDt && search.endDt.isValid() ? moment(search.endDt).format(DB_DATEFORMAT) : null,
                    page: 0,
                }),
            ),
        );
    };

    /**
     * 등록
     */
    const handleClickAdd = () => {
        history.push(`${match.path}/add`);
    };

    useEffect(() => {
        let st = moment(storeSearch.startDt, DB_DATEFORMAT);
        if (!st.isValid()) {
            st = null;
        }
        let nt = moment(storeSearch.endDt, DB_DATEFORMAT);
        if (!nt.isValid()) {
            nt = null;
        }
        setSearch({ ...storeSearch, startDt: st, endDt: nt });
    }, [storeSearch]);

    useEffect(() => {
        if (jpodBoard.boardId) {
            dispatch(
                getJpodNoticeList(
                    changeJpodNoticeSearchOption({
                        ...search,
                        boardId: jpodBoard.boardId,
                        startDt: moment().startOf('day').format(DB_DATEFORMAT),
                        endDt: moment().endOf('day').format(DB_DATEFORMAT),
                    }),
                ),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jpodBoard]);

    useEffect(() => {
        dispatch(getJpodChannelList());
    }, [dispatch]);

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <Col xs={5} className="p-0 pr-2 d-flex">
                    <MokaInput
                        as="dateTimePicker"
                        className="mr-2"
                        name="startDt"
                        value={search.startDt}
                        onChange={(date) => {
                            handleDateChange('startDt', date);
                        }}
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                    />
                    <MokaInput
                        as="dateTimePicker"
                        name="endDt"
                        value={search.endDt}
                        onChange={(date) => {
                            handleDateChange('endDt', date);
                        }}
                        inputProps={{ timeFormat: null, timeDefault: 'end' }}
                    />
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="delYn" value={search.delYn} onChange={handleChangeValue}>
                        <option value="N">서비스</option>
                        <option value="Y">삭제</option>
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="channelId" value={search.channelId} onChange={handleChangeValue}>
                        <option value="">J팟 채널 전체</option>
                        {channelList &&
                            channelList.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.name}
                                </option>
                            ))}
                    </MokaInput>
                </Col>
                <Button variant="negative" onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>
            <Form.Row>
                <MokaSearchInput
                    id="keyword"
                    className="mr-1 flex-fill"
                    name="keyword"
                    placeholder="제목, 내용, 등록자 명"
                    value={search.keyword}
                    onChange={handleChangeValue}
                    onSearch={handleClickSearch}
                />
                <Button variant="positive" onClick={handleClickAdd}>
                    등록
                </Button>
            </Form.Row>
        </Form>
    );
};

export default NoticeListSearch;
