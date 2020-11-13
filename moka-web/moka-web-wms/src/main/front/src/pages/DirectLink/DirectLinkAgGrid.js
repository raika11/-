import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import columnDefs from './DirectLinkAgGridColumns';
import { API_BASE_URL } from '@/constants';
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

    useEffect(() => {
        setRowData(
            list.map((data) => {
                let imgUrl = data.imgUrl;
                if (imgUrl && imgUrl !== '') {
                    imgUrl = `${API_BASE_URL}${UPLOAD_PATH_URL}/${imgUrl}`;
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
                    <Button variant="dark" onClick={() => history.push('/direct-link')}>
                        사이트 바로 가기 추가
                    </Button>
                </div>
            </div>

            <MokaTable
                agGridHeight={650}
                columnDefs={columnDefs}
                // rowData={rowData}
                // 예제 데이터이므로 실제 데이터 연결 시 아래는 삭제하시고, 윗 줄 주석 제거하여 사용하세요
                rowData={[
                    {
                        linkTitle: '테스트 데이터',
                        linkUrl: 'http://jtbc.joins.com/',
                        linkContent: 'jtbc 설명입니다\n jtbc 설명입니다',
                        usedYn: 'Y',
                        usedYnText: '게재 중',
                        imgUrl:
                            'https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F011%2F2019%2F01%2F17%2F0003488095_001_20190117132108003.png&type=b400',
                    },
                ]}
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
