import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaSearchInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import { initialState, getPhotoList, changeSearchOption, getArchiveData } from '@store/photoArchive';
import EditThumbOriginDropdown from './EditThumbOriginDropdown';
import EditThumbImageTypeDropdown from './EditThumbImageTypeDropdown';

const periodType = [
    { id: 'all', name: '전체' },
    { id: 'day', name: '오늘' },
    { id: 'week', name: '일주일' },
];

const EditThumbSearch = () => {
    const dispatch = useDispatch();
    const searchKeyList = useSelector((store) => store.photoArchive.searchKeyList);
    const storeSearch = useSelector((store) => store.photoArchive.search);
    const [search, setSearch] = useState(initialState.search);
    const [period, setPeriod] = useState('all');
    const [startDate, setStartDate] = useState(null);
    const [finishDate, setFinishDate] = useState(null);
    // const [timeReady, setTimeReady] = useState(false);
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

    // useEffect(() => {
    //     if (timeReady) {
    //         dispatch(getPhotoList(changeSearchOption(search)));
    //     } else {
    //         dispatch(clearList());
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [timeReady]);
    useEffect(() => {
        dispatch(getArchiveData());
    }, [dispatch]);

    return (
        <Form className="d-flex mb-2">
            <div className="mr-2" style={{ width: 62 }}>
                <MokaInput
                    as="select"
                    value={period}
                    className="ft-12"
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

            <div className="mr-2" style={{ width: 140 }}>
                <MokaInput
                    as="dateTimePicker"
                    inputProps={{ timeFormat: null }}
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

            <div className="mr-2" style={{ width: 140 }}>
                <MokaInput
                    as="dateTimePicker"
                    inputProps={{ timeFormat: null }}
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

            <div className="mr-2 d-flex align-items-center" style={{ width: 160 }}>
                <EditThumbOriginDropdown
                    originValue={search.originCode}
                    onChange={(value) => {
                        if (value.indexOf('all') > -1) {
                            setSearch({ ...search, originCode: 'all' });
                        } else {
                            setSearch({ ...search, originCode: value });
                        }
                        setError({ ...error, originCode: false });
                        // if (value !== '') {
                        //     setTimeReady(true);
                        // }
                    }}
                    isInvalid={error.originCode}
                />
            </div>

            <div className="mr-2 d-flex align-items-center" style={{ width: 160 }}>
                <EditThumbImageTypeDropdown
                    imageValue={search.imageType}
                    onChange={(value) => {
                        if (value.indexOf('All') > -1) {
                            setSearch({ ...search, imageType: 'All' });
                        } else {
                            setSearch({ ...search, imageType: value });
                        }
                        setError({ ...error, imageType: false });
                        // if (value !== '') {
                        //     setTimeReady(true);
                        // }
                    }}
                    isInvalid={error.imageType}
                />
            </div>

            <div className="mr-2" style={{ width: 150 }}>
                <MokaInput as="select" className="mr-2 ft-12" value={search.searchKey} onChange={(e) => setSearch({ ...search, searchKey: e.target.value })}>
                    {searchKeyList.map((key) => (
                        <option key={key.id} value={key.id}>
                            {key.name}
                        </option>
                    ))}
                </MokaInput>
            </div>

            <MokaSearchInput
                className="flex-fill"
                inputClassName="ft-12"
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

export default EditThumbSearch;
