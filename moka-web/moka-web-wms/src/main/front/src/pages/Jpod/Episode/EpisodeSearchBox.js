import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { selectItem } from '@pages/Jpod/JpodConst';
import { DB_DATEFORMAT } from '@/constants';
import { initialState, changeEpisodesSearchOption, getEpisodes, getEpisodeGubunChannels, clearEpisodeInfo } from '@store/jpod';
import toast from '@utils/toastUtil';

/**
 * J팟 관리 - 에피소드 리스트 검색
 */
const EpisodeSearchBox = (props) => {
    const { match } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.jpod.episode.episodes.search);
    const channelList = useSelector((store) => store.jpod.episode.channel.list);
    const [searchData, setSearchData] = useState(initialState.episode.episodes.search);

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
        let ns = {
            ...searchData,
            page: 0,
            startDt: searchData.startDt ? moment(searchData.startDt).format(DB_DATEFORMAT) : '',
            endDt: searchData.endDt ? moment(searchData.endDt).format(DB_DATEFORMAT) : '',
        };

        dispatch(changeEpisodesSearchOption(ns));
        dispatch(getEpisodes());
    };

    // 초기화 버튼 클릭.
    const handleClickSearchResetButton = () => {
        setSearchData(initialState.episode.episodes.search);
        dispatch(changeEpisodesSearchOption(initialState.episode.episodes.search));
        history.push(`${match.path}`);
    };

    // 등록 버튼 클릭.
    const handleNewButton = () => {
        dispatch(clearEpisodeInfo());
        history.push(`${match.path}/add`);
    };

    // 최초 로딩시 목록 가져오기.
    useEffect(() => {
        dispatch(getEpisodeGubunChannels()); // 채널 목록.
        dispatch(getEpisodes());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let st = moment(storeSearch.startDt, DB_DATEFORMAT);
        if (!st.isValid()) {
            st = null;
        }
        let nt = moment(storeSearch.endDt, DB_DATEFORMAT);
        if (!nt.isValid()) {
            nt = null;
        }
        setSearchData({ ...storeSearch, startDt: st, endDt: nt });
    }, [storeSearch]);

    useEffect(() => {
        const diff = moment(searchData.endDt).diff(moment(searchData.startDt));
        if (diff < 0) {
            toast.warning('시작일은 종료일 보다 클 수 없습니다.');
            setSearchData({ ...searchData, startDt: moment().format(DB_DATEFORMAT) });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData.startDt, searchData.endDt]);

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <Col className="p-0 pr-2" xs={3}>
                    <MokaInput as="select" name="chnlSeq" id="chnlSeq" value={searchData.chnlSeq} onChange={handleSearchChange}>
                        <option value="">채널 전체</option>
                        {channelList.map((item) => (
                            <option key={item.chnlSeq} value={item.chnlSeq}>
                                {item.chnlNm}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col className="p-0 pr-2 d-flex" xs={5}>
                    <MokaInput
                        as="dateTimePicker"
                        className="mr-2"
                        name="startDt"
                        id="startDt"
                        value={searchData.startDt}
                        inputProps={{ timeFormat: null }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearchData({ ...searchData, startDt: date });
                            } else if (date === '') {
                                setSearchData({ ...searchData, startDt: null });
                            }
                        }}
                    />
                    <MokaInput
                        as="dateTimePicker"
                        name="endDt"
                        id="endDt"
                        value={searchData.endDt}
                        inputProps={{ timeFormat: null }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearchData({ ...searchData, endDt: date });
                            } else if (date === '') {
                                setSearchData({ ...searchData, endDt: null });
                            }
                        }}
                    />
                </Col>
                <Col className="p-0 d-flex" xs={2}>
                    <MokaInput as="select" className="mr-2" name="usedYn" id="useYn" value={searchData.usedYn} onChange={handleSearchChange}>
                        <option value="">사용 여부 전체</option>
                        {selectItem.usedYn.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Button variant="outline-neutral" onClick={handleClickSearchResetButton}>
                    초기화
                </Button>
            </Form.Row>
            <Form.Row>
                <MokaSearchInput
                    id="keyword"
                    className="mr-1 flex-fill"
                    name="keyword"
                    placeholder={'에피소드명 / 태그를 입력해 주세요'}
                    value={searchData.keyword}
                    onChange={handleSearchChange}
                    onSearch={handleClickSearchButton}
                />
                <Button variant="positive" onClick={handleNewButton}>
                    에피소드 등록
                </Button>
            </Form.Row>
        </Form>
    );
};

export default EpisodeSearchBox;
