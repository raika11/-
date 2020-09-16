import React from 'react';

export const columnDefs = [
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
    }
    // {
    //     field: 'deskingDelete',
    //     cellClass: 'align-right',
    //     width: 35,
    //     cellRendererFramework: ListDeleteButton,
    //     cellRendererParams: (params) => {
    //         return {
    //             name: 'delete',
    //             params
    //         };
    //     }
    // }
];

export const rowData = [
    {
        contentsId: '1',
        title: '테스트 기사1',
        titleEx: '테스트 기사1',
        thumbnailFileName: ''
    },
    {
        contentsId: '2',
        title: '테스트 기사2',
        titleEx: '테스트 기사2',
        thumbnailFileName: ''
    },
    {
        contentsId: '3',
        title: '테스트 기사3',
        titleEx: '테스트 기사3',
        thumbnailFileName: ''
    },
    {
        contentsId: '4',
        title: '테스트 기사4',
        titleEx: '테스트 기사4',
        thumbnailFileName: ''
    },
    {
        contentsId: '5',
        title: '테스트 기사5',
        titleEx: '테스트 기사5',
        thumbnailFileName: ''
    }
];
