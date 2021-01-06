import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import columnDefs from './ArticleAgGridColumns';
import { MokaTable } from '@components';
import { unescapeHtml } from '@utils/convertUtil';
import { GET_ARTICLE_LIST, changeSearchOption, getArticleList } from '@store/article';
import { DB_DATEFORMAT, ARTICLE_URL } from '@/constants';

moment.locale('ko');

/**
 * 등록기사 AgGrid 컴포넌트
 */
const ArticleAgGrid = ({ match, ja }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_ARTICLE_LIST]);
    const article = useSelector((store) => store.article.article);
    const OVP_PREVIEW_URL = useSelector((store) => store.app.OVP_PREVIEW_URL);
    const { total, list, search } = useSelector(({ article }) => ({
        total: article.total,
        list: article.list,
        search: article.search,
    }));

    //state
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
            dispatch(changeSearchOption(temp));
            dispatch(getArticleList({ search: temp }));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (data) => {
            history.push(`${match.path}/${data.totalId}`);
        },
        [history, match.path],
    );

    useEffect(() => {
        if (list.length > 0) {
            setRowData(
                list.map((data) => {
                    // 면판 replace
                    let myunPan = '';
                    myunPan = `${data.pressMyun || ''}/${data.pressPan || ''}`;

                    return {
                        ...data,
                        artTitle: unescapeHtml(data.artTitle),
                        artUrl: `${ARTICLE_URL}${data.totalId}`,
                        regDt: moment(data.serviceDaytime, DB_DATEFORMAT).format('MM-DD HH:mm'),
                        myunPan,
                        serviceTime: data.serviceDaytime ? moment(data.serviceDaytime, DB_DATEFORMAT).format('HH:mm') : null,
                        handleRowClicked,
                        ovpFullLink: `${OVP_PREVIEW_URL}?videoId=${data.ovpLink}`,
                        ja: ja, // 편집그룹 표기 유무
                    };
                }),
            );
        } else {
            setRowData([]);
        }
    }, [OVP_PREVIEW_URL, handleRowClicked, ja, list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(data) => data.totalId}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            preventRowClickCell={['sourceName', 'view', 'register']}
            selected={article.totalId}
            suppressRefreshCellAfterUpdate
        />
    );
};

export default ArticleAgGrid;
