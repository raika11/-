import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { DESK_HIST_PUBLISH, DESK_HIST_SAVE } from '@/constants';
import { MokaTable, MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { initialState } from '@store/history';
import columnDefs from './ComponentWorkHistoryListColumns';

const ComponentWorkHistoryList = (props) => {
    const { search, setSearch, componentList, total, loading, rowData, onChange, onRowClick, onSearch } = props;

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
        <div style={{ width: 400 }} className="pr-3">
            <Form>
                {/* 컴포넌트 명 */}
                <MokaInput as="select" className="mb-2 ft-12" onChange={handleChangeValue} name="componentSeq" value={search.componentSeq}>
                    <option hidden>컴포넌트 명</option>
                    {componentList.map((comp) => (
                        <option key={comp.componentSeq} value={comp.componentSeq}>
                            {comp.componentName}
                        </option>
                    ))}
                </MokaInput>
                {/* 날짜 검색 */}
                <Form.Row className="mb-2">
                    <Col xs={4} className="p-0 pr-2">
                        <MokaInput as="select" className="mb-0 ft-12" value={search.status} name="status" onChange={handleChangeValue}>
                            <option value={DESK_HIST_PUBLISH}>전송 기록</option>
                            <option value={DESK_HIST_SAVE}>임시저장 기록</option>
                        </MokaInput>
                    </Col>
                    <Col xs={8} className="p-0">
                        <MokaInputLabel
                            label="날짜"
                            as="dateTimePicker"
                            labelWidth={28}
                            className="mb-0 w-100"
                            inputProps={{
                                timeFormat: null,
                                inputClassName: 'ft-12',
                            }}
                            value={search.regDt}
                            onChange={handleDate}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    {/* 검색조건 */}
                    <Col xs={4} className="p-0 pr-2">
                        <MokaInput as="select" className="mb-0 ft-12" value={search.searchType} name="keyword" onChange={handleChangeValue}>
                            {initialState.searchTypeList.map((searchType) => (
                                <option value={searchType.id} key={searchType.id}>
                                    {searchType.name}
                                </option>
                            ))}
                        </MokaInput>
                    </Col>
                    {/* 키워드 */}
                    <Col xs={8} className="p-0 mb-0">
                        <MokaSearchInput
                            value={search.keyword}
                            name="keyword"
                            onChange={handleChangeValue}
                            onSearch={() => onSearch(search)}
                            buttonDisabled={!search.componentSeq}
                        />
                    </Col>
                </Form.Row>
            </Form>

            {/* search의 테이블 */}
            <MokaTable
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(history) => history.seq}
                agGridHeight={558}
                onRowClicked={onRowClick}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={onChange}
                preventRowClickCell={['load']}
            />
        </div>
    );
};

export default ComponentWorkHistoryList;
