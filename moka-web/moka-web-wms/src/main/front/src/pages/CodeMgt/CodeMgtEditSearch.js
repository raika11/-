import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { MokaSearchInput, MokaInput } from '@components';
import { clearCdList, initialState, getCodeMgtList, changeSearchOption, getCodeMgtGrp } from '@store/codeMgt';
import CodeMgtEditModal from './modals/CodeMgtEditModal';

/**
 * 기타코드 편집 검색
 */
const CodeMgtEditSearch = (props) => {
    const { grpCd } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const { onSave, onDelete } = props;
    const { search: storeSearch, grp } = useSelector((store) => ({
        search: store.codeMgt.cdSearch,
        grp: store.codeMgt.grp,
    }));
    const [search, setSearch] = useState(initialState.cdSearch);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    /**
     * 검색 버튼
     */
    const handleSearch = () => {
        dispatch(
            getCodeMgtList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    };

    useEffect(() => {
        if (grpCd) {
            dispatch(getCodeMgtGrp(grpCd));
        } else if (!grpCd) {
            dispatch(clearCdList());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (grp.seqNo) {
            dispatch(
                getCodeMgtList(
                    changeSearchOption({
                        ...search,
                        page: 0,
                    }),
                ),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form.Row className="m-0 mb-2">
            <Col xs={1} className="p-0 pr-2">
                <MokaInput
                    as="select"
                    value={search.searchType || undefined}
                    onChange={(e) => {
                        setSearch({
                            ...search,
                            searchType: e.target.value,
                        });
                    }}
                >
                    <option value="dtlCd">코드</option>
                    <option value="cdNm">코드명</option>
                </MokaInput>
            </Col>
            <Col xs={4} className="p-0 pr-2">
                <MokaSearchInput
                    value={search.keyword}
                    onChange={(e) => {
                        setSearch({
                            ...search,
                            keyword: e.target.value,
                        });
                    }}
                    onSearch={handleSearch}
                />
            </Col>
            <Col xs={1} className="p-0">
                <Button
                    variant="dark"
                    onClick={() => {
                        history.push(`/codeMgt/${grpCd}`);
                        setShowAddModal(true);
                    }}
                >
                    코드 추가
                </Button>
            </Col>
            <CodeMgtEditModal type="add" show={showAddModal} onHide={() => setShowAddModal(false)} onSave={onSave} onDelete={onDelete} data={grpCd} />
        </Form.Row>
    );
};

export default CodeMgtEditSearch;
