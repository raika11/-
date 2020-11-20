import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import columnDefs from './DirectLinkAgGridColumns';
import { MokaTable } from '@components';
import { GET_DIRECT_LINK_LIST, getDirectLinkList, changeSearchOption } from '@store/directLink';

/**
 * 사이트 바로 가기 AgGrid 컴포넌트
 */
const DirectLinkAgGrid = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    //state
    const [rowData, setRowData] = useState([]);

    const { total, list, search, loading, directLink, UPLOAD_PATH_URL } = useSelector((store) => ({
        total: store.directLink.total,
        list: store.directLink.list,
        search: store.directLink.search,
        loading: store.loading[GET_DIRECT_LINK_LIST],
        directLink: store.directLink.directLink,
        UPLOAD_PATH_URL: store.app.UPLOAD_PATH_URL,
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
            dispatch(getDirectLinkList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (data) => {
            history.push(`/direct-link/${data.linkSeq}`);
        },
        [history],
    );

    /**
     * 목록 리스트
     */
    useEffect(() => {
        setRowData(
            list.map((data) => {
                let imgUrl = data.imgUrl;
                // Full URL 이어서 주석처리.
                // if (imgUrl && imgUrl !== '') {
                //     imgUrl = `${API_BASE_URL}${UPLOAD_PATH_URL}/${imgUrl}`;
                // }

                // 이미지가 없으면 빈값으로 출력 되기 떄문에 기본 이미지 설정.
                if (imgUrl === '' || imgUrl === 'https://joongang.joins.com/') {
                    imgUrl = 'http://pds.joins.com/news/search_direct_link/000.jpg';
                }
                return {
                    ...data,
                    imgUrl,
                    usedYnText: data.usedYn === 'Y' ? '게재 중' : '정지',
                };
            }),
        );
    }, [UPLOAD_PATH_URL, list]);

    return (
        <React.Fragment>
            {/* 버튼 그룹 */}
            <div className="d-flex justify-content-end mb-10">
                <div className="pt-0">
                    <Button variant="positive" onClick={() => history.push('/direct-link')}>
                        사이트 바로 가기 추가
                    </Button>
                </div>
            </div>

            <MokaTable
                agGridHeight={650}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.linkSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={3}
                onChangeSearchOption={handleChangeSearchOption}
                selected={directLink.linkSeq}
            />
        </React.Fragment>
    );
};

export default DirectLinkAgGrid;
