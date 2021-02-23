import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaSearchInput } from '@components';
import { CodeAutocomplete } from '@pages/commons';
import { ChangeArtGroupModal } from '@pages/Article/modals';
import { SourceSelector } from '@pages/commons';
import { initialState } from '@store/article';

/**
 * 페이지편집 기사 검색 공통 컴포넌트
 */
const Search = (props) => {
    const { onChangeSearchOption, search, period, isNaverChannel, error, onSearch, onReset, onChangeGroupNumber, media = false } = props;
    const [modalShow, setModalShow] = useState(false);

    /**
     * 입력값 변경
     * @param {object} e Event
     */
    const handleChangeValue = (e) => onChangeSearchOption({ key: e.target.name, value: e.target.value });

    /**
     * 기간 변경
     * @param {object} e 이벤트
     */
    const handleChangePeriod = (e) => {
        const { number, date } = e.target.selectedOptions[0].dataset;
        onChangeSearchOption({ key: 'period', number, date });
    };

    /**
     * 시작일 변경
     * @param {object} date moment object
     */
    const handleChangeSDate = (date) => onChangeSearchOption({ key: 'startServiceDay', value: typeof date === 'object' ? date : null });

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleChangeEDate = (date) => onChangeSearchOption({ key: 'endServiceDay', value: typeof date === 'object' ? date : null });

    /**
     * 분류 변경
     * @param {string} value value
     */
    const handleChangeMasterCode = (value) => onChangeSearchOption({ key: 'masterCode', value });

    /**
     * 매체 변경
     * @param {string} value 매체리스트
     */
    const handleChangeSourceList = (value) => onChangeSearchOption({ key: 'sourceList', value });

    return (
        <Form>
            <Form.Row className="d-flex mb-2">
                {/* 검색기간 */}
                <div style={{ width: 78 }} className="mr-2">
                    <MokaInput as="select" name="period" onChange={handleChangePeriod} value={period.join('')}>
                        <option value="2days" data-number="2" data-date="days">
                            2일
                        </option>
                        <option value="3days" data-number="3" data-date="days">
                            3일
                        </option>
                        <option value="7days" data-number="7" data-date="days">
                            7일
                        </option>
                        <option value="1months" data-number="1" data-date="months">
                            1개월
                        </option>
                        <option value="3months" data-number="3" data-date="months">
                            3개월
                        </option>
                    </MokaInput>
                </div>

                {/* 시작일 */}
                <div className="mr-2">
                    <MokaInput
                        as="dateTimePicker"
                        inputProps={{ timeFormat: null, timeDefault: 'start', width: 140 }}
                        onChange={handleChangeSDate}
                        value={search.startServiceDay}
                    />
                </div>

                {/* 종료일 */}
                <div className="mr-2">
                    <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, timeDefault: 'end', width: 140 }} onChange={handleChangeEDate} value={search.endServiceDay} />
                </div>

                {/* 검색 조건 */}
                <div style={{ width: 110 }} className="mr-2">
                    <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        {initialState.searchTypeList.map((searchType) => (
                            <option key={searchType.id} value={searchType.id}>
                                {searchType.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                {/* 키워드 */}
                <MokaSearchInput className="flex-fill mr-1" name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={onSearch} />

                {/* 초기화 */}
                <Button variant="negative" className="flex-shrink-0" onClick={onReset}>
                    초기화
                </Button>
            </Form.Row>
            <Form.Row className="d-flex mb-14 justify-content-between">
                <div className="d-flex">
                    {/* 분류 */}
                    <div style={{ width: 340 }} className="mr-2">
                        <CodeAutocomplete name="masterCode" className="mb-0" placeholder="분류 선택" value={search.masterCode} onChange={handleChangeMasterCode} />
                    </div>

                    {/* 매체 */}
                    <SourceSelector
                        className="mr-2"
                        value={search.sourceList}
                        onChange={handleChangeSourceList}
                        sourceType={isNaverChannel ? 'BULK' : 'DESKING'}
                        isInvalid={error.sourceList}
                    />

                    {/* 면 */}
                    <div style={{ width: 60 }} className="mr-2">
                        <MokaInput placeholder="면" name="pressMyun" onChange={handleChangeValue} value={search.pressMyun} disabled={media} />
                    </div>

                    {/* 판 */}
                    <div style={{ width: 60 }} className="mr-2">
                        <MokaInput placeholder="판" name="pressPan" onChange={handleChangeValue} value={search.pressPan} disabled={media} />
                    </div>
                </div>

                {!isNaverChannel && (
                    <React.Fragment>
                        <Button variant="outline-neutral" className="flex-shrink-0" onClick={() => setModalShow(true)}>
                            그룹지정
                        </Button>
                        {/* 그룹지정 변경 모달 */}
                        <ChangeArtGroupModal show={modalShow} onHide={() => setModalShow(false)} onSave={onChangeGroupNumber} />
                    </React.Fragment>
                )}
            </Form.Row>
        </Form>
    );
};

export default Search;
