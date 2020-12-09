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
const ArticlePageAgGrid = ({ onDelete }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    //state
    const [rowData, setRowData] = useState([]);
    const { total, list, search, loading, articlePage } = useSelector((store) => ({
        total: store.articlePage.total,
        list: store.articlePage.list,
        search: store.articlePage.search,
        loading: store.loading[GET_ARTICLE_PAGE_LIST],
        articlePage: store.articlePage.articlePage,
    }));

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
            history.push(`/article-page/${articlePage.artPageSeq}`);
        },
        [history],
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
                <Button variant="positive" onClick={() => history.push('/article-page')}>
                    기사페이지 등록
                </Button>
            </div>

            {/* ag-grid table */}
            <MokaTable
                agGridHeight={564}
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
