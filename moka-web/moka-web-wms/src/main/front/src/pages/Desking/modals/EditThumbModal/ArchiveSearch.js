import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaSearchInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import { initialState, getPhotoList, changeSearchOption, getArchiveData } from '@store/photoArchive';
import ArchiveOriginDropdown from './ArchiveOriginDropdown';
import ArchiveTypeDropdown from './ArchiveTypeDropdown';

const periodType = [
    { id: 'day', name: '오늘' },
    { id: 'week', name: '일주일' },
];

/**
 * 포토 아카이브 검색
 */
const ArchiveSearch = () => {
    const dispatch = useDispatch();
    const { searchKeyList, search: storeSearch } = useSelector(({ photoArchive }) => photoArchive);
    const [search, setSearch] = useState(initialState.search);
    const [period, setPeriod] = useState('all');
    const [error, setError] = useState({});

    /**
     * 검색
     */
    const handleSearch = () => {
        const startdate = search.startdate && search.startdate.isValid() ? moment(search.startdate).format(DB_DATEFORMAT) : null;
        const finishdate = search.finishdate && search.finishdate.isValid() ? moment(search.finishdate).format(DB_DATEFORMAT) : null;
        dispatch(
            getPhotoList(
                changeSearchOption({
                    ...search,
                    startdate,
                    finishdate,
                    page: 0,
                }),
            ),
        );
    };

    /**
     * 기간 변경
     * @param {object} e 이벤트
     */
    const handleChangePeriod = (e) => {
        setPeriod(e.target.value);
        const nt = new Date();
        let startdate,
            finishdate = moment(nt).endOf('day');

        if (e.target.value === 'day') {
            startdate = moment(nt).startOf('day');
        } else if (e.target.value === 'week') {
            startdate = moment(nt).subtract(7, 'days').startOf('day');
        }
        setSearch({ ...search, startdate, finishdate });
    };

    /**
     * 시작일 변경
     * @param {object} date moment object
     */
    const handleChangeSDate = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, startdate: date });
            if (error.startdate) setError({ ...error, startdate: false });
        } else if (date === '') {
            setSearch({ ...search, startdate: null });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleChangeEDate = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, finishdate: date });
            if (error.finishdate) setError({ ...error, finishdate: false });
        } else if (date === '') {
            setSearch({ ...search, finishdate: null });
        }
    };

    useEffect(() => {
        let ssd = moment(storeSearch.startdate, DB_DATEFORMAT);
        if (!ssd.isValid()) ssd = null;
        let esd = moment(storeSearch.finishdate, DB_DATEFORMAT);
        if (!esd.isValid()) esd = null;

        setSearch({
            ...storeSearch,
            startdate: ssd,
            finishdate: esd,
        });
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getArchiveData());
    }, [dispatch]);

    return (
        <Form className="d-flex mb-14">
            <div className="mr-2 flex-shrink-0">
                <MokaInput as="select" value={period} onChange={handleChangePeriod}>
                    {periodType.map((period) => (
                        <option key={period.id} value={period.id}>
                            {period.name}
                        </option>
                    ))}
                </MokaInput>
            </div>

            <div className="mr-2">
                <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, width: 145 }} value={search.startdate} onChange={handleChangeSDate} />
            </div>

            <div className="mr-2">
                <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, width: 145 }} value={search.finishdate} onChange={handleChangeEDate} />
            </div>

            <div className="mr-2" style={{ width: 180 }}>
                <ArchiveOriginDropdown
                    originValue={search.originCode}
                    onChange={(value) => {
                        if (value.indexOf('all') > -1) {
                            setSearch({ ...search, originCode: 'all' });
                        } else {
                            setSearch({ ...search, originCode: value });
                        }
                        setError({ ...error, originCode: false });
                    }}
                    isInvalid={error.originCode}
                />
            </div>

            <div className="mr-2" style={{ width: 160 }}>
                <ArchiveTypeDropdown
                    imageValue={search.imageType}
                    onChange={(value) => {
                        if (value.indexOf('All') > -1) {
                            setSearch({ ...search, imageType: 'All' });
                        } else {
                            setSearch({ ...search, imageType: value });
                        }
                        setError({ ...error, imageType: false });
                    }}
                    isInvalid={error.imageType}
                />
            </div>

            <div className="mr-2 flex-shrink-0">
                <MokaInput as="select" value={search.searchKey} onChange={(e) => setSearch({ ...search, searchKey: e.target.value })}>
                    {searchKeyList.map((key) => (
                        <option key={key.id} value={key.id}>
                            {key.name}
                        </option>
                    ))}
                </MokaInput>
            </div>

            <MokaSearchInput
                className="flex-fill"
                value={search.searchValue}
                onChange={(e) => {
                    setSearch({
                        ...search,
                        searchValue: e.target.value,
                    });
                }}
                onSearch={handleSearch}
            />
        </Form>
    );
};

export default ArchiveSearch;
