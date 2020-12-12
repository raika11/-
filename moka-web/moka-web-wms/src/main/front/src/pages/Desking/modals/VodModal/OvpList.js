import React, { useEffect, useState, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { initialState, getOvpList, GET_OVP_LIST } from '@store/bright';
import { MokaTable, MokaSearchInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import OvpOptionRenderer from './OvpOptionRenderer';
import columnDefs from './OvpListColumns';

moment.locale('ko');

/**
 * ovp 리스트
 */
const OvpList = ({ show, videoId, options }) => {
    const dispatch = useDispatch();

    const { loading, ovpList } = useSelector((store) => ({
        loading: store.loading[GET_OVP_LIST],
        ovpList: store.bright.ovp.list,
    }));

    const [search, setSearch] = useState(initialState.ovp.search);
    const [rowData, setRowData] = useState([]);
    const [optionsById, setOptionsById] = useState({});
    const [, setGridInstance] = useState(null);

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    const handleSearch = useCallback(
        (type) => {
            let ns = { ...search, page: 0 };
            if (type === 'more') {
                ns = { ...search, page: search.page + 1 };
            }
            dispatch(getOvpList({ search: ns }));
            setSearch(ns);
        },
        [dispatch, search],
    );

    const handleSelectionChanged = (params) => {
        debugger;
        console.log(params);
    };

    useEffect(() => {
        if (show) {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    useEffect(() => {
        setRowData(
            ovpList.map((ovp) => ({
                ...ovp,
                stateText: ovp.state === 'ACTIVE' ? '정상' : '대기',
                regDt: moment(ovp.regDt, DB_DATEFORMAT).format('YYYY-MM-DD\nLTS'),
                videoId,
                options,
            })),
        );
    }, [options, ovpList, videoId]);

    return (
        <div className="positive-relative px-3">
            <Form className="mb-2">
                <Form.Row>
                    <MokaSearchInput
                        placeholder="검색어를 입력하세요"
                        className="flex-fill mr-2"
                        name="keyword"
                        value={search.keyword}
                        onChange={handleChangeValue}
                        onSearch={handleSearch}
                    />
                    <Button variant="negative" className="ft-12" onClick={() => setSearch(initialState.ovp.search)}>
                        초기화
                    </Button>
                </Form.Row>
            </Form>

            <MokaTable
                loading={loading}
                rowData={rowData}
                agGridHeight={340}
                onRowNodeId={(data) => data.id}
                columnDefs={columnDefs}
                paging={false}
                frameworkComponents={{ optionRenderer: OvpOptionRenderer }}
                setGridInstance={setGridInstance}
                onSelectionChanged={handleSelectionChanged}
            />

            <Button variant="white" className="border p-2 rounded-0" block onClick={() => handleSearch('more')}>
                더보기
            </Button>
        </div>
    );
};

export default OvpList;
