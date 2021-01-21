import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { GET_DIRECT_LINK_LIST, getDirectLinkList, changeSearchOption } from '@store/directLink';
import Table from './components/Table';
import Search from './DirectLinkSearch';

const DirectLinkList = (props) => {
    const { match } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const UPLOAD_PATH_URL = useSelector(({ app }) => app.UPLOAD_PATH_URL);
    const loading = useSelector(({ loading }) => loading[GET_DIRECT_LINK_LIST]);
    const { total, list, search, directLink } = useSelector((store) => ({
        total: store.directLink.total,
        list: store.directLink.list,
        search: store.directLink.search,
        directLink: store.directLink.directLink,
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
            dispatch(getDirectLinkList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (data) => {
            history.push(`${match.path}/${data.linkSeq}`);
        },
        [history, match.path],
    );

    /**
     * 목록 리스트
     */
    useEffect(() => {
        setRowData(
            list.map((data) => {
                let imgUrl = data.imgUrl;
                // 이미지가 없으면 빈값으로 출력 되기 떄문에 기본 이미지 설정.
                if (imgUrl === '' || imgUrl === 'https://joongang.joins.com/') {
                    imgUrl = 'http://pds.joins.com/news/search_direct_link/000.jpg';
                }
                return {
                    ...data,
                    imgUrl,
                };
            }),
        );
    }, [UPLOAD_PATH_URL, list]);

    /**
     * 신규 등록
     */
    const handleClickAdd = () => history.push(`${match.path}/add`);

    return (
        <React.Fragment>
            <Search {...props} />

            <div className="d-flex justify-content-end mb-2">
                <div className="pt-0">
                    <Button variant="positive" onClick={() => handleClickAdd()}>
                        신규 등록
                    </Button>
                </div>
            </div>

            <Table
                list={rowData}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                onRowClicked={handleRowClicked}
                selected={directLink.linkSeq}
            />
        </React.Fragment>
    );
};

export default DirectLinkList;
