import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaInput } from '@components';
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
    const { search: storeSearch, bulkPathName, bulkartDiv, sourceCode } = useSelector((store) => ({
        search: store.bulks.bulkn.search,
        bulkPathName: store.bulks.bulkPathName,
        bulkartDiv: store.bulks.bulkartDiv,
        sourceCode: store.bulks.sourceCode,
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
                    startDt: searchData.startDt ? moment(searchData.startDt).format(DB_DATEFORMAT) : '',
                    endDt: searchData.endDt ? moment(searchData.endDt).format(DB_DATEFORMAT) : '',
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

    useEffect(() => {
        dispatch(getBulkList());
    }, [bulkPathName, bulkartDiv, dispatch, sourceCode]);

    return (
        <>
            <Form.Row className="mb-14">
                <Col xs={3} className="p-0 mr-1">
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="startDt"
                        id="startDt"
                        value={searchData.startDt}
                        // onChange={(e) => handleDateChange('startDt', e)}
                        onChange={(param) => {
                            handleDateChange('startDt', param);
                        }}
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                    />
                </Col>
                <Col xs={3} className="p-0 mr-1">
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="endDt"
                        id="endDt"
                        value={searchData.endDt}
                        onChange={(param) => {
                            handleDateChange('endDt', param);
                        }}
                        inputProps={{ timeFormat: null, timeDefault: 'end' }}
                    />
                </Col>
                <Col xs={2} className="p-0">
                    <Button variant="searching" onClick={() => handleClickSearchButton()}>
                        검색
                    </Button>
                </Col>
                <Col xs={4} className="text-right">
                    <Button variant="positive" onClick={() => handleClickNewButton()}>
                        등록
                    </Button>
                </Col>
            </Form.Row>
        </>
    );
};

BulknListSearchBox.propTypes = propTypes;
BulknListSearchBox.defaultProps = defaultProps;

export default BulknListSearchBox;
