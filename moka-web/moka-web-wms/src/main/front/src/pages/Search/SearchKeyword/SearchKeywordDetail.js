import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { clearStatDetail, getSearchKeywordStatDetail } from '@store/searchKeyword';
import { messageBox } from '@utils/toastUtil';
import { MokaCard, MokaInputLabel } from '@components';
import SearchKeywordDetailAgGrid from './SearchKeywordDetailAgGrid';

moment.locale('ko');

/**
 * 검색로그 상세
 */
const SearchKeywordDetail = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { keyword } = useParams();
    const search = useSelector(({ searchKeyword }) => searchKeyword.stat.search);
    const [type, setType] = useState('DATE');

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => setType(e.target.value);

    useEffect(() => {
        if (keyword && search.startDt && search.endDt) {
            dispatch(
                getSearchKeywordStatDetail({
                    search: { startDt: search.startDt, searchType: 'schKwd', keyword, endDt: search.endDt, statType: type },
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox(header.mesasge);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearStatDetail());
        }
    }, [keyword, search.startDt, search.endDt, dispatch, type]);

    useEffect(() => {
        return () => {
            dispatch(clearStatDetail());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard
            className="flex-fill"
            title="검색 로그 상세 현황"
            bodyClassName="d-flex flex-column"
            footer
            footerClassName="justify-content-center"
            footerButtons={[
                {
                    text: '취소',
                    variant: 'negative',
                    onClick: () => history.push(match.path),
                },
            ]}
        >
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0">
                    <MokaInputLabel label="검색어" inputClassName="font-weight-bold" inputProps={{ plaintext: true }} value={keyword} disabled />
                </Col>
                <Col xs={2} className="p-0">
                    <MokaInputLabel
                        as="radio"
                        inputProps={{ custom: true, label: '일자별', checked: type === 'DATE' }}
                        name="type"
                        value="DATE"
                        id="type-1"
                        onChange={handleChangeValue}
                    />
                </Col>
                <Col xs={2} className="p-0">
                    <MokaInputLabel
                        as="radio"
                        inputProps={{ custom: true, label: '영역별', checked: type === 'TAB' }}
                        name="type"
                        value="TAB"
                        id="type-2"
                        onChange={handleChangeValue}
                    />
                </Col>
            </Form.Row>

            <SearchKeywordDetailAgGrid type={type} />
        </MokaCard>
    );
};

export default SearchKeywordDetail;
