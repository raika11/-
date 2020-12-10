import React, { useEffect, useState, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { initialState, getOvpList, GET_OVP_LIST } from '@store/bright';
import { MokaLoader, MokaTable, MokaSearchInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import columnDefs from './OvpListColumns';

moment.locale('ko');

const OvpList = ({ show }) => {
    const dispatch = useDispatch();

    const { loading, ovpList } = useSelector((store) => ({
        loading: store.loading[GET_OVP_LIST],
        ovpList: store.bright.ovp.list,
    }));

    const [search, setSearch] = useState(initialState.ovp.search);
    const [rowData, setRowData] = useState([]);

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    const handleSearch = useCallback(() => {
        dispatch(
            getOvpList({
                search,
                callback: (result) => {
                    console.log(result);
                },
            }),
        );
    }, [dispatch, search]);

    useEffect(() => {
        if (show) {
            handleSearch();
        }
    }, [handleSearch, show]);

    useEffect(() => {
        setRowData(
            ovpList.map((ovp) => ({
                ...ovp,
                stateText: ovp.state === 'ACTIVE' ? '정상' : '대기',
                regDt: moment(ovp.regDt, DB_DATEFORMAT).format('YYYY-MM-DD\nLTS'),
            })),
        );
    }, [ovpList]);

    return (
        <div className="positive-relative px-3">
            <Form className="mb-2">
                <Form.Row>
                    <MokaSearchInput placeholder="검색어를 입력하세요" className="flex-fill mr-2" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />
                    <Button variant="negative" className="ft-12">
                        초기화
                    </Button>
                </Form.Row>
            </Form>

            <MokaTable agGridHeight={366} onRowNodeId={(data) => data.id} columnDefs={columnDefs} rowData={rowData} paging={false} />
            {loading && <MokaLoader />}
        </div>
    );
};

export default OvpList;
