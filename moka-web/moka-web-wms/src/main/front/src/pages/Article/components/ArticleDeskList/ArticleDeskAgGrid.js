import React, { useState, useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaTable } from '@components';
import { unescapeHtml } from '@utils/convertUtil';
import { addDeskingWorkDropzone } from '@utils/agGridUtil';
import { GET_ARTICLE_LIST, getArticleList, changeSearchOption } from '@store/article';
import columnDefs from './ArticleDeskAgGridColums';
import GroupNumberRenderer from './GroupNumberRenderer';
import ChangeArtTitleModal from '@pages/Article/modals/ChangeArtTitleModal';

/**
 * 기사관리 ag-grid 컴포넌트 (페이지편집)
 */
const ArticleDeskAgGrid = forwardRef((props, ref) => {
    const { onDragStop, dropTargetAgGrid } = props;

    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_ARTICLE_LIST]);
    const { PDS_URL, IR_URL } = useSelector((store) => ({
        PDS_URL: store.app.PDS_URL,
        IR_URL: store.app.IR_URL,
    }));
    const { search, list, total, error } = useSelector((store) => ({
        search: store.article.search,
        list: store.article.list,
        total: store.article.total,
        error: store.article.error,
    }));

    // state
    const [rowData, setRowData] = useState([]);
    const [gridInstance, setGridInstance] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [selected, setSelected] = useState({});

    /**
     * row 클릭
     * @param {object} data data
     * @param {object} params 클릭시 aggrid에서 넘겨주는 데이터
     */
    const handleRowClicked = (data, params) => {
        if (params.column.colId === 'escapeTitle') {
            setSelected(data);
            setModalShow(true);
        }
    };

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getArticleList({ search: temp }));
        dispatch(changeSearchOption(temp));
    };

    useEffect(() => {
        setRowData(
            list.map((art) => {
                // 기자명 replace
                let reportersText = art.artReporter;
                const reporters = art.artReporter.split('.');
                if (reporters.length > 1) reportersText = `${reporters[0]} 외 ${reporters.length - 1}명`;

                // ID, 기사유형
                let artIdType = `${art.totalId}\n${art.artTypeName}`;

                // 제목 replace
                let escapeTitle = art.artTitle;
                if (escapeTitle && escapeTitle !== '') escapeTitle = unescapeHtml(escapeTitle);

                // 면판 replace
                let myunPan = '';
                if (art.pressMyun && art.pressMyun.replace(/\s/g, '') !== '') myunPan = `${art.pressMyun}/${art.pressPan}`;

                // 출고시간/수정시간 replace
                let articleDt = moment(art.serviceDaytime, DB_DATEFORMAT).format('MM-DD HH:mm');
                if (art.artModDt) {
                    articleDt = `${articleDt}\n${moment(art.artModDt, DB_DATEFORMAT).format('MM-DD HH:mm')}`;
                }

                // 이미지경로
                let artPdsThumb = `${PDS_URL}${art.artThumb}`;
                let artThumb = `${IR_URL}?t=k&w=100&h=100u=//${PDS_URL}${art.artThumb}`;

                return {
                    ...art,
                    escapeTitle,
                    artIdType,
                    myunPan,
                    articleDt,
                    reportersText,
                    gridType: 'ARTICLE',
                    artThumb,
                    artPdsThumb,
                };
            }),
        );
    }, [IR_URL, PDS_URL, list]);

    useEffect(() => {
        /**
         * 드롭 타겟 ag-grid에 drop-zone 설정
         */
        if (gridInstance) {
            if (Array.isArray(dropTargetAgGrid)) {
                // 타겟이 리스트인 경우
                dropTargetAgGrid.forEach((targetGrid, agGridIndex) => {
                    addDeskingWorkDropzone(onDragStop, gridInstance, targetGrid, agGridIndex);
                });
            } else {
                // 타겟이 1개인 경우
                addDeskingWorkDropzone(onDragStop, gridInstance, dropTargetAgGrid);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dropTargetAgGrid, gridInstance, onDragStop]);

    return (
        <React.Fragment>
            <MokaTable
                ref={ref}
                className="article-list overflow-hidden flex-fill"
                setGridInstance={setGridInstance}
                headerHeight={50}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(article) => article.totalId}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                showTotalString={false}
                error={error}
                onChangeSearchOption={handleChangeSearchOption}
                frameworkComponents={{ GroupNumberRenderer: GroupNumberRenderer }}
                dragManaged={false}
                animateRows={false}
                rowSelection="multiple"
            />
            <ChangeArtTitleModal show={modalShow} onHide={() => setModalShow(false)} artData={selected} />
        </React.Fragment>
    );
});

export default ArticleDeskAgGrid;
