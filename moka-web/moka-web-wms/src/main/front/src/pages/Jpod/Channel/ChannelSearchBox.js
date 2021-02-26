import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectItem } from '@pages/Jpod/JpodConst';
import { DB_DATEFORMAT } from '@/constants';
import moment from 'moment';
import { initialState, changeJpodSearchOption, getChannels } from '@store/jpod';
import toast from '@utils/toastUtil';

const ChannelSearchBox = ({ match }) => {
    const [searchData, setSearchData] = useState(initialState.channel.jpod.search);
    const history = useHistory();
    const dispatch = useDispatch();

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
            changeJpodSearchOption({
                ...searchData,
                startDt: searchData.startDt ? moment(searchData.startDt).format(DB_DATEFORMAT) : '',
                endDt: searchData.endDt ? moment(searchData.endDt).format(DB_DATEFORMAT) : '',
            }),
        );
        dispatch(getChannels());
    };

    // 초기화 버튼 클릭.
    const handleClickSearchResetButton = () => {
        setSearchData(initialState.channel.jpod.search);
        dispatch(changeJpodSearchOption(initialState.channel.jpod.search));
        // history.push(`${match.path}`);
        // dispatch(getChannels());
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

    // 최초 로딩시 목록 가져오기.
    useEffect(() => {
        dispatch(getChannels());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Form>
                <Form.Row className="d-flex mb-3">
                    <div style={{ width: 160 }} className="pr-2">
                        <MokaInput
                            as="dateTimePicker"
                            className="mb-0"
                            name="startDt"
                            id="startDt"
                            value={searchData.startDt}
                            onChange={(param) => {
                                // const selectDate = param._d;
                                // const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                                handleDateChange('startDt', param);
                            }}
                            inputProps={{ timeFormat: null, timeDefault: 'start' }}
                        />
                    </div>
                    <div style={{ width: 160 }} className="pr-2">
                        <MokaInput
                            as="dateTimePicker"
                            className="mb-0"
                            name="endDt"
                            id="endDt"
                            value={searchData.endDt}
                            onChange={(param) => {
                                // const selectDate = param._d;
                                // const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                                handleDateChange('endDt', param);
                            }}
                            inputProps={{ timeFormat: null, timeDefault: 'end' }}
                        />
                    </div>
                    <div className="mr-1">
                        <MokaInput as="select" name="usedYn" id="useYn" value={searchData.usedYn} onChange={(e) => handleSearchChange(e)} style={{ width: 110 }}>
                            <option value="">전체</option>
                            {selectItem.usedYn.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </MokaInput>
                    </div>
                    <div className="mr-1" style={{ width: 300 }}>
                        <MokaSearchInput
                            id="keyword"
                            name="keyword"
                            placeholder={'검색어를 입력해 주세요.'}
                            value={searchData.keyword}
                            onChange={(e) => handleSearchChange(e)}
                            onSearch={() => handleClickSearchButton()}
                        />
                    </div>
                    <div className="mr-1">
                        <Button variant="negative" onClick={() => handleClickSearchResetButton()}>
                            초기화
                        </Button>
                    </div>
                    <div>
                        <Button variant="positive" onClick={() => handleNewButton()}>
                            등록
                        </Button>
                    </div>
                </Form.Row>
            </Form>
        </>
    );
};

export default ChannelSearchBox;
