import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { defaultArticleSearchType } from '@pages/commons';

/**
 * 기사 검색
 */
const ArticleSearch = () => {
    return (
        <Form>
            <Form.Row className="d-flex mb-2">
                {/* 시작일 */}
                <div style={{ width: 138 }} className="mr-2">
                    <MokaInput as="dateTimePicker" inputClassName="ft-12" inputProps={{ timeFormat: null }} />
                </div>

                {/* 종료일 */}
                <div style={{ width: 138 }} className="mr-2">
                    <MokaInput as="dateTimePicker" inputClassName="ft-12" inputProps={{ timeFormat: null }} />
                </div>

                {/* 검색 조건 */}
                <div style={{ width: 138 }} className="mr-2">
                    <MokaInput as="select" disabled>
                        {defaultArticleSearchType.map((searchType) => (
                            <option key={searchType.id} value={searchType.id}>
                                {searchType.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                {/* 키워드 */}
                <MokaSearchInput variant="dark" className="flex-fill" disabled />
            </Form.Row>
            <Form.Row className="d-flex mb-2 justify-content-between">
                <div className="d-flex">
                    <div style={{ width: 186 }} className="mr-2">
                        <MokaInput as="select" disabled>
                            <option hidden>분류 전체</option>
                        </MokaInput>
                    </div>

                    <div style={{ width: 186 }} className="mr-2">
                        <MokaInput as="select" disabled>
                            <option hidden>매체 전체</option>
                        </MokaInput>
                    </div>

                    <div style={{ width: 120 }} className="mr-2">
                        <MokaInputLabel label="면" labelWidth={45} className="mb-0" disabled />
                    </div>

                    <div style={{ width: 120 }} className="mr-2">
                        <MokaInputLabel label="판" labelWidth={45} className="mb-0" disabled />
                    </div>
                </div>

                <Button variant="dark" className="ft-12">
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default ArticleSearch;
