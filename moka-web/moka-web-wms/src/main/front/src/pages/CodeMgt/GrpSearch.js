import React, { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, changeGrpSearchOption, getGrpList } from '@store/codeMgt';
import { MokaInput, MokaSearchInput } from '@components';
import { messageBox } from '@utils/toastUtil';
import EditGrpModal from './modals/EditGrpModal';

/**
 * 그룹 검색
 */
const GrpSearch = () => {
    const dispatch = useDispatch();
    const grpSearch = useSelector(({ codeMgt }) => codeMgt.grp.search);
    const [search, setSearch] = useState(initialState.grp.search);
    const [show, setShow] = useState(false);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;
        setSearch({ ...search, [name]: name === 'secretYn' ? (checked ? 'all' : 'N') : value });
    };

    /**
     * 등록 버튼
     */
    const handleAddClick = () => setShow(true);

    /**
     * 코드그룹 검색
     */
    const handleSearch = useCallback(
        (changeSearchOption = true) => {
            if (changeSearchOption) dispatch(changeGrpSearchOption(search));
            dispatch(
                getGrpList({
                    search,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        },
        [dispatch, search],
    );

    useEffect(() => {
        setSearch(grpSearch);
    }, [grpSearch]);

    useEffect(() => {
        // 숨김코드 변경 시 바로 조회
        handleSearch(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handleSearch(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search.secretYn]);

    return (
        <div className="mb-14">
            <div className="d-flex mb-14">
                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        {initialState.searchTypeList.map((op) => (
                            <option key={op.id} value={op.id}>
                                {op.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>
                <MokaSearchInput className="flex-fill" name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />
            </div>

            <div className="d-flex align-items-start justify-content-between">
                <MokaInput
                    as="checkbox"
                    id="secret-check"
                    name="secretYn"
                    onChange={handleChangeValue}
                    inputProps={{ label: '숨김 코드', custom: true, checked: search.secretYn === 'all' }}
                />
                <Button variant="positive" onClick={handleAddClick}>
                    그룹 등록
                </Button>
            </div>

            {/* 그룹 등록 모달 */}
            <EditGrpModal show={show} onHide={() => setShow(false)} />
        </div>
    );
};

export default GrpSearch;
