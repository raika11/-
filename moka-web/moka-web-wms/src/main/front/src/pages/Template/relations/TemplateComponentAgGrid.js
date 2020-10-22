import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import columnDefs from './TemplateComponentAgGridColumns';
import { MokaTable } from '@components';
import { GET_RELATION_LIST, changeSearchCPOption, getRelationCPList, relationState } from '@store/template';

const TemplateComponentAgGrid = ({ show }) => {
    const dispatch = useDispatch();
    const { template, search: storeSearch, total, list, loading } = useSelector(
        (store) => ({
            template: store.template.template,
            search: store.templateRelationList.CT.search,
            total: store.templateRelationList.CT.total,
            list: store.templateRelationList.CT.list,
            loading: store.loading[GET_RELATION_LIST],
        }),
        shallowEqual,
    );
    const [search, setSearch] = useState(relationState.CP.search);

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
                getRelationCPList(
                    changeSearchCPOption({
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
                    getRelationCPList(
                        changeSearchCPOption({
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

export default TemplateComponentAgGrid;
