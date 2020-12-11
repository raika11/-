import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaInput, MokaInputLabel } from '@components';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { changeSearchOption, getBulkList, clearBulksArticle } from '@store/bulks';
import { useHistory } from 'react-router-dom';

const propTypes = {
    HandleEditEnable: PropTypes.func,
};
const defaultProps = {};

// 검색 박스
const BulknListSearchBox = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { search: storeSearch, bulkPathName } = useSelector((store) => ({
        search: store.bulks.search,
        bulkPathName: store.bulks.bulkPathName,
    }));

    // 기본 설정.
    const [searchData, setSearchData] = useState({
        startDt: '',
        endDt: '',
    });

    // 검색 옵션 스테이트 설정.
    const handleDateChange = (name, date) => {
        setSearchData({
            ...searchData,
            [name]: date,
        });
    };

    // 검색 버튼 클릭시 리스트를 다시 가지고 오기.
    const handleClickSearchButton = () => {
        dispatch(
            getBulkList(
                changeSearchOption({
                    ...storeSearch,
                    startDt: searchData.startDt ? moment(searchData.startDt).format('YYYY-MM-DD') : '',
                    endDt: searchData.endDt ? moment(searchData.endDt).format('YYYY-MM-DD') : '',
                }),
            ),
        );
    };

    // 등록 버튼 클릭하면 라우터 이동및 상위 props 에디트 상태 변경 처리.
    const handleClickNewButton = () => {
        props.HandleEditEnable();
        dispatch(clearBulksArticle());
        history.push(`/${bulkPathName}`);
    };

    return (
        <>
            <Form>
                <Form.Row className="mb-3">
                    <Col xs={1} className="d-flex justify-content-center align-items-center">
                        <MokaInputLabel label="기간" labelWidth={50} as="none" value="tempvalue1" className="m-0 pr-3" name="tag" labelClassName="text-center" />
                    </Col>
                    <Col xs={3} className="d-flex justify-content-center align-items-center">
                        <MokaInput
                            as="dateTimePicker"
                            className="mb-0"
                            name="startDt"
                            id="startDt"
                            value={setSearchData.startDt}
                            onChange={(e) => handleDateChange('startDt', e)}
                            inputProps={{ timeFormat: null }}
                        />
                    </Col>
                    <Col xs={3} className="justify-content-center align-items-center pr-0">
                        <MokaInput
                            as="dateTimePicker"
                            className="mb-0"
                            name="endDt"
                            id="endDt"
                            value={setSearchData.endDt}
                            onChange={(e) => handleDateChange('endDt', e)}
                            inputProps={{ timeFormat: null }}
                        />
                    </Col>
                    <Col xs={1} className="justify-content-center align-items-center pr-0">
                        <Button variant="searching" onClick={() => handleClickSearchButton()}>
                            검색
                        </Button>
                    </Col>
                    <Col xs={4} className="justify-content-end align-items-end text-right">
                        <Button variant="positive" onClick={() => handleClickNewButton()}>
                            벌크 문구 등록
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        </>
    );
};

BulknListSearchBox.propTypes = propTypes;
BulknListSearchBox.defaultProps = defaultProps;

export default BulknListSearchBox;
