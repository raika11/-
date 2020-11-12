export default [
    {
        rowDrag: true,
        width: 22,
        supressMenu: true,
        rowDragText: (params, dragItemCount) => {
            // if (dragItemCount > 1) {
            //     const message = params.rowNodes
            //         ? params.rowNodes.reduce(
            //               (prev, next) => `${prev.data.title},${next.data.title}`
            //           )
            //         : params.rowNode.data.title;
            //     return `${message}외 [${dragItemCount - 1}건]`;
            // }
            // return params.rowNode.data.contentsId;
            return '기사 정보 노출';
        },
    },
    {
        headerName: '기사유형',
        width: 80,
        field: 'artType',
    },
    {
        headerName: '사진',
        width: 60,
        field: 'artThumb',
        cellRenderer: 'imageRenderer',
    },
    {
        headerName: '',
        width: 28,
        // 편집 그룹 + 동영상(OVP/YOUTUBE/둘다)
    },
    {
        headerName: '제 목',
        field: 'title',
        width: 300,
        flex: 1,
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
            cursor: 'pointer',
        },
    },
    {
        headerName: '면/판',
        width: 90,
    },
    {
        headerName: '출고시간\n수정시간',
        width: 100,
        field: 'cellDate',
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'pre-wrap',
            lineHeight: '20px',
            height: '50px',
        },
    },
    {
        headerName: '기자명',
        width: 90,
    },
];
