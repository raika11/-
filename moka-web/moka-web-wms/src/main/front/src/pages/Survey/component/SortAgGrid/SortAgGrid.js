import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';
import { columnDefs } from './SortAgGridColumns';
import ItemRenderer from './ItemRenderer';
import toast, { messageBox } from '@utils/toastUtil';
import { selectArticleListChange, selectArticleItemChange } from '@store/survey/quiz';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { MokaInputLabel, MokaTable } from '@components';

/**
 * 관련 기사 AgGrid
 */
const SortAgGrid = ({ SearchForm }) => {
    const dispatch = useDispatch();
    const [articleListModalState, setArticleListModalState] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [modalArticle, setModalArticle] = useState(null);
    const [, setInstance] = useState(null);

    const { selectArticleList, selectArticleItem } = useSelector((store) => ({
        selectArticleList: store.quiz.selectArticle.list,
        selectArticleItem: store.quiz.selectArticle.item,
    }));

    const handleClickRelationArticleAdd = () => {
        let newItem = {
            contentId: '',
            title: '',
            linkUrl: ``,
        };

        dispatch(selectArticleListChange([...selectArticleList, newItem]));
        dispatch(selectArticleItemChange([...selectArticleItem, newItem]));
    };

    const handleClickArticleAdd = (article) => {
        setModalArticle(article);
    };

    /**
     * ag grid rows 조회
     */
    const getRows = (api) => {
        let displayedRows = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const data = api.getDisplayedRowAtIndex(i).data;
            displayedRows.push(data);
        }
        return displayedRows;
    };

    const handleDragEnd = (params) => {
        const displayedRows = getRows(params.api);
        let list = [];
        let item = [];
        displayedRows.map((e) => {
            list.push(selectArticleList[Number(e.id)]);
            item.push(selectArticleItem[Number(e.id)]);
            return {};
        });

        setTimeout(function () {
            // params.api.refreshCells({ force: true });

            dispatch(selectArticleListChange(list));
            dispatch(selectArticleItemChange(item));
        });

        params.api.refreshCells({ force: true });

        // params.api.applyTransaction({ update: displayedRows });
    };

    useEffect(() => {
        if (modalArticle) {
            const totalId = modalArticle.totalId;

            let checkItem = selectArticleItem.filter((e) => Number(e.contentId) === Number(totalId));
            if (checkItem.length > 0) {
                messageBox.alert('중복된 기사가 존재 합니다.');
                return;
            }
            if (SearchForm && selectArticleList.length >= 4) {
                toast.warning('관련기사는 4개 이상 등록 할 수 없습니다.');
                return;
            }

            let newItem = {
                contentId: modalArticle.totalId,
                title: unescapeHtmlArticle(modalArticle.artTitle),
                linkUrl: `https://news.joins.com/article/${modalArticle.totalId}`,
            };

            dispatch(selectArticleListChange([...selectArticleList, newItem]));
            dispatch(selectArticleItemChange([...selectArticleItem, newItem]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalArticle]);

    useEffect(() => {
        const setGridRowData = (data) => {
            setRowData(
                data.map((e, index) => {
                    return {
                        id: index,
                        title: e.title,
                        info: {
                            id: index,
                        },
                    };
                }),
            );
        };

        if (selectArticleList) {
            setRowData([]);
            setGridRowData(selectArticleList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectArticleList]);

    return (
        <>
            {(function () {
                if (SearchForm) {
                    return (
                        <React.Fragment>
                            <SearchForm HandleSearchClick={() => setArticleListModalState(true)} HandleAddClick={handleClickRelationArticleAdd} />
                        </React.Fragment>
                    );
                } else {
                    return (
                        <Form.Row className="mb-2">
                            <MokaInputLabel as="none" label="관련 기사" />
                            <Button variant="searching" onClick={() => setArticleListModalState(true)} className="mr-1">
                                기사 검색
                            </Button>
                            <ArticleListModal show={articleListModalState} onHide={() => setArticleListModalState(false)} onRowClicked={handleClickArticleAdd} />
                            <Button variant="positive" onClick={() => handleClickRelationArticleAdd()}>
                                추가
                            </Button>
                        </Form.Row>
                    );
                }
            })()}

            <MokaTable
                rowData={rowData}
                setGridInstance={setInstance}
                onRowNodeId={(params) => params.id}
                columnDefs={columnDefs}
                onRowDragEnd={handleDragEnd}
                dragStyle
                animateRows
                rowDragManaged
                suppressRowClickSelection
                suppressMoveWhenRowDragging
                paging={false}
                header={false}
                rowHeight={92}
                frameworkComponents={{ itemRenderer: ItemRenderer }}
            />
        </>
    );
};

export default SortAgGrid;
