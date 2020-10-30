import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaTable } from '@components';
import { initialState, GET_RELATION_LIST, getRelationList, changeSearchOption } from '@store/relation';
import columnDefs from './RelationPageListColums';

/**
 * 오른쪽 탭에 들어가는
 * 관련 페이지 리스트
 */
const RelationPageList = (props) => {
    const { show, relSeqType, relSeq } = props;
    const history = useHistory();
    const dispatch = useDispatch();

    const { search: storeSearch, list, total, error, loading, latestDomainId } = useSelector((store) => ({
        search: store.relation.search,
        list: store.relation.list,
        total: store.relation.total,
        error: store.relation.error,
        loading: store.loading[GET_RELATION_LIST],
        latestDomainId: store.auth.latestDomainId,
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
        dispatch(
            getRelationList(
                changeSearchOption({
                    ...search,
                    [key]: value,
                    page: 0,
                }),
            ),
        );
    };

    /**
     * row의 프리뷰 버튼 클릭
     * @param {object} data 페이지데이터
     */
    const handleClickPreview = (data) => {
        // 프리뷰 버튼 클릭
    };

    /**
     * row의 링크 버튼 클릭
     * @param {object} data 페이지데이터
     */
    const handleClickLink = (data) => {
        window.open(`/page/${data.pageSeq}`);
    };

    // TODO
    // 다른 버튼들도 기능 만들어서 추가 ㄱ

    useEffect(() => {
        setRowData(
            list.map((l) => ({
                ...l,
                handleClickPreview,
                handleClickLink,
            })),
        );
    }, [list]);

    useEffect(() => {
        if (show && relSeq) {
            dispatch(
                getRelationList(
                    changeSearchOption({
                        ...initialState.search,
                        relSeq,
                        relSeqType,
                        relType: 'PG',
                        domainId: latestDomainId,
                    }),
                ),
            );
        }
    }, [show, relSeq, relSeqType, dispatch, latestDomainId]);

    return (
        <MokaCard titleClassName="mb-0" title="페이지 검색">
            {/* 버튼 */}
            <div className="d-flex justify-content-end mb-3">
                <Button
                    variant="dark"
                    onClick={() => {
                        history.push('/page');
                    }}
                >
                    페이지 추가
                </Button>
            </div>

            {/* 테이블 */}
            <MokaTable
                agGridHeight={625}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(page) => page.pageSeq}
                onRowClicked={() => {}}
                loading={loading}
                error={error}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['preview', 'link']}
            />
        </MokaCard>
    );
};

export default RelationPageList;
