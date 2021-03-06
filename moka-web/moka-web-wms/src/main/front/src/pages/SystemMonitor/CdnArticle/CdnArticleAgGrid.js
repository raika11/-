import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTable } from '@components';
import { GRID_ROW_HEIGHT } from '@/style_constants';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { GET_CDN_ARTICLE_LIST, getCdnArticleList, changeSearchOption } from '@store/cdnArticle';
import columnDefs from './CdnArticleAgGridColumns';

const CdnArticleAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const loading = useSelector(({ loading }) => loading[GET_CDN_ARTICLE_LIST]);
    const { search, total, list, cdnArticle } = useSelector(({ cdnArticle }) => ({
        search: cdnArticle.search,
        total: cdnArticle.total,
        list: cdnArticle.list,
        cdnArticle: cdnArticle.cdnArticle,
    }));

    /**
     * row clicked
     * @param {object} data RowData
     */
    const handleRowClicked = (data) => {
        history.push(`${match.path}/${data.totalId}`);
    };

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(changeSearchOption(temp));
        dispatch(getCdnArticleList({ search: temp }));
    };

    useEffect(() => {
        setRowData(
            list.map((data) => ({
                ...data,
                regDt: (data.regDt || '').slice(0, -3),
                unescapeTitle: unescapeHtmlArticle(data.title),
            })),
        );
    }, [list]);

    return (
        <MokaTable
            loading={loading}
            columnDefs={columnDefs}
            rowData={rowData}
            rowHeight={GRID_ROW_HEIGHT.T[2]}
            className="overflow-hidden flex-fill"
            onRowNodeId={(data) => data.totalId}
            onRowClicked={handleRowClicked}
            onChangeSearchOption={handleChangeSearchOption}
            total={total}
            page={search.page}
            size={search.size}
            selected={cdnArticle.totalId}
        />
    );
};

export default CdnArticleAgGrid;
