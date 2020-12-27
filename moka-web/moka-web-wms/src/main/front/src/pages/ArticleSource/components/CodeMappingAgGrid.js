import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@/components';
import columnDefs from './CodeMappingAgGridColumns';
import { GET_MAPPING_SOURCE_LIST, getMappingSourceList, changeModalSearchOption } from '@store/articleSource';

const CodeMappingAgGrid = (props) => {
    const { data, handleClickAdd } = props;
    const dispatch = useDispatch();
    const mappingList = useSelector((store) => store.articleSource.mappingList);
    const mappingTotal = useSelector((store) => store.articleSource.mappingTotal);
    const mappingSearch = useSelector((store) => store.articleSource.mappingSearch);
    const mappingCode = useSelector((store) => store.articleSource.mappingCode);
    const loading = useSelector((store) => store.loading[GET_MAPPING_SOURCE_LIST]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((row) => {
        // history.push(`/article-sources/${row.sourceCode}`)
    }, []);

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...mappingSearch, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeModalSearchOption(temp));
        },
        [dispatch, mappingSearch],
    );

    useEffect(() => {
        dispatch(
            getMappingSourceList({
                sourceCode: data.sourceCode,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="d-flex flex-column">
            {/* 등록 */}
            <div className="mb-2 d-flex justify-content-end">
                <Button className="ft-12" style={{ borderRadius: '3px 3px 3px 3px' }} variant="outline-table-btn" onClick={handleClickAdd}>
                    신규 등록
                </Button>
            </div>

            {/* AgGrid */}
            <MokaTable
                columnDefs={columnDefs}
                agGridHeight={450}
                rowData={mappingList}
                onRowNodeId={(row) => row.seqNo}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={mappingTotal}
                page={mappingSearch.page}
                size={mappingSearch.size}
                // selected={mappingCode.seqNo}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </div>
    );
};

export default CodeMappingAgGrid;
