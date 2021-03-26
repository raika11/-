import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import { initialState, changeEpsdSearchOption, getEpsdList, getTotalChnlList } from '@store/jpod';
import toast from '@utils/toastUtil';

/**
 * J팟 관리 > 에피소드 > 목록 > 검색
 */
const EpisodeSearchBox = (props) => {
    const { match } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const { search: storeSearch } = useSelector(({ jpod }) => jpod.episode);
    const channelList = useSelector(({ jpod }) => jpod.totalChannel.list);
    const [searchData, setSearchData] = useState(initialState.episode.search);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchData({ ...searchData, [name]: value });
    };

    /**
     * 검색 날짜 변경
     */
    const handleChangeDate = (name, date) => {
        if (name === 'startDt') {
            const diff = moment(date).diff(moment(searchData.endDt));
            if (diff > 0) {
                toast.warning('시작일은 종료일보다 클 수 없습니다.');
                return;
            }
        } else if (name === 'endDt') {
            const diff = moment(date).diff(moment(searchData.startDt));
            if (diff < 0) {
                toast.warning('종료일은 시작일보다 작을 수 없습니다.');
                return;
            }
        }
        setSearchData({ ...searchData, [name]: date });
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        let ns = {
            ...searchData,
            page: 0,
            startDt: searchData.startDt ? moment(searchData.startDt).format(DB_DATEFORMAT) : '',
            endDt: searchData.endDt ? moment(searchData.endDt).format(DB_DATEFORMAT) : '',
        };

        dispatch(changeEpsdSearchOption(ns));
        dispatch(getEpsdList({ search: ns }));
    };

    /**
     * 검색조건 초기화
     */
    const handleReset = () => {
        dispatch(changeEpsdSearchOption(initialState.episode.search));
    };

    /**
     * 에피소드 등록
     */
    const handleAdd = () => history.push(`${match.path}/add`);

    useEffect(() => {
        let st = moment(storeSearch.startDt, DB_DATEFORMAT);
        if (!st.isValid()) st = null;
        let nt = moment(storeSearch.endDt, DB_DATEFORMAT);
        if (!nt.isValid()) nt = null;

        setSearchData({ ...storeSearch, startDt: st, endDt: nt });
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getTotalChnlList()); // 전체 채널 목록
        dispatch(getEpsdList({ search: searchData }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <div className="mb-14">
            <Form.Row className="mb-2">
                {/* 채널 검색 조건 */}
                <Col className="p-0 pr-2" xs={4}>
                    <MokaInput as="select" name="chnlSeq" id="chnlSeq" value={searchData.chnlSeq} onChange={handleSearchChange}>
                        <option value="">채널 전체</option>
                        {channelList.map((item) => (
                            <option key={item.chnlSeq} value={item.chnlSeq}>
                                {item.chnlNm}
                            </option>
                        ))}
                    </MokaInput>
                </Col>

                {/* 시작일, 종료일 */}
                <Col className="p-0 d-flex pr-2" xs={5}>
                    <MokaInput
                        as="dateTimePicker"
                        className="mr-2 flex-fill"
                        name="startDt"
                        id="startDt"
                        value={searchData.startDt}
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                        onChange={(date) => handleChangeDate('startDt', date)}
                    />
                    <MokaInput
                        as="dateTimePicker"
                        className="flex-fill"
                        name="endDt"
                        id="endDt"
                        value={searchData.endDt}
                        inputProps={{ timeFormat: null, timeDefault: 'end' }}
                        onChange={(date) => handleChangeDate('endDt', date)}
                    />
                </Col>

                {/* 검색조건, 초기화 */}
                <Col className="p-0 d-flex" xs={3}>
                    <MokaInput as="select" name="usedYn" className="mr-2" id="useYn" value={searchData.usedYn} onChange={handleSearchChange}>
                        {initialState.episode.searchTypeList.map((item, index) => (
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInput>
                    <Button variant="negative" className="flex-shrink-0" onClick={handleReset}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>

            <Form.Row>
                <MokaSearchInput
                    id="keyword"
                    className="mr-2 flex-fill"
                    name="keyword"
                    placeholder="에피소드명 / 태그를 입력해 주세요"
                    value={searchData.keyword}
                    onChange={handleSearchChange}
                    onSearch={handleSearch}
                />
                <Button variant="positive" className="flex-shrink-0" onClick={handleAdd}>
                    에피소드 등록
                </Button>
            </Form.Row>
        </div>
    );
};

export default EpisodeSearchBox;
