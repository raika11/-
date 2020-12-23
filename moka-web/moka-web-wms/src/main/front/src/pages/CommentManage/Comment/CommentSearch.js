import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';

import moment from 'moment';

import { initialState, getCommentList, changeSearchOption } from '@store/commentManage/comment';

/**
 * 컨테이너 검색 컴포넌트
 */
const CommentSearch = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState(initialState.search);
    const [keyword, setKeyword] = useState('');
    const [startDt, setStartDt] = useState(new Date());
    let dayOfMonth = startDt.getDate();
    startDt.setDate(dayOfMonth - 7);
    const [endDt, setEndDt] = useState(new Date());
    const { searchMediaList, searchStatusList, searchOrderList, searchIdTypeList, searchTypeList } = useSelector((store) => ({
        searchMediaList: store.comment.searchMediaList,
        searchStatusList: store.comment.searchStatusList,
        searchOrderList: store.comment.searchOrderList,
        searchIdTypeList: store.comment.searchIdTypeList,
        searchTypeList: store.comment.searchTypeList,
    }));

    useEffect(() => {
        dispatch(
            getCommentList(
                changeSearchOption({
                    ...search,
                    keyword: keyword,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, keyword, search]);

    const handleSearch = useCallback(() => {
        dispatch(
            getCommentList(
                changeSearchOption({
                    ...search,
                    keyword: keyword,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, keyword, search]);

    /**
     * 검색 옵션 변경
     * @param {*} e 이벤트
     */
    const handleChangeSearchOption = ({ name, value }) => {
        if (name === 'searchMedia') {
            setSearch({
                ...search,
                searchMedia: value,
            });
        } else if (name === 'searchStatus') {
            setSearch({
                ...search,
                searchStatus: value,
            });
        } else if (name === 'searchOrder') {
            setSearch({
                ...search,
                searchOrder: value,
            });
        } else if (name === 'searchIdType') {
            setSearch({
                ...search,
                searchIdType: value,
            });
        } else if (name === 'searchType') {
            setSearch({
                ...search,
                searchType: value,
            });
        } else if (name === 'keyword') {
            setKeyword(value);
        }
    };

    const handleChangeStartDt = (date) => {
        console.log(date);
        const dateTime = moment(date).format('YYYY-MM-DD');
        if (typeof date === 'object') {
            setSearch({
                ...search,
                startDt: dateTime,
            });
            setStartDt(dateTime);
        }
    };

    const handleChangeEndDt = (date) => {
        const dateTime = moment(date).format('YYYY-MM-DD');
        if (typeof date === 'object') {
            setSearch({
                ...search,
                endDt: dateTime,
            });
            setEndDt(dateTime);
        }
    };

    return (
        <Form className="mb-10">
            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                <MokaInput as="select" value={search.searchMedia} onChange={handleChangeSearchOption} name="searchMedia">
                    {searchMediaList.map((media) => (
                        <option key={media.id} value={media.id}>
                            {media.name}
                        </option>
                    ))}
                </MokaInput>
            </div>
            <div className="mr-10 d-inline-block" style={{ width: 146 }}>
                <MokaInput
                    as="dateTimePicker"
                    label="시작일"
                    inputProps={{ dateFormat: 'YYYY-MM-DD', timeFormat: '' }}
                    name="startDt"
                    value={startDt}
                    onChange={handleChangeStartDt}
                />
            </div>
            <div className="mr-10 d-inline-block" style={{ width: 146 }}>
                <MokaInput as="dateTimePicker" label="종료일" inputProps={{ dateFormat: 'YYYY-MM-DD', timeFormat: '' }} name="endDt" value={endDt} onChange={handleChangeEndDt} />
            </div>
            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                <MokaInput as="select" value={search.searchStatus} onChange={handleChangeSearchOption} name="searchStatus">
                    {searchStatusList.map((status) => (
                        <option key={status.id} value={status.id}>
                            {status.name}
                        </option>
                    ))}
                </MokaInput>
            </div>
            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                <MokaInput as="select" value={search.searchOrder} onChange={handleChangeSearchOption} name="searchOrder">
                    {searchOrderList.map((order) => (
                        <option key={order.id} value={order.id}>
                            {order.name}
                        </option>
                    ))}
                </MokaInput>
            </div>
            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                <MokaInput as="select" value={search.searchIdType} onChange={handleChangeSearchOption} name="searchIdType">
                    {searchIdTypeList.map((idType) => (
                        <option key={idType.id} value={idType.id}>
                            {idType.name}
                        </option>
                    ))}
                </MokaInput>
            </div>
            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                <MokaInput as="select" value={search.searchType} onChange={handleChangeSearchOption} name="searchType">
                    {searchTypeList.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </MokaInput>
            </div>
            <div className="mr-10 d-inline-block">
                <MokaSearchInput value={keyword} onChange={handleChangeSearchOption} onSearch={handleSearch} name="keyword" />
            </div>
            <div className="d-inline-block">
                <Button variant="outline-neutral" className="d-flex">
                    새로고침
                </Button>
            </div>
            <div className="d-inline-block float-right">
                <Button variant="positive" className="mr-2">
                    차단등록
                </Button>
                <Button variant="negative" className="mr-2">
                    삭제
                </Button>
            </div>
        </Form>
    );
};

export default CommentSearch;
