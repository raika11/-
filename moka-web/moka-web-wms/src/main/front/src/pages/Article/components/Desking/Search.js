import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaSearchInput } from '@components';
import { CodeAutocomplete } from '@pages/commons';
import { ChangeArtGroupModal } from '@pages/Article/modals';
import { initialState } from '@store/article';
import SourceSelector from './SourceSelector';

/**
 * 페이지편집 > 기사 목록 > 기사 검색
 */
const Search = (props) => {
    const { onChangeSearchOption, search, period, error, onSearch, onReset, onChangeGroupNumber, sourceList, suppressChangeArtGroup, show, suppressSearchMyunPan } = props;
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
    const handleChangeSDate = (date) => {
        if (date !== '') {
            onChangeSearchOption({ key: 'startServiceDay', value: date });
        } else {
            onChangeSearchOption({ key: 'startServiceDay', value: null });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleChangeEDate = (date) => {
        if (date !== '') {
            onChangeSearchOption({ key: 'endServiceDay', value: date });
        } else {
            onChangeSearchOption({ key: 'endServiceDay', value: null });
        }
    };

    /**
     * 분류 변경
     * @param {string} value value
     */
    const handleChangeMasterCode = (value) => onChangeSearchOption({ key: 'masterCode', value });

    /**
     * 매체 변경
     * @param {string} value 매체
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

                {/* 분류 */}
                <div className="flex-fill mr-2" style={{ width: 340 }}>
                    <CodeAutocomplete name="masterCode" placeholder="분류 선택" value={search.masterCode} onChange={handleChangeMasterCode} show={show} />
                </div>

                <Button variant="searching" className="flex-shrink-0" onClick={onSearch}>
                    검색
                </Button>
            </Form.Row>
            <Form.Row className="d-flex mb-14 justify-content-between">
                <div className="d-flex flex-fill">
                    {/* 기사타입 조건 */}
                    <div style={{ width: 110 }} className="flex-shrink-0 mr-2">
                        <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                            {initialState.searchTypeList.map((searchType) => (
                                <option key={searchType.id} value={searchType.id}>
                                    {searchType.name}
                                </option>
                            ))}
                        </MokaInput>
                    </div>

                    {/* 매체 */}
                    <SourceSelector
                        sourceList={sourceList}
                        className="flex-shrink-0 mr-2"
                        value={search.sourceList}
                        onChange={handleChangeSourceList}
                        isInvalid={error.sourceList}
                    />

                    {/* 검색 조건 */}
                    <div style={{ width: 110 }} className="flex-shrink-0 mr-2">
                        <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                            {initialState.searchTypeList.map((searchType) => (
                                <option key={searchType.id} value={searchType.id}>
                                    {searchType.name}
                                </option>
                            ))}
                        </MokaInput>
                    </div>

                    {/* 키워드 */}
                    <MokaInput name="keyword" value={search.keyword} className="mr-2" onChange={handleChangeValue} placeholder="검색어를 입력하세요" />

                    {!suppressSearchMyunPan && (
                        <React.Fragment>
                            {/* 면 */}
                            <div style={{ width: 60 }} className="flex-shrink-0 mr-2">
                                <MokaInput placeholder="면" name="pressMyun" onChange={handleChangeValue} value={search.pressMyun} />
                            </div>

                            {/* 판 */}
                            <div style={{ width: 60 }} className="flex-shrink-0 mr-2">
                                <MokaInput placeholder="판" name="pressPan" onChange={handleChangeValue} value={search.pressPan} />
                            </div>
                        </React.Fragment>
                    )}
                </div>

                <div className="d-flex">
                    {!suppressChangeArtGroup && (
                        <React.Fragment>
                            <Button variant="outline-neutral" className="mr-1 flex-shrink-0" onClick={() => setModalShow(true)}>
                                그룹지정
                            </Button>

                            {/* 편집그룹 변경 모달 */}
                            <ChangeArtGroupModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                                onSave={() => {
                                    onChangeGroupNumber();
                                    setModalShow(false);
                                }}
                            />
                        </React.Fragment>
                    )}

                    {/* 초기화 */}
                    <Button variant="negative" className="flex-shrink-0" onClick={onReset}>
                        초기화
                    </Button>
                </div>
            </Form.Row>
        </Form>
    );
};

export default Search;
