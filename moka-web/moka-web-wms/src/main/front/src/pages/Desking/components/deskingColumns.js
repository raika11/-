/* eslint-disable max-len */
import React from 'react';
import ImageIcon from '@material-ui/icons/Image';
import DeskingListDeleteButton from './DeskingListDeleteButton';
import ArticleListPVHeader from '../article/ArticleListPVHeader';
import RelationArticleAddButtom from '../article/RelationArticleAddButton';
import RelationArticleListDeleteButton from '../article/RelationArticleListDeleteButton';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };

/**
 * 컬럼정의
 */
export const deskingColumns = [
    {
        rowDrag: true,
        width: 22,
        suppressMenu: true,
        rowDragText: (params, dragItemCount) => {
            if (dragItemCount > 1) {
                const message = params.rowNodes
                    ? params.rowNodes.reduce(
                          (prev, next) => `${prev.data.title},${next.data.title}`
                      )
                    : params.rowNode.data.title;
                return `${message}외 [${dragItemCount - 1}건]`;
            }
            return params.rowNode.data.contentsId;
        }
        // dndSource: true
    },
    {
        colId: 'checkbox',
        width: 25,
        checkboxSelection: true,
        suppressMenu: true,
        headerCheckboxSelection: true
    },
    {
        field: 'contentsOrderEx',
        cellClass: 'align-center',
        width: 22
    },
    {
        field: 'thumbnail',
        cellClass: 'align-center',
        width: 50,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        cellRenderer: (params) => {
            let tag = '';
            if (params.data.thumbnailFileName) {
                tag +=
                    '<span style="width: 50px; height: 48px; display: flex; align-items: center;">';
                tag += `<img width="50" src="http://img.com/${params.data.thumbnailFileName}" />`;
                tag += '</span>';
                // } else {
                //     return <ImageIcon width="50" fontSize="large" />;
            }
            return tag;
        }
    },
    {
        // field: 'titleEx',
        width: 320,
        autoHeight: true,
        cellRendererFramework: (params) => {
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '50px',
                        lineHeight: 'normal'
                    }}
                    dangerouslySetInnerHTML={{ __html: params.data.titleEx }}
                />
            );
        }
    },
    {
        field: 'deskingDelete',
        cellClass: 'align-right',
        width: 35,
        // lockPosition: true,
        // suppressNavigable: true,
        cellRendererFramework: DeskingListDeleteButton,
        cellRendererParams: (params) => {
            return {
                name: 'delete',
                params
            };
        }
        // cellRenderer: 'datasetListDeleteButton'
        // cellRenderer: (params) => {
        //     return '<input name="selected" type="radio">';
        // }
    }
];

// 기사리스트의 컬럼 정의
export const articleColumns = [
    {
        rowDrag: true,
        width: 28,
        suppressMenu: true,
        rowDragText: (params, dragItemCount) => {
            if (dragItemCount > 1) {
                const message = params.rowNodes
                    ? params.rowNodes.reduce(
                          (prev, next) => `${prev.data.title},${next.data.title}`
                      )
                    : params.rowNode.data.title;
                return `${message} 외 [${dragItemCount - 1}건]`;
            }
            return params.rowNode.data.title;
        }
        // dndSource: true
    },
    {
        colId: 'checkbox',
        width: 28,
        checkboxSelection: true,
        suppressMenu: true,
        headerCheckboxSelection: true
    },
    {
        headerName: '등록일시\n수정일시',
        field: 'cellDate',
        width: 75,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'pre-wrap',
            lineHeight: '20px',
            height: '50px'
        },
        sort: 'desc',
        sortable: true,
        unSortIcon: true,
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
            return nodeA.data.distYmdt - nodeB.data.distYmdt;
        }
    },
    {
        headerName: '제목',
        field: 'cellTitle',
        width: 300,
        minWidth: 300,
        autoHeight: true,
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            fontSize: '14px',
            height: '50px',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer'
        }
    },
    {
        headerName: '사진',
        width: 60,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        cellRenderer: (params) => {
            let tag = '';
            if (params.data.thumbnailFileName) {
                tag +=
                    '<span style="width: 60px; height: 48px; display: flex; align-items: center;">';
                tag += `<img width="60" src="http://img.com/${params.data.thumbnailFileName}" />`;
                tag += '</span>';
            }
            return tag;
        }
    },
    {
        headerName: '가중치\n카테고리',
        width: 100
    },
    {
        headerName: '작성자\n바이라인',
        width: 80,
        field: 'cellGijaName',
        autoHeight: true,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'pre-wrap',
            lineHeight: '20px'
        }
    },
    {
        headerName: '매핑소재\n서비스유형',
        width: 100
    },
    {
        headerName: '배부시간\n배부채널',
        width: 90
    },
    {
        width: 100,
        // cellStyle: {
        //     display: 'flex',
        //     alignItems: 'center',
        //     justifyContent: 'center'
        // },
        headerComponentFramework: (params) => <ArticleListPVHeader {...params} />
    },
    { width: 45 }
];

