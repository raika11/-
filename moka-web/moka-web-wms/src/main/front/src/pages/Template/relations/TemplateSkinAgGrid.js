import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import columnDefs from './TemplateSkinAgGridColumns';
import { MokaTable } from '@components';
import { GET_RELATION_LIST, changeSearchSKOption, getRelationSKList, relationState } from '@store/template';

const TemplateSkinAgGrid = ({ show }) => {
    const dispatch = useDispatch();
    const { template, search: storeSearch, total, list, loading } = useSelector(
        (store) => ({
            template: store.template.template,
            search: store.templateRelationList.SK.search,
            total: store.templateRelationList.SK.total,
            list: store.templateRelationList.SK.list,
            loading: store.loading[GET_RELATION_LIST],
        }),
        shallowEqual,
    );
    const [search, setSearch] = useState(relationState.SK.search);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    /**
     * 테이블 검색옵션 변경
     * @param {*} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            dispatch(
                getRelationSKList(
                    changeSearchSKOption({
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
                    getRelationSKList(
                        changeSearchSKOption({
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

export default TemplateSkinAgGrid;
