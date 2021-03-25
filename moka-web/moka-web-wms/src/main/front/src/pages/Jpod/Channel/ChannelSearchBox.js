import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DB_DATEFORMAT } from '@/constants';
import moment from 'moment';
import { initialState, changeChnlSearchOption, getChnlList } from '@store/jpod';
import toast from '@utils/toastUtil';

/**
 * J팟관리 > 채널 > 검색
 */
const ChannelSearchBox = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const storeSearch = useSelector(({ jpod }) => jpod.channel.search);
    const [searchData, setSearchData] = useState(initialState.channel.search);

    /**
     * 입력값 변경
     * @param {object} 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        const startDt = moment(searchData.startDt).isValid() ? moment(searchData.startDt).format(DB_DATEFORMAT) : null;
        const endDt = moment(searchData.endDt).isValid() ? moment(searchData.endDt).format(DB_DATEFORMAT) : null;

        const ns = {
            ...searchData,
            startDt,
            endDt,
        };

        dispatch(changeChnlSearchOption(ns));
        dispatch(getChnlList({ search: ns }));
    };

    /**
     * 검색조건 초기화
     */
    const handleReset = () => {
        dispatch(changeChnlSearchOption(initialState.channel.search));
    };

    /**
     * 채널 등록
     */
    const handleAdd = () => history.push(`${match.path}/add`);

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

    useEffect(() => {
        let ssd = moment(storeSearch.startDt, DB_DATEFORMAT);
        if (!ssd.isValid()) ssd = null;
        let esd = moment(storeSearch.endDt, DB_DATEFORMAT);
        if (!esd.isValid()) esd = null;

        setSearchData({
            ...storeSearch,
            startDt: ssd,
            endDt: esd,
        });
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getChnlList({ search: searchData }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <Form.Row className="mb-14">
            {/* 시작일, 종료일 */}
            <div style={{ width: 160 }} className="mr-2">
                <MokaInput
                    as="dateTimePicker"
                    name="startDt"
                    id="startDt"
                    value={searchData.startDt}
                    onChange={(date) => handleChangeDate('startDt', date)}
                    inputProps={{ timeFormat: null, timeDefault: 'start', style: { width: 160 } }}
                />
            </div>
            <div style={{ width: 160 }} className="mr-2">
                <MokaInput
                    as="dateTimePicker"
                    name="endDt"
                    id="endDt"
                    value={searchData.endDt}
                    onChange={(date) => handleChangeDate('endDt', date)}
                    inputProps={{ timeFormat: null, timeDefault: 'end' }}
                />
            </div>

            {/* 검색 조건 */}
            <div className="flex-shrink-0 mr-2">
                <MokaInput as="select" name="usedYn" id="useYn" value={searchData.usedYn} onChange={handleSearch}>
                    {initialState.channel.searchTypeList.map((item, index) => (
                        <option key={index} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </MokaInput>
            </div>

            {/* 검색어 */}
            <MokaSearchInput
                id="keyword"
                name="keyword"
                placeholder="검색어를 입력하세요"
                value={searchData.keyword}
                className="mr-1 flex-fill"
                onChange={handleChangeValue}
                onSearch={handleSearch}
            />

            {/* 버튼 */}
            <Button variant="negative" className="mr-1 flex-shrink-0" onClick={handleReset}>
                초기화
            </Button>
            <Button variant="positive" className="flex-shrink-0" onClick={handleAdd}>
                등록
            </Button>
        </Form.Row>
    );
};

export default ChannelSearchBox;
