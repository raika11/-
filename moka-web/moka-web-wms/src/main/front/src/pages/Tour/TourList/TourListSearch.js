import React, { useState } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaSearchInput } from '@/components';

/**
 * 신청목록 검색
 */
const TourListSearch = () => {
    const [startDate, setStartDate] = useState(moment().format(DB_DATEFORMAT));
    const [endDate, setEndDate] = useState(moment().format(DB_DATEFORMAT));
    const [keyword, setKeyword] = useState('');

    const handleClickReset = () => {
        setStartDate(moment().format(DB_DATEFORMAT));
        setEndDate(moment().format(DB_DATEFORMAT));
        setKeyword('');
    };

    return (
        <Form>
            <Form.Row className="mb-2 d-flex">
                <div style={{ width: 140 }}>
                    <MokaInput
                        className="mb-0 mr-2"
                        as="dateTimePicker"
                        value={startDate}
                        inputProps={{ timeFormat: null }}
                        name="holiday"
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setStartDate(date);
                            } else {
                                setStartDate(null);
                            }
                            // handleChangeValue
                        }}
                    />
                </div>
                <div style={{ width: 140 }}>
                    <MokaInput
                        className="mb-0 mr-2"
                        as="dateTimePicker"
                        value={endDate}
                        inputProps={{ timeFormat: null }}
                        name="holiday"
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setEndDate(date);
                            } else {
                                setEndDate(null);
                            }
                            // handleChangeValue
                        }}
                    />
                </div>
                <div className="flex-fill">
                    <MokaSearchInput
                        className="mr-2"
                        inputClassName="ft-12"
                        buttonClassName="ft-12"
                        placeholder="단체명을 입력해주세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <Button variant="negative" className="ft-12" onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default TourListSearch;
