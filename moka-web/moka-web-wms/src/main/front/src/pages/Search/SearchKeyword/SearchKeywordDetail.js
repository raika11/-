import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { initialState, clearStatDetail, getSearchKeywordStatDetail, changeDetailSearchOption } from '@store/searchKeyword';
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
    const statSearch = useSelector(({ searchKeyword }) => searchKeyword.stat.search);
    const [type, setType] = useState('DATE');

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => setType(e.target.value);

    useEffect(() => {
        if (keyword && statSearch.startDt && statSearch.endDt) {
            const ns = {
                ...initialState.statDetail.search,
                startDt: statSearch.startDt,
                endDt: statSearch.endDt,
                keyword,
                statType: type,
                page: 0,
            };
            dispatch(changeDetailSearchOption(ns));
            dispatch(
                getSearchKeywordStatDetail({
                    search: ns,
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
    }, [keyword, statSearch.startDt, statSearch.endDt, dispatch, type]);

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
            titleButtons={[
                {
                    text: '취소',
                    variant: 'negative',
                    onClick: () => history.push(match.path),
                },
            ]}
        >
            <div className="mb-14">
                <Row noGutters>
                    <Col xs={8} className="pr-2">
                        <MokaInputLabel label="검색어" inputClassName="font-weight-bold" inputProps={{ plaintext: true }} value={keyword} disabled />
                    </Col>
                    <Col xs={4} className="d-flex justify-content-end">
                        <MokaInputLabel
                            as="radio"
                            inputProps={{ custom: true, label: '일자별', checked: type === 'DATE' }}
                            name="type"
                            value="DATE"
                            id="type-1"
                            className="mr-3"
                            onChange={handleChangeValue}
                        />
                        <MokaInputLabel
                            as="radio"
                            inputProps={{ custom: true, label: '영역별', checked: type === 'TAB' }}
                            name="type"
                            value="TAB"
                            id="type-2"
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Row>
            </div>

            <SearchKeywordDetailAgGrid type={type} />
        </MokaCard>
    );
};

export default SearchKeywordDetail;
