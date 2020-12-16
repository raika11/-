import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaInput, MokaInputLabel } from '@components';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { changeSearchOption, getBulkList, clearBulksArticle } from '@store/bulks';
import { useHistory } from 'react-router-dom';
import { DB_DATEFORMAT } from '@/constants';
import toast from '@utils/toastUtil';

const propTypes = {
    HandleEditEnable: PropTypes.func,
};
const defaultProps = {};

// 검색 박스
const BulknListSearchBox = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { search: storeSearch, bulkPathName } = useSelector((store) => ({
        search: store.bulks.bulkn.search,
        bulkPathName: store.bulks.bulkPathName,
    }));

    // 기본 설정.
    const [searchData, setSearchData] = useState({
        startDt: storeSearch.startDt,
        endDt: storeSearch.endDt,
    });

    // 검색 옵션 스테이트 설정.
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

    // 검색 버튼 클릭시 리스트를 다시 가지고 오기.
    const handleClickSearchButton = () => {
        dispatch(
            getBulkList(
                changeSearchOption({
                    ...storeSearch,
                    startDt: searchData.startDt ? moment(searchData.startDt).format('YYYY-MM-DD 00:00:00') : '',
                    endDt: searchData.endDt ? moment(searchData.endDt).format('YYYY-MM-DD 23:59:00') : '',
                }),
            ),
        );
    };

    // 등록 버튼 클릭하면 라우터 이동및 상위 props 에디트 상태 변경 처리.
    const handleClickNewButton = () => {
        props.HandleEditEnable();
        dispatch(clearBulksArticle());
        history.push(`/${bulkPathName}/add`);
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
                            value={searchData.startDt}
                            // onChange={(e) => handleDateChange('startDt', e)}
                            onChange={(param) => {
                                const selectDate = param._d;
                                const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                                handleDateChange('startDt', date);
                            }}
                            inputProps={{ timeFormat: null }}
                        />
                    </Col>
                    <Col xs={3} className="justify-content-center align-items-center pr-0">
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