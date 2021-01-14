import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import { ITEM_AP } from '@/constants';
import { MokaCard, MokaInput, MokaSearchInput, MokaTable } from '@components';
import {
    initialState,
    getArticlePageLookupList,
    getArticlePageLookup,
    changeLookupSearchOption,
    getPreviewTotalId,
    clearLookup,
    GET_ARTICLE_PAGE_LOOKUP_LIST,
} from '@store/articlePage';
import columnDefs from './LookupArticlePageListColumns';
import { previewPage } from '@store/merge';
import { API_BASE_URL } from '@/constants';
import toast from '@utils/toastUtil';

const propTypes = {
    /**
     * seq의 타입
     */
    seqType: PropTypes.oneOf([ITEM_AP]),
    /**
     * seq
     */
    seq: PropTypes.number,
    /**
     * show === true이면 리스트를 조회한다
     */
    show: PropTypes.bool,
    /**
     * row의 load 버튼 클릭 이벤트
     */
    onLoad: PropTypes.func,
};
const defaultProps = {
    show: true,
};

/**
 * seq, seqType을 검색조건으로 사용하는 Lookup 기사페이지 리스트
 */
const LookupArticlePageList = (props) => {
    const { seq, seqType, show, onLoad } = props;
    const dispatch = useDispatch();
    const { list, search: storeSearch, total, loading, latestDomainId } = useSelector((store) => ({
        list: store.articlePage.lookup.list,
        search: store.articlePage.lookup.search,
        total: store.articlePage.lookup.total,
        loading: store.loading[GET_ARTICLE_PAGE_LOOKUP_LIST],
        latestDomainId: store.auth.latestDomainId,
    }));

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    // state
    const [search, setSearch] = useState(initialState.lookup.search);
    const [rowData, setRowData] = useState([]);
    const [selected, setSelected] = useState({});

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getArticlePageLookupList(changeLookupSearchOption(temp)));
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        handleChangeSearchOption({ key: 'page', value: 0 });
    };

    /**
     * row클릭
     * @param {object} data row data
     */
    const handleRowClicked = (data) => {
        setSelected(data);
    };

    /**
     * 로드 버튼 클릭
     * @param {object} data row data
     */
    const handleClickLoad = useCallback(
        (data) => {
            if (onLoad) {
                // 상세 데이터를 조회한다
                const option = {
                    artPageSeq: data.artPageSeq,
                    callback: (response) => {
                        onLoad(response);
                    },
                };
                dispatch(getArticlePageLookup(option));
            }
        },
        [dispatch, onLoad],
    );

    /**
     * 미리보기 버튼 클릭
     * @param {object} data row data
     */
    const handleClickPreview = useCallback(
        (data) => {
            dispatch(
                getPreviewTotalId({
                    artType: data.artType,
                    callback: (response) => {
                        if (response.header.success) {
                            if (response.body === null) {
                                toast.error('미리보기용 기사ID가 존재하지 않습니다.');
                            } else {
                                const option = {
                                    content: data.artPageBody,
                                    callback: ({ header, body }) => {
                                        if (header.success) {
                                            const item = {
                                                ...data,
                                                totalId: response.body,
                                            };
                                            console.log(item);
                                            popupPreview('/preview/article-page', item);
                                        } else {
                                            toast.error(header.message || '미리보기에 실패하였습니다');
                                        }
                                    },
                                };
                                dispatch(previewPage(option));
                            }
                        } else {
                            toast.error('미리보기용 기사ID 조회에 실패하였습니다.');
                        }
                    },
                }),
            );
        },
        [dispatch],
    );
    /**
     * 미리보기 팝업띄움.
     */
    const popupPreview = (url, item) => {
        const targetUrl = `${API_BASE_URL}${url}`;

        // 폼 생성
        const f = document.createElement('form');
        f.setAttribute('method', 'post');
        f.setAttribute('action', targetUrl);
        f.setAttribute('target', '_blank');

        // eslint-disable-next-line no-restricted-syntax
        for (const propName in item) {
            if (typeof item[propName] === 'object') {
                const subObject = item[propName];
                // eslint-disable-next-line no-restricted-syntax
                for (const inPropName in subObject) {
                    if (Object.prototype.hasOwnProperty.call(subObject, inPropName)) {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = `${propName}.${inPropName}`;
                        input.value = item[propName][inPropName];
                        f.appendChild(input);
                    }
                }
            } else if (Object.prototype.hasOwnProperty.call(item, propName)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = propName;
                input.value = item[propName];
                f.appendChild(input);
            }
        }

        document.getElementsByTagName('body')[0].appendChild(f);
        f.submit();
        f.remove();
    };

    useEffect(() => {
        return () => {
            dispatch(clearLookup());
        };
    }, [dispatch]);

    useEffect(() => {
        // row 생성
        setRowData(
            list.map((data) => ({
                ...data,
                handleClickLoad,
                handleClickPreview,
            })),
        );
    }, [handleClickLoad, handleClickPreview, list]);

    useEffect(() => {
        if (show) {
            dispatch(
                getArticlePageLookupList(
                    changeLookupSearchOption({
                        ...initialState.lookup.search,
                        keyword: seq,
                        searchType: seqType === ITEM_AP ? 'artPageSeq' : '',
                        domainId: latestDomainId,
                    }),
                ),
            );
        }
    }, [show, latestDomainId, dispatch, seq, seqType]);

    return (
        <MokaCard titleClassName="mb-0" title="관련 기사페이지" bodyClassName="d-flex flex-column">
            <Form className="mb-2">
                {/* 검색조건, 키워드 */}
                <Form.Row>
                    <Col xs={5} className="p-0 pr-2">
                        <MokaInput
                            as="select"
                            value={search.searchType}
                            onChange={(e) => {
                                setSearch({
                                    ...search,
                                    searchType: e.target.value,
                                });
                            }}
                        >
                            {initialState.searchTypeList.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    <Col xs={7} className="p-0">
                        <MokaSearchInput
                            value={search.keyword}
                            onChange={(e) => {
                                setSearch({
                                    ...search,
                                    keyword: e.target.value,
                                });
                            }}
                            onSearch={handleSearch}
                        />
                    </Col>
                </Form.Row>
            </Form>

            {/* ag-grid table */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.artPageSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={3}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['load', 'preview']}
                selected={selected.artPageSeq}
            />
        </MokaCard>
    );
};

LookupArticlePageList.propTypes = propTypes;
LookupArticlePageList.defaultProps = defaultProps;

export default LookupArticlePageList;
