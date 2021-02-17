import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { DESK_HIST_PUBLISH, DESK_HIST_SAVE } from '@/constants';
import { MokaTable, MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { initialState } from '@store/history';
import columnDefs from './ComponentWorkHistoryListColumns';

const ComponentWorkHistoryList = (props) => {
    const { search, setSearch, componentList, total, loading, rowData, onChange, onRowClick, onSearch, isNaverChannel = false, selectedComponentHistSeq } = props;

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({
            ...search,
            [name]: value,
        });
    };

    const handleDate = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, regDt: date });
        } else if (date === '') {
            setSearch({ ...search, regDt: null });
        }
    };

    return (
        <div style={{ width: 400 }} className="d-flex flex-column pr-3 h-100">
            {/* 컴포넌트 명 */}
            {!isNaverChannel && (
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInput as="select" onChange={handleChangeValue} name="componentSeq" value={search.componentSeq}>
                            <option hidden>컴포넌트 명</option>
                            {componentList.map((comp) => (
                                <option key={comp.componentSeq} value={comp.componentSeq}>
                                    {comp.componentName}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                </Form.Row>
            )}

            {/* 날짜 검색 */}
            <Form.Row className="mb-2">
                <div className="flex-shrink-0 mr-40">
                    <MokaInput as="select" value={search.status} name="status" onChange={handleChangeValue}>
                        <option value={DESK_HIST_PUBLISH}>전송 기록</option>
                        <option value={DESK_HIST_SAVE}>임시저장 기록</option>
                    </MokaInput>
                </div>
                <MokaInputLabel
                    label="날짜"
                    as="dateTimePicker"
                    labelWidth={28}
                    className="flex-fill"
                    inputProps={{
                        timeFormat: null,
                    }}
                    value={search.regDt}
                    onChange={handleDate}
                />
            </Form.Row>

            {/* 검색조건, 키워드 */}
            <Form.Row className="mb-2">
                <div className="flex-shrink-0 pr-2">
                    <MokaInput as="select" value={search.searchType} name="searchType" onChange={handleChangeValue}>
                        {initialState.searchTypeList.map((searchType) => (
                            <option value={searchType.id} key={searchType.id}>
                                {searchType.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>
                <MokaSearchInput
                    value={search.keyword}
                    className="flex-fill"
                    name="keyword"
                    onChange={handleChangeValue}
                    onSearch={() => onSearch(search)}
                    buttonDisabled={!search.componentSeq}
                />
            </Form.Row>

            {/* search의 테이블 */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(history) => history.seq}
                onRowClicked={onRowClick}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={onChange}
                preventRowClickCell={['load']}
                selected={selectedComponentHistSeq}
            />
        </div>
    );
};

export default ComponentWorkHistoryList;
