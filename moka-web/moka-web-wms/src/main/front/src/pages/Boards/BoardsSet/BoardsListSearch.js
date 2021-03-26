import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState, changeSetMenuSearchOption, getSetMenuBoardsList } from '@store/board';

/**
 * 게시판 관리 > 전체 게시판 > 게시판 목록 검색
 */
const BoardsListSearch = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    // 공통 구분값 URL
    const { boardType, storeSearch } = useSelector((store) => ({
        boardType: store.board.boardType,
        storeSearch: store.board.setMenu.search,
    }));
    const [search, setSearch] = useState(initialState.setMenu.search);

    /**
     * input value
     */
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 검색
     */
    const handleClickSearchButton = () => {
        dispatch(getSetMenuBoardsList(changeSetMenuSearchOption({ ...search, page: 0 })));
    };

    /**
     * 초기화
     */
    const handleClickSearchResetButton = () => {
        // 보드 타입(S: 서비스, A: 관리자)
        setSearch({
            ...initialState.setMenu.search,
            boardType: boardType,
        });
    };

    /**
     * 등록 버튼
     */
    const handleBoardNewButton = () => {
        history.push(`${match.path}/add`);
    };

    useEffect(() => {
        // 공통 구분값 boardType이 업데이트되면 검색 옵션, store 겁색 옵션 설정
        if (boardType) {
            setSearch({
                ...storeSearch,
                boardType: boardType,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardType]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    return (
        <Form.Row className="mb-14">
            <Col xs={2} className="p-0 pr-2">
                <MokaInput as="select" name="usedYn" value={search.usedYn} onChange={handleSearchChange}>
                    <option value="">전체</option>
                    <option value="Y">사용</option>
                    <option value="N">중지</option>
                </MokaInput>
            </Col>
            <MokaSearchInput
                id="keyword"
                name="keyword"
                className="flex-fill mr-1"
                placeholder="게시판명, 설명"
                value={search.keyword}
                onChange={handleSearchChange}
                onSearch={handleClickSearchButton}
            />
            <Button variant="negative" className="mr-1" onClick={handleClickSearchResetButton}>
                초기화
            </Button>
            <Button variant="positive" onClick={handleBoardNewButton}>
                등록
            </Button>
        </Form.Row>
    );
};

export default BoardsListSearch;
