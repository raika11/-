import React, { useEffect, useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, changeSetMenuSearchOption, clearSetMenuSearchOption, getSetmenuBoardsList, clearSetmenuBoardInfo } from '@store/boards';
import { selectItem } from '@pages/Boards/BoardConst';

// 검색 박스
const BoardsListSearchBox = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    // 공통 구분값 URL
    const { pagePathName, total, search, list, boardType } = useSelector((store) => ({
        pagePathName: store.boards.pagePathName,
        boardType: store.boards.boardType,
        total: store.boards.setmenu.total,
        search: store.boards.setmenu.search,
        list: store.boards.setmenu.list,
        // loading: store.loading[GET_BULK_LIST],
    }));

    const [searchData, setSearchData] = useState(initialState.setmenu.search);

    // 등록 버튼
    const handleBoardNewButton = () => {
        dispatch(clearSetmenuBoardInfo());
        history.push(`/${pagePathName}/add`);
    };

    // 검색 데이값 처리.
    const handleSearchChange = ({ target: { name, value } }) => {
        setSearchData({
            ...searchData,
            boardType: boardType,
            [name]: value,
        });
    };

    const handleClickSearchButton = () => {
        const tmpSearchOption = {
            ...initialState.setmenu.search,
            boardType: boardType,
        };
        setSearchData(tmpSearchOption);
        dispatch(changeSetMenuSearchOption(tmpSearchOption));
        dispatch(getSetmenuBoardsList());
    };

    const handleClickSearchResetButton = () => {
        dispatch(clearSetMenuSearchOption());
        const tmpSearchOption = {
            ...initialState.setmenu.search,
            boardType: boardType,
        };
        setSearchData(tmpSearchOption);
        dispatch(getSetmenuBoardsList());
    };

    return (
        <Form>
            <Form.Row className="d-flex mb-3">
                <Col xs={2}>
                    <MokaInput as="select" name="usedYn" id="useYn" value={searchData.usedYn} onChange={(e) => handleSearchChange(e)}>
                        <option hidden>사용여부</option>
                        {selectItem.usedYn.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={8}>
                    <MokaSearchInput
                        id="keyword"
                        name="keyword"
                        placeholder={'게시판명, 설명'}
                        value={searchData.keyword}
                        onChange={(e) => handleSearchChange(e)}
                        onSearch={() => handleClickSearchButton()}
                    />
                </Col>
                <Col xs={1}>
                    <Button variant="outline-neutral" onClick={() => handleClickSearchResetButton()}>
                        초기화
                    </Button>
                </Col>
                <Col xs={1}>
                    <Button variant="positive" onClick={() => handleBoardNewButton()}>
                        게시판 생성
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default BoardsListSearchBox;
