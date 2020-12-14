import React, { useState } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaSearchInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import EditThumbSelectDropdown from './EditThumbSelectDropdown';

const periodType = [
    { id: 'all', name: '전체' },
    { id: 'day', name: '오늘' },
    { id: 'week', name: '일주일' },
];

const EditThumbSearch = (props) => {
    const { search, setSearch, onSearch } = props;

    const [period, setPeriod] = useState('all');
    const [startDate, setStartDate] = useState(moment().format(DB_DATEFORMAT));
    const [finishDate, setFinishDate] = useState(moment().format(DB_DATEFORMAT));
    const [error, setError] = useState({});
    const [searchType, setSearchType] = useState('all');
    const [imageTypeList, setImageTypeList] = useState(null);
    const [type, setType] = useState(false);

    // useEffect(() => {
    //     if (type) {
    //         dispatch(getPhotoList({ search: ns }));
    //         dispatch(changeSearchOption(ns));
    //         setError({ ...error, deskingSourceList: false });
    //     } else {
    //         setError({ ...error, deskingSourceList: true });
    //     }
    // }, []);

    return (
        <Form className="d-flex mb-2">
            <div className="mr-2" style={{ width: 62 }}>
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

            <div className="mr-2" style={{ width: 140 }}>
                <MokaInput
                    as="dateTimePicker"
                    inputProps={{ timeFormat: null }}
                    value={startDate}
                    onChange={(date) => {
                        if (typeof date === 'object') {
                            setSearch({
                                ...search,
                                startdate: date,
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
                                finishdate: date,
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

            <div className="mr-2" style={{ width: 150 }}>
                <MokaInput as="select" className="mr-2" value={searchType} onChange={(e) => e.target.value}>
                    <option value="all">전체</option>
                    <option value="addPhoto">등록 사진</option>
                    <option value="addImg">등록 이미지</option>
                    <option value="editImg">지면 편집 이미지</option>
                    <option value="pool">사진 POOL</option>
                    <option value="domestic">제휴 내신</option>
                    <option value="foreign">제휴 외신</option>
                </MokaInput>
            </div>

            <div className="mr-2 d-flex align-items-center" style={{ width: 140 }}>
                <EditThumbSelectDropdown
                // className="mr-2"
                // value={imageTypeList}
                // onChange={(value) => {
                //     setImageTypeList(value);
                //     if (value !== '') {
                //         setType(true);
                //     }
                // }}
                // isInvalid={error.deskingSourceList}
                />
            </div>

            <div className="mr-2" style={{ width: 150 }}>
                <MokaInput as="select" className="mr-2" value={search.searchValue} onChange={(e) => setSearch({ ...search, searchValue: e.target.value })}>
                    <option>전체</option>
                </MokaInput>
            </div>

            <MokaSearchInput
                className="flex-fill"
                value={search.keyword}
                onChange={(e) => {
                    setSearch({
                        ...search,
                        keyword: e.target.value,
                    });
                }}
                onSearch={onSearch}
            />
        </Form>
    );
};

export default EditThumbSearch;
