import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import columnDefs from './ArticlePageAgGridColumns';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@components';
import { GET_ARTICLE_PAGE_LIST, getArticlePageList, changeSearchOption } from '@store/articlePage';

/**
 * 템플릿 AgGrid 컴포넌트
 */
const ArticlePageAgGrid = ({ match, onDelete }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_ARTICLE_PAGE_LIST]);
    const { total, list, search, articlePage } = useSelector(({ articlePage }) => articlePage);
    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getArticlePageList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (articlePage) => {
            history.push(`${match.path}/${articlePage.artPageSeq}`);
        },
        [history, match],
    );

    useEffect(() => {
        if (list) {
            setRowData(
                list.map((data) => {
                    return {
                        ...data,
                        onDelete,
                    };
                }),
            );
        }
    }, [list, onDelete]);

    return (
        <>
            <div className="mb-2 d-flex justify-content-end">
                <Button variant="positive" onClick={() => history.push(`${match.path}/add`)}>
                    기사페이지 등록
                </Button>
            </div>

            {/* ag-grid table */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(rowData) => rowData.artPageSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={3}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['delete']}
                selected={articlePage.artPageSeq}
            />
        </>
    );
};

export default ArticlePageAgGrid;
