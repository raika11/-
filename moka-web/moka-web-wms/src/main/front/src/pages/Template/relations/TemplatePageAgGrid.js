import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import columnDefs from './TemplatePageAgGridColumns';
import { MokaTable } from '@components';
import { GET_RELATION_LIST, changeSearchPGOption, getRelationPGList, relationState } from '@store/template';

const TemplatePageAgGrid = ({ show }) => {
    const dispatch = useDispatch();
    const { template, search: storeSearch, total, list, loading } = useSelector(
        (store) => ({
            template: store.template.template,
            search: store.templateRelationList.PG.search,
            total: store.templateRelationList.PG.total,
            list: store.templateRelationList.PG.list,
            loading: store.loading[GET_RELATION_LIST],
        }),
        shallowEqual,
    );
    const [search, setSearch] = useState(relationState.PG.search);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            dispatch(
                getRelationPGList(
                    changeSearchPGOption({
                        ...search,
                        [key]: value,
                        page: 0,
                    }),
                ),
            );
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(() => {}, []);

    useEffect(() => {
        if (show) {
            if (template.templateSeq) {
                dispatch(
                    getRelationPGList(
                        changeSearchPGOption({
                            ...search,
                            templateSeq: template.templateSeq,
                            domainId: template.domain.domainId,
                            page: 0,
                        }),
                    ),
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, template]);

    return (
        <MokaTable
            agGridHeight={625}
            columnDefs={columnDefs}
            rowData={list}
            onRowNodeId={(page) => page.pageSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            preventRowClickCell={['preview', 'link']}
        />
    );
};

export default TemplatePageAgGrid;
