import React, { useEffect, useState, Suspense } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectItem } from '@pages/Boards/BoardConst';
import { DB_DATEFORMAT } from '@/constants';
import moment from 'moment';
import { initialState, GET_CHANNELS, changeJpodSearchOption, getChannels } from '@store/jpod';
import toast from '@utils/toastUtil';

const ChannelSearchBox = ({ match }) => {
    const [searchData, setSearchData] = useState(initialState.channel.jpod.search);
    const history = useHistory();
    const dispatch = useDispatch();
    const { search } = useSelector((store) => ({
        search: store.jpod.channel.jpod.search,
    }));

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };
    const handleClickSearchButton = () => {
        dispatch(changeJpodSearchOption(searchData));
        dispatch(getChannels());
    };
    const handleClickSearchResetButton = () => {
        setSearchData(initialState.channel.jpod.search);
        dispatch(changeJpodSearchOption(initialState.channel.jpod.search));
        history.push(`${match.path}`);
    };
    const handleNewButton = () => {
        history.push(`${match.path}/add`);
    };
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

    useEffect(() => {
        dispatch(getChannels());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Form>
                <Form.Row className="d-flex mb-3">
                    <Col xs={2}>
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
                    <Col xs={2}>
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
                    <Col xs={2}>
                        <MokaInput as="select" name="usedYn" id="useYn" value={searchData.usedYn} onChange={(e) => handleSearchChange(e)}>
                            <option hidden>선택</option>
                            {selectItem.usedYn.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    <Col xs={4}>
                        <MokaSearchInput
                            id="keyword"
                            name="keyword"
                            placeholder={'검색어를 입력해 주세요.'}
                            value={searchData.keyword}
                            onChange={(e) => handleSearchChange(e)}
                            onSearch={() => handleClickSearchButton()}
                        />
                    </Col>
                    <Col xs={1} className="mr-0">
                        <Button variant="outline-neutral" onClick={() => handleClickSearchResetButton()}>
                            초기화
                        </Button>
                    </Col>
                    <Col xs={1} className="mr-0">
                        <Button variant="positive" onClick={() => handleNewButton()}>
                            채널등록
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        </>
    );
};

export default ChannelSearchBox;
