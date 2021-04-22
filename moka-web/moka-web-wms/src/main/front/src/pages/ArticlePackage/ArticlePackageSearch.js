import React, { useState } from 'react';
import { useHistory } from 'react-router';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@/components';

/**
 * 패키지 관리 > 기사 패키지 > 패키지 검색
 */
const ArticlePackageSearch = ({ match }) => {
    const history = useHistory();
    const [search, setSearch] = useState({
        type: '',
        subscribeYn: '',
        date: 'regDt',
        startDt: null,
        endDt: null,
        keyword: '',
    });
    const [period, setPeriod] = useState([0, 'all']);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        if (name === 'period') {
            const { number, date } = e.target.selectedOptions[0].dataset;
            setPeriod([Number(number), date]);

            // 기간 설정
            if (number === 0 && date === 'all') {
                setSearch({ ...search, startDt: null, endDt: null });
            } else {
                const nd = new Date();
                const startDt = moment(nd).subtract(Number(number), date).startOf('day');
                const endDt = moment(nd).endOf('day');
                setSearch({ ...search, startDt, endDt });
            }
        } else {
            setSearch({ ...search, [name]: value });
        }
    };

    /**
     * 검색
     */
    const handleClickSearch = () => {};

    /**
     * 초기화
     */
    const handleClickReset = () => {
        setSearch({ ...search, type: '', subscribeYn: '', date: 'regDt', startDt: null, endDt: null });
        setPeriod([0, 'all']);
    };

    /**
     * 등록
     */
    const handleClickAdd = () => {
        history.push(`${match.path}/add`);
    };

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <MokaInput as="select" className="mr-2" value={search.type} onChange={handleChangeValue}>
                    <option value="">구분 전체</option>
                    <option value="section">섹션</option>
                    <option value="tag">태그</option>
                    <option value="release">출고일 분류</option>
                </MokaInput>
                <MokaInput as="select" style={{ width: 150 }} className="mr-2" value={search.subscribeYn} onChange={handleChangeValue} inputProps={{ width: 120 }}>
                    <option value="">구독 가능 여부 전체</option>
                    <option value="Y">가능</option>
                    <option value="N">불가능</option>
                </MokaInput>
                <MokaInput as="select" className="mr-2" value={search.date} onChange={handleChangeValue}>
                    <option value="regDt">등록일</option>
                    <option value="offDt">종료일</option>
                </MokaInput>
                <MokaInput as="select" className="mr-2" name="period" value={period.join('')} onChange={handleChangeValue}>
                    <option value="0all" data-number="0" data-date="all">
                        기간 전체
                    </option>
                    <option value="7days" data-number="7" data-date="days">
                        1주
                    </option>
                    <option value="1months" data-number="1" data-date="months">
                        1개월
                    </option>
                    <option value="3months" data-number="3" data-date="months">
                        3개월
                    </option>
                    <option value="6months" data-number="6" data-date="months">
                        6개월
                    </option>
                </MokaInput>
                <Col xs={5} className="p-0 d-flex">
                    <MokaInput
                        as="dateTimePicker"
                        value={search.startDt}
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, startDt: date });
                            } else {
                                setSearch({ ...search, startDt: null });
                            }
                        }}
                    />
                    <p className="mb-0 mx-2 d-flex align-items-center">~</p>
                    <MokaInput
                        as="dateTimePicker"
                        value={search.endDt}
                        className="right"
                        inputProps={{ timeFormat: null, timeDefault: 'end' }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, endDt: date });
                            } else {
                                setSearch({ ...search, endDt: null });
                            }
                        }}
                    />
                </Col>
            </Form.Row>

            <Form.Row>
                <MokaSearchInput
                    placeholder="패키지 명을 입력해주세요"
                    className="mr-1 flex-fill"
                    value={search.keyword}
                    onSearch={handleClickSearch}
                    onChange={handleChangeValue}
                />
                <Button variant="negative" className="mr-1" onClick={handleClickReset}>
                    초기화
                </Button>
                <Button variant="positive" onClick={handleClickAdd}>
                    기사 패키지 등록
                </Button>
            </Form.Row>
        </Form>
    );
};

export default ArticlePackageSearch;
