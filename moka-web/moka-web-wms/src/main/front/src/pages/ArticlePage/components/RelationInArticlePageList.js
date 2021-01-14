import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaTable, MokaInput } from '@components';
import { initialState, GET_RELATION_LIST, getRelationList, changeSearchOption, clearStore } from '@store/relation';
import columnDefs from './RelationInArticlePageListColumns';
import { ITEM_TP, ITEM_CP, ITEM_CT, ITEM_DS } from '@/constants';

const propTypes = {
    /**
     * relSeq의 타입
     */
    relSeqType: PropTypes.oneOf([ITEM_TP, ITEM_CP, ITEM_CT, ITEM_DS]),
    /**
     * relSeq
     */
    relSeq: PropTypes.number,
    /**
     * show === true이면 리스트를 조회한다
     */
    show: PropTypes.bool,
};
const defaultProps = {
    show: true,
};

/**
 * 오른쪽 탭에 들어가는
 * 관련된 상위(부모의) 기사페이지 리스트
 *
 * 데이터셋 관리 => 도메인 select 추가
 */
const RelationInArticlePageList = (props) => {
    const { show, relSeqType, relSeq } = props;
    const history = useHistory();
    const dispatch = useDispatch();

    const { search: storeSearch, list, total, error, loading, latestDomainId, domainList } = useSelector((store) => ({
        search: store.relation.search,
        list: store.relation.list,
        total: store.relation.total,
        error: store.relation.error,
        loading: store.loading[GET_RELATION_LIST],
        latestDomainId: store.auth.latestDomainId,
        domainList: store.auth.domainList,
    }));

    // state
    const [search, setSearch] = useState(initialState.search);
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getRelationList(changeSearchOption(temp)));
    };

    /**
     * row의 링크 버튼 클릭
     * @param {object} data row 데이터
     */
    const handleClickLink = (data) => {
        window.open(`/article-page/${data.artPageSeq}`);
    };

    /**
     * preview 버튼 클릭
     * @param {object} data row data
     */
    const handleClickPreview = (data) => {
        window.open(`//${data.domain.domainUrl}/article/${data.totalId}`);
    };

    useEffect(() => {
        setRowData(
            list.map((l) => ({
                ...l,
                handleClickLink,
                handleClickPreview,
            })),
        );
    }, [list]);

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    useEffect(() => {
        if (show && relSeq) {
            dispatch(
                getRelationList(
                    changeSearchOption({
                        ...initialState.search,
                        relSeq,
                        relSeqType,
                        relType: 'AP',
                        domainId: latestDomainId,
                    }),
                ),
            );
        } else if (!relSeq) {
            dispatch(clearStore());
        }
    }, [show, relSeq, relSeqType, dispatch, latestDomainId]);

    return (
        <MokaCard titleClassName="mb-0" title="관련 기사페이지" bodyClassName="d-flex flex-column">
            {/* 도메인 선택 */}
            {relSeqType === ITEM_DS && (
                <Form.Row className="mb-2">
                    <MokaInput as="select" value={search.domainId || undefined} onChange={(e) => handleChangeSearchOption({ key: 'domainId', value: e.target.value })}>
                        {domainList.map((domain) => (
                            <option key={domain.domainId} value={domain.domainId}>
                                {domain.domainName}
                            </option>
                        ))}
                    </MokaInput>
                </Form.Row>
            )}

            {/* 버튼 */}
            <div className="d-flex justify-content-end mb-2">
                <Button variant="positive" onClick={() => history.push('/article-page')}>
                    기사페이지 등록
                </Button>
            </div>

            {/* 테이블 */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.artPageSeq}
                onRowClicked={() => {}}
                loading={loading}
                error={error}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={3}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['preview', 'link']}
            />
        </MokaCard>
    );
};

RelationInArticlePageList.propTypes = propTypes;
RelationInArticlePageList.defaultProps = defaultProps;

export default RelationInArticlePageList;
