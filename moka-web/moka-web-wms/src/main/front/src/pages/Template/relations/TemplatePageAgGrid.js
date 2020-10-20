import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import columnDefs from './TemplatePageAgGridColumns';
import { MokaTable } from '@components';
import { GET_RELATION_LIST, changeSearchRelOption, getRelationList } from '@store/template/templateAction';

const TemplatePageAgGrid = ({ show }) => {
    const dispatch = useDispatch();
    const { template, search, total, list, loading } = useSelector((store) => ({
        template: store.template.template,
        search: store.templateRelations.PG.search,
        total: store.templateRelations.PG.total,
        list: store.templateRelations.PG.list,
        loading: store.loading[GET_RELATION_LIST],
    }));

    /**
     * 테이블 검색옵션 변경
     * @param {*} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        (payload) => {
            dispatch(
                getRelationList({
                    relType: 'PG',
                    actions: [changeSearchRelOption({ ...payload, relType: 'PG' })],
                }),
            );
        },
        [dispatch],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(() => {}, []);

    useEffect(() => {
        if (show && template.templateSeq) {
            dispatch(
                getRelationList({
                    actions: [
                        changeSearchRelOption({ relType: 'PG', key: 'templateSeq', value: template.templateSeq }),
                        changeSearchRelOption({ relType: 'PG', key: 'domainId', value: template.domain.domainId }),
                        changeSearchRelOption({ relType: 'PG', key: 'page', value: 0 }),
                    ],
                    relType: 'PG',
                }),
            );
        }
    }, [dispatch, show, template]);

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
