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
    { id: 'all', name: '전체' },
    { id: 'day', name: '오늘' },
    { id: 'week', name: '일주일' },
];

/**
 * 포토 아카이브 검색
 */
const ArchiveSearch = () => {
    const dispatch = useDispatch();
    const searchKeyList = useSelector((store) => store.photoArchive.searchKeyList);
    const storeSearch = useSelector((store) => store.photoArchive.search);
    const [search, setSearch] = useState(initialState.search);
    const [period, setPeriod] = useState('all');
    const [startDate, setStartDate] = useState(null);
    const [finishDate, setFinishDate] = useState(null);
    const [error, setError] = useState({});

    /**
     * 검색
     */
    const handleSearch = () => {
        dispatch(
            getPhotoList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getArchiveData());
    }, [dispatch]);

    return (
        <Form className="d-flex mb-14">
            <div className="mr-2 flex-shrink-0">
                <MokaInput
                    as="select"
                    value={period}
                    onChange={(e) => {
                        setPeriod(e.target.value);

                        if (e.target.value === 'day') {
                            setStartDate(moment().format(DB_DATEFORMAT));
                            setFinishDate(moment().format(DB_DATEFORMAT));
                        } else if (e.target.value === 'week') {
                            setStartDate(moment().subtract(7, 'd').format(DB_DATEFORMAT));
                            setFinishDate(moment().add(7, 'd').format(DB_DATEFORMAT));
                        } else {
                            setStartDate(moment(search.startdate, DB_DATEFORMAT));
                            setFinishDate(moment(search.finishdate, DB_DATEFORMAT));
                        }
                    }}
                >
                    {periodType.map((period) => (
                        <option key={period.id} value={period.id}>
                            {period.name}
                        </option>
                    ))}
                </MokaInput>
            </div>

            <div className="mr-2">
                <MokaInput
                    as="dateTimePicker"
                    inputProps={{ timeFormat: null, width: 145 }}
                    value={startDate}
                    onChange={(date) => {
                        if (typeof date === 'object') {
                            setSearch({
                                ...search,
                                startdate: moment(date).format('YYYYMMDD'),
                            });
                        } else {
                            setSearch({
                                ...search,
                                startdate: null,
                            });
                        }
                    }}
                />
            </div>

            <div className="mr-2">
                <MokaInput
                    as="dateTimePicker"
                    inputProps={{ timeFormat: null, width: 145 }}
                    value={finishDate}
                    onChange={(date) => {
                        if (typeof date === 'object') {
                            setSearch({
                                ...search,
                                finishdate: moment(date).format('YYYYMMDD'),
                            });
                        } else {
                            setSearch({
                                ...search,
                                finishdate: null,
                            });
                        }
                    }}
                />
            </div>

            <div className="mr-2">
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
