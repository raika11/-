import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaInput, MokaSearchInput, MokaIcon } from '@components';
import { initialState, changeSearchOption, getEditLogList } from '@store/editLog';
import { messageBox } from '@utils/toastUtil';
import { DB_DATEFORMAT } from '@/constants';

moment.locale('ko');

/**
 * 로그 검색
 */
const EditLogSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector(({ editLog }) => editLog.search);
    const [search, setSearch] = useState(initialState.search);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 시작일 변경
     * @param {object} date moment object
     */
    const handleChangeSD = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, startDt: date });
        } else if (date === '') {
            setSearch({ ...search, startDt: null });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleChangeED = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, endDt: date });
        } else if (date === '') {
            setSearch({ ...search, endDt: null });
        }
    };

    /**
     * 검색조건 초기화
     */
    const handleReset = () => {
        const nt = new Date();
        const dt = moment(nt).format(DB_DATEFORMAT);
        const st = moment(nt).startOf('day').format(DB_DATEFORMAT);
        const ns = { ...initialState.search, startDt: st, endDt: dt };
        setSearch(ns);
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        const ns = {
            ...search,
            startDt: moment(search.startDt).format(DB_DATEFORMAT),
            endDt: moment(search.endDt).format(DB_DATEFORMAT),
            page: 0,
        };
        dispatch(changeSearchOption(ns));
        dispatch(
            getEditLogList({
                search: ns,
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.mesage);
                    }
                },
            }),
        );
    };

    useEffect(() => {
        const startDt = moment(storeSearch.startDt, DB_DATEFORMAT);
        const endDt = moment(storeSearch.endDt, DB_DATEFORMAT);
        setSearch({
            ...storeSearch,
            startDt: startDt.isValid() ? startDt : null,
            endDt: endDt.isValid() ? endDt : null,
        });
    }, [storeSearch]);

    useEffect(() => {
        const nt = new Date();
        const dt = moment(nt).format(DB_DATEFORMAT);
        const st = moment(nt).startOf('day').format(DB_DATEFORMAT);
        const ns = { ...initialState.search, startDt: st, endDt: dt };
        dispatch(changeSearchOption(ns));
        dispatch(
            getEditLogList({
                search: ns,
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.mesage);
                    }
                },
            }),
        );
    }, [dispatch]);

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <Col xs={4} className="p-0 pr-2">
                    <MokaInput as="dateTimePicker" name="startDt" inputProps={{ timeFormat: null }} value={search.startDt} onChange={handleChangeSD} />
                </Col>
                <Col xs={4} className="p-0 pr-2">
                    <MokaInput as="dateTimePicker" name="endDt" inputProps={{ timeFormat: null }} value={search.endDt} onChange={handleChangeED} />
                </Col>
                <Col xs={4} className="p-0">
                    <MokaInput as="select" name="successYn" value={search.successYn} onChange={handleChangeValue}>
                        <option hidden>성공 여부</option>
                        {initialState.successYnList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
            </Form.Row>

            <Form.Row className="mb-14">
                <Col xs={2} className="p-0">
                    <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        {initialState.searchTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={10} className="d-flex p-0 pl-2">
                    <MokaSearchInput name="keyword" className="flex-fill mr-1" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />
                    <Button variant="negative" className="flex-shrink-0" onClick={handleReset}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>

            <div className="d-flex justify-content-end">
                <p className="mb-0 mr-3">
                    <MokaIcon iconName="fas-circle" className="mr-1 color-primary" />
                    성공
                </p>
                <p className="mb-0">
                    <MokaIcon iconName="fas-circle" className="mr-1 color-gray-200" />
                    실패
                </p>
            </div>
        </Form>
    );
};

export default EditLogSearch;
