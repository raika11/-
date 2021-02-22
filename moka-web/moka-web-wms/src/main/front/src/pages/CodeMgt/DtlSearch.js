import React, { useState, useEffect, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { MokaSearchInput, MokaInput } from '@components';
import { messageBox } from '@utils/toastUtil';
import { initialState, getDtlList, changeDtlSearchOption } from '@store/codeMgt';
import EditDtlModal from './modals/EditDtlModal';

/**
 * 상세코드 목록 내 검색
 */
const DtlSearch = ({ grpCd, grp }) => {
    const dispatch = useDispatch();
    const { search: storeSearch } = useSelector(({ codeMgt }) => codeMgt.dtl);
    const [search, setSearch] = useState(initialState.dtl.search);
    const [show, setShow] = useState(false);

    /**
     * 상세코드 목록 검색
     */
    const handleSearch = useCallback(
        (grpCd, changeSearchOption = true) => {
            const ns = { ...search, grpCd: grpCd || search.grpCd };
            if (changeSearchOption) dispatch(changeDtlSearchOption(ns));
            dispatch(
                getDtlList({
                    search: ns,
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

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 코드 등록 버튼
     */
    const handleAdd = () => setShow(true);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        if (grpCd) {
            handleSearch(grpCd);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [grpCd]);

    return (
        <Form.Row className="mb-14">
            <div className="mr-2 flex-shrink-0">
                <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                    <option value="dtlCd">코드</option>
                    <option value="cdNm">코드명</option>
                </MokaInput>
            </div>
            <div className="w-25 mr-1">
                <MokaSearchInput value={search.keyword} name="keyword" onChange={handleChangeValue} onSearch={handleSearch} />
            </div>
            <Button variant="positive" onClick={handleAdd} className="h-100">
                코드 등록
            </Button>

            {/* 코드 수정 모달 */}
            <EditDtlModal show={show} onHide={() => setShow(false)} grpCd={grpCd} grp={grp} />
        </Form.Row>
    );
};

export default DtlSearch;
