import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { MokaInput, MokaSearchInput, useBreakpoint } from '@components';
import CommentBlockModal from '@pages/CommentManage/CommentModal/CommentBlockModal';
import { initialState, getCommentList, changeSearchOption } from '@store/commentManage';
moment.locale('ko');

/**
 * 컨테이너 검색 컴포넌트
 */
const CommentSearch = () => {
    const modalUsage = {
        usage: 'comment',
    };
    const dispatch = useDispatch();
    const [defaultInputModalState, setDefaultInputModalState] = useState(false);
    const [search, setSearch] = useState(initialState.comments.search);
    const [keyword, setKeyword] = useState('');
    const [startDt, setStartDt] = useState(new Date());
    let dayOfMonth = startDt.getDate();
    startDt.setDate(dayOfMonth - 7);
    const [endDt, setEndDt] = useState(new Date());
    const { searchMediaList, searchStatusList, searchOrderList, searchIdTypeList, searchTypeList } = useSelector((store) => ({
        searchMediaList: store.comment.common.searchMediaList,
        searchStatusList: store.comment.common.searchStatusList,
        searchOrderList: store.comment.common.searchOrderList,
        searchIdTypeList: store.comment.common.searchIdTypeList,
        searchTypeList: store.comment.common.searchTypeList,
    }));
    const matchPoints = useBreakpoint();

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
        if (name === 'keyword') {
            setKeyword(value);
        } else {
            setSearch({ ...search, [name]: value });
        }
    };

    const handleChangeStartDt = (date) => {
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

    // const handleClickSymbolSave = (e) => {
    //     console.log(e);
    // };

    return (
        <Form className="mb-3">
            <Form.Row className="flex-wrap">
                <Col
                    xs={12}
                    md={6}
                    className={clsx('p-0', {
                        'pr-2': matchPoints.md || matchPoints.lg,
                    })}
                >
                    <Form.Row>
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput as="select" value={search.searchMedia} className="ft-12" onChange={handleChangeSearchOption} name="searchMedia">
                                {searchMediaList.map((media, index) => (
                                    <option key={index} value={media.id}>
                                        {media.name}
                                    </option>
                                ))}
                            </MokaInput>
                        </Col>
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput
                                as="dateTimePicker"
                                label="시작일"
                                inputProps={{ timeFormat: null, inputClassName: 'ft-12' }}
                                name="startDt"
                                value={startDt}
                                onChange={handleChangeStartDt}
                            />
                        </Col>
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput
                                as="dateTimePicker"
                                label="종료일"
                                inputProps={{ timeFormat: null, inputClassName: 'ft-12' }}
                                name="endDt"
                                value={endDt}
                                onChange={handleChangeEndDt}
                            />
                        </Col>
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput as="select" value={search.searchStatus} onChange={handleChangeSearchOption} name="searchStatus" className="ft-12">
                                {searchStatusList.map((status, index) => (
                                    <option key={index} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </MokaInput>
                        </Col>
                        <Col xs={2} className="p-0">
                            <MokaInput as="select" value={search.searchOrder} onChange={handleChangeSearchOption} name="searchOrder" className="ft-12">
                                {searchOrderList.map((order, index) => (
                                    <option key={index} value={order.id}>
                                        {order.name}
                                    </option>
                                ))}
                            </MokaInput>
                        </Col>
                    </Form.Row>
                </Col>

                <Col
                    xs={12}
                    md={6}
                    className={clsx('p-0', {
                        'pt-2': matchPoints.xs || matchPoints.sm,
                    })}
                >
                    <Form.Row>
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput as="select" value={search.searchIdType} onChange={handleChangeSearchOption} name="searchIdType" className="ft-12">
                                {searchIdTypeList.map((idType, index) => (
                                    <option key={index} value={idType.id}>
                                        {idType.name}
                                    </option>
                                ))}
                            </MokaInput>
                        </Col>
                        <Col xs={2} className="p-0 pr-2">
                            <MokaInput as="select" value={search.searchType} onChange={handleChangeSearchOption} name="searchType" className="ft-12">
                                {searchTypeList.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </MokaInput>
                        </Col>
                        <Col xs={4} className="p-0 pr-2 d-flex">
                            <MokaSearchInput
                                value={keyword}
                                onChange={handleChangeSearchOption}
                                onSearch={handleSearch}
                                name="keyword"
                                className="flex-fill"
                                inputClassName="ft-12"
                                buttonClassName="ft-12"
                            />
                        </Col>
                        <Col xs={4} className="p-0 d-flex justify-content-end">
                            <Button variant="outline-neutral" className="flex-shrink-0 mr-2 ft-12">
                                새로고침
                            </Button>
                            <Button variant="positive" className="mr-2 flex-shrink-0 ft-12" onClick={() => setDefaultInputModalState(true)}>
                                차단등록
                            </Button>
                            <Button variant="negative" className="flex-shrink-0 ft-12" onClick={() => setDefaultInputModalState(true)}>
                                삭제
                            </Button>
                        </Col>
                    </Form.Row>
                </Col>
            </Form.Row>

            {defaultInputModalState && (
                <CommentBlockModal
                    ModalUsage={modalUsage}
                    show={defaultInputModalState}
                    onHide={() => {
                        setDefaultInputModalState(false);
                    }}
                />
            )}
        </Form>
    );
};

export default CommentSearch;
