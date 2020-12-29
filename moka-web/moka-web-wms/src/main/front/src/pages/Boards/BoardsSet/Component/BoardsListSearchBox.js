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
    const { pagePathName, boardType, search } = useSelector((store) => ({
        pagePathName: store.boards.pagePathName,
        boardType: store.boards.boardType,
        search: store.boards.setmenu.search,
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
            [name]: value,
        });
    };

    // 검색 버튼 클릭 처리.
    const handleClickSearchButton = () => {
        dispatch(getSetmenuBoardsList(changeSetMenuSearchOption(searchData)));
    };

    // 리셋 버튼 클릭 처리.
    const handleClickSearchResetButton = () => {
        dispatch(clearSetMenuSearchOption()); // 스토어에 검색 옵션을 초기화
        const tmpSearchOption = {
            ...initialState.setmenu.search,
            boardType: boardType, // store 공통 구분값에서 보드 타입을 가지고 온다. (S: 서비스, A: 관리자)
        };
        setSearchData(tmpSearchOption); // state 변경.
        dispatch(getSetmenuBoardsList(changeSetMenuSearchOption(tmpSearchOption))); // store 에 검색 옵션 변경후 리스트를 가지고 온다.
    };

    useEffect(() => {
        // 최초 로딩후 store 에 search 옵션을 가지고 와서 검색 state 값 변경.
        setSearchData(search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                <Col xs={7}>
                    <MokaSearchInput
                        id="keyword"
                        name="keyword"
                        placeholder={'게시판명, 설명'}
                        value={searchData.keyword}
                        onChange={(e) => handleSearchChange(e)}
                        onSearch={() => handleClickSearchButton()}
                    />
                </Col>
                <Col xs={1} className="mr-2">
                    <Button variant="outline-neutral" onClick={() => handleClickSearchResetButton()}>
                        초기화
                    </Button>
                </Col>
                <Col xs={2} className="mr-2 text-center">
                    <Button variant="positive" onClick={() => handleBoardNewButton()}>
                        게시판 생성
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default BoardsListSearchBox;
