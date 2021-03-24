import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaSearchInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import { initialState, changeJpodNoticeSearchOption, getJpodNotice } from '@store/jpod';
import toast from '@utils/toastUtil';

/**
 * J팟 관리 - 공지 게시판 검색
 */
const NoticeListSearch = ({ match }) => {
    const [searchData, setSearchData] = useState(initialState.jpodNotice.jpodNotices.search);
    const history = useHistory();
    const dispatch = useDispatch();
    const [channelLists, setChannelLists] = useState([]); // 채널 선택.

    const { channelList, selectBoard } = useSelector((store) => ({
        channelList: store.jpod.jpodNotice.channelList,
        selectBoard: store.jpod.jpodNotice.selectBoard,
    }));

    // 검색 항목 변경시 스테이트 업데이트.
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };

    // 검색 버튼 처리.
    const handleClickSearchButton = () => {
        dispatch(
            changeJpodNoticeSearchOption({
                ...searchData,
                startDt: searchData.startDt ? moment(searchData.startDt).format(DB_DATEFORMAT) : '',
                endDt: searchData.endDt ? moment(searchData.endDt).format(DB_DATEFORMAT) : '',
            }),
        );
        dispatch(getJpodNotice());
    };

    // 초기화 버튼 클릭.
    const handleClickSearchResetButton = () => {
        setSearchData(initialState.jpodNotice.jpodNotices.search);
        dispatch(changeJpodNoticeSearchOption(initialState.jpodNotice.jpodNotices.search));
    };

    // 등록 버튼
    const handleNewButton = () => {
        history.push(`${match.path}/add`);
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

    // 검색 및 본문에 작성시 필요한 J팟 채널 목록 설정.
    useEffect(() => {
        setChannelLists(channelList);
    }, [channelList]);

    // 공지 목록 가지고 오기.
    useEffect(() => {
        if (selectBoard.boardId) {
            dispatch(getJpodNotice());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectBoard]);

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <Col xs={5} className="p-0 pr-2 d-flex">
                    <MokaInput
                        as="dateTimePicker"
                        className="mr-2"
                        name="startDt"
                        id="startDt"
                        value={searchData.startDt}
                        onChange={(param) => {
                            handleDateChange('startDt', param);
                        }}
                        inputProps={{ timeFormat: null }}
                    />
                    <MokaInput
                        as="dateTimePicker"
                        name="endDt"
                        id="endDt"
                        value={searchData.endDt}
                        onChange={(param) => {
                            handleDateChange('endDt', param);
                        }}
                        inputProps={{ timeFormat: null }}
                    />
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="usedYn" id="useYn" value={searchData.usedYn} onChange={(e) => handleSearchChange(e)}>
                        <option value={`Y`}>{`서비스`}</option>
                        <option value={`N`}>{`삭제`}</option>
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="channelId" id="channelId" value={searchData.channelId} onChange={(e) => handleSearchChange(e)}>
                        <option value="">j팟 채널 전체</option>
                        {channelLists.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Button variant="negative" onClick={() => handleClickSearchResetButton()}>
                    초기화
                </Button>
            </Form.Row>
            <Form.Row>
                <MokaSearchInput
                    id="keyword"
                    className="mr-1 flex-fill"
                    name="keyword"
                    placeholder={'제목, 내용, 등록자 명'}
                    value={searchData.keyword}
                    onChange={(e) => handleSearchChange(e)}
                    onSearch={() => handleClickSearchButton()}
                />
                <Button variant="positive" onClick={() => handleNewButton()}>
                    등록
                </Button>
            </Form.Row>
        </Form>
    );
};

export default NoticeListSearch;
