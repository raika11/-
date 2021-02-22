import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaSearchInput } from '@components';
import ReporterSearchListModal from '../../modals/ReporterSearchListModal';
import { initialState, changeSearchOption, getReporterList } from '@store/reporter';

/**
 * 페이지편집 > 기자 목록 > 기자 검색
 */
const ReporterDeskSearch = (props) => {
    const { show } = props;
    const dispatch = useDispatch();
    const [datasetApiListModalShow, setDatasetApiListModalShow] = useState(false);
    const { search: storeSearch } = useSelector((store) => ({
        search: store.reporter.search,
    }));

    const [search, setSearch] = useState(initialState.search);

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        if (show) {
            dispatch(getReporterList());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        dispatch(
            getReporterList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, search]);

    /**
     * 검색 옵션 변경
     * @param {*} e 이벤트
     */
    const handleChangeSearchOption = (e) => {
        setSearch({
            ...search,
            keyword: e.target.value,
        });
    };

    /**
     * dataApiListPopup 저장 이벤트 핸들러
     * @param {Object} selectApi 선택한 API
     * @param {function} hideCallback 숨김 함수
     */
    const handleClicktListModalSave = (data, hideCallback) => {
        if (data) {
            setSearch({
                ...search,
                keyword: data.repName,
            });
            hideCallback();
        }
    };

    return (
        <React.Fragment>
            <MokaSearchInput
                className="mb-14"
                value={search.keyword}
                onChange={handleChangeSearchOption}
                onSearch={handleSearch}
                placeholder="기자 이름을 검색하세요"
                name="keyword"
            />
            <ReporterSearchListModal show={datasetApiListModalShow} onHide={() => setDatasetApiListModalShow(false)} onClickSave={handleClicktListModalSave} />
        </React.Fragment>
    );
};

export default ReporterDeskSearch;