// 관련기사 다이얼로그 왼쪽 ag-grid 컬럼정의
export const relationArticleColumns = [
    {
        rowDrag: true,
        width: 28,
        suppressMenu: true,
        rowDragText: (params, dragItemCount) => {
            return params.rowNode.data.title;
        }
    },
    {
        headerName: '배부일시',
        field: 'cellDate',
        width: 75,
        sort: true,
        sortable: true
    },
    {
        headerName: '제목',
        field: 'title',
        width: 378,
        minWidth: 378,
        cellStyle: {
            fontSize: '14px',
            cursor: 'pointer'
        }
    },
    {
        width: 55,
        cellRendererFramework: (params) => <RelationArticleAddButtom {...params} />
    }
];

// 관련기사 다이얼로그 오른쪽 ag-grid(대표기사) 컬럼정의
export const mainEditColumns = [
    {
        rowDrag: true,
        width: 28,
        suppressMenu: true,
        rowDragText: (params, dragItemCount) => {
            return params.rowNode.data.title;
        }
    },
    {
        field: 'title',
        width: 395,
        minWidth: 395,
        cellEditor: 'cellEditor',
        editable: true,
        cellEditorParams: (params) => ({
            ...params,
            maxLenght: '370'
        }),
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            border: 'none',
            lineHeight: '21px',
            height: '27px',
            top: '2px',
            boxSizing: 'border-box',
            backgroundColor: 'inherit'
        }
    },
    {
        cellRendererFramework: (params) => <RelationArticleListDeleteButton {...params} />,
        width: 32,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            lineHeight: 'normal'
        }
    }
];

// 관련기사 다이얼로그 오른쪽 ag-grid(관련기사) 컬럼정의
export const relationEditColumns = [
    {
        rowDrag: true,
        width: 28,
        suppressMenu: true,
        rowDragText: (params, dragItemCount) => {
            return params.rowNode.data.relTitle;
        }
    },
    {
        field: 'relTitle',
        width: 395,
        minWidth: 395,
        cellEditor: 'cellEditor',
        editable: true,
        cellEditorParams: (params) => ({
            ...params,
            maxLenght: '370'
        }),
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            border: 'none',
            lineHeight: '21px',
            height: '27px',
            top: '2px',
            boxSizing: 'border-box',
            backgroundColor: 'inherit'
        }
    },
    {
        cellRendererFramework: (params) => <RelationArticleListDeleteButton {...params} />,
        width: 32,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            lineHeight: 'normal'
        }
    }
];

// 이미지 편집 사진 탭 (임의 정의)
export const imageTableColumns = [
    {
        id: 'img1',
        format: '',
        sort: false,
        disablePadding: true,
        label: ''
    },
    {
        id: 'img2',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID'
    },
    {
        id: 'img3',
        format: '',
        sort: false,
        disablePadding: true,
        label: ''
    }
];
