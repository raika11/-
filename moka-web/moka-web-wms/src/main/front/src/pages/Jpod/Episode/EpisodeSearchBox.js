import React, { useEffect, useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectItem } from '@pages/Jpod/JpodConst';
import { DB_DATEFORMAT } from '@/constants';
import moment from 'moment';
import { initialState, changeEpisodesSearchOption, getEpisodes, getEpisodeGubunChannels, clearEpisodeInfo } from '@store/jpod';
import toast from '@utils/toastUtil';

const EpisodeSearchBox = ({ match }) => {
    const [searchData, setSearchData] = useState(initialState.episode.episodes.search);
    const history = useHistory();
    const dispatch = useDispatch();

    const { channel_list } = useSelector((store) => ({
        channel_list: store.jpod.episode.channel.list,
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
        dispatch(changeEpisodesSearchOption(searchData));
        dispatch(getEpisodes());
    };

    // 초기화 버튼 클릭.
    const handleClickSearchResetButton = () => {
        setSearchData(initialState.episode.episodes.search);
        dispatch(changeEpisodesSearchOption(initialState.episode.episodes.search));
        history.push(`${match.path}`);
        dispatch(getEpisodes());
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

    // 등록 버튼 클릭.
    const handleNewButton = () => {
        history.push(`${match.path}/add`);
        dispatch(clearEpisodeInfo());
    };

    // 최초 로딩시 목록 가져오기.
    useEffect(() => {
        dispatch(getEpisodeGubunChannels()); // 채널 목록.
        dispatch(getEpisodes());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Form>
                <Form.Row className="d-flex mb-3">
                    <Col xs={2}>
                        <MokaInput as="select" name="chnlSeq" id="chnlSeq" value={searchData.chnlSeq} onChange={(e) => handleSearchChange(e)}>
                            <option value="">채널 전체</option>
                            {channel_list.map((item, index) => (
                                <option key={index} value={item.castSrl}>
                                    {item.getCastName}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    <Col xs={3}>
                        <MokaInput
                            as="dateTimePicker"
                            className="mb-0"
                            name="startDt"
                            id="startDt"
                            value={searchData.startDt}
                            onChange={(param) => {
                                const selectDate = param._d;
                                const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                                handleDateChange('startDt', date);
                            }}
                            inputProps={{ timeFormat: null }}
                        />
                    </Col>
                    <Col xs={3}>
                        <MokaInput
                            as="dateTimePicker"
                            className="mb-0"
                            name="endDt"
                            id="endDt"
                            value={searchData.endDt}
                            onChange={(param) => {
                                const selectDate = param._d;
                                const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                                handleDateChange('endDt', date);
                            }}
                            inputProps={{ timeFormat: null }}
                        />
                    </Col>
                    <Col xs={1} className="mr-0">
                        <Button variant="outline-neutral" onClick={() => handleClickSearchResetButton()}>
                            초기화
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="d-flex mb-3">
                    <Col xs={2}>
                        <MokaInput as="select" name="usedYn" id="useYn" value={searchData.usedYn} onChange={(e) => handleSearchChange(e)}>
                            <option>선택</option>
                            {selectItem.usedYn.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    <Col xs={8}>
                        <MokaSearchInput
                            id="keyword"
                            name="keyword"
                            placeholder={'검색어를 입력해 주세요.'}
                            value={searchData.keyword}
                            onChange={(e) => handleSearchChange(e)}
                            onSearch={() => handleClickSearchButton()}
                        />
                    </Col>
                    <Col xs={2} className="mr-0  text-right">
                        <Button variant="positive" onClick={() => handleNewButton()}>
                            에피소드 등록
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        </>
    );
};

export default EpisodeSearchBox;
