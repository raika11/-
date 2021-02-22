import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@components';
import { initialState, getMicReport, getMicAgendaList, getMicCategoryList, changeSearchOption } from '@store/mic';
import { messageBox } from '@utils/toastUtil';
import BannerModal from './modals/BannerModal/index';
import CategoryModal from './modals/CategoryModal';
import OrderModal from './modals/OrderModal';

/**
 * 시민 마이크 아젠다 검색
 */
const MicAgendaSearch = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { search: storeSearch, answTotal, agndTotal } = useSelector(({ mic }) => mic);
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [showCtModal, setShowCtModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [search, setSearch] = useState(initialState.search);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 검색
     */
    const handleSearch = useCallback(
        (search) => {
            dispatch(getMicReport());
            dispatch(
                getMicAgendaList({
                    search,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        },
        [dispatch],
    );

    /**
     * 검색 버튼
     */
    const handleClickSearch = () => {
        dispatch(changeSearchOption(search));
        handleSearch(search);
    };

    /**
     * 초기화
     */
    const handleClickReset = () => setSearch(initialState.search);

    /**
     * 등록
     */
    const handleClickAdd = () => history.push(`${match.path}/add`);

    useEffect(() => {
        handleSearch(initialState.search);
    }, [dispatch, handleSearch]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        // 카테고리 목록 조회
        dispatch(
            getMicCategoryList({
                search: initialState.category.search,
            }),
        );
    }, [dispatch]);

    return (
        <div className="mb-14">
            {/* 검색조건 */}
            <div className="d-flex mb-2">
                <MokaInput name="keyword" className="mr-2" placeholder="아젠다 명을 입력해주세요" value={search.keyword} onChange={handleChangeValue} />
                <div className="flex-shrink-0 mr-2">
                    <MokaInput name="agndTop" className="mb-0 mr-2" as="select" value={search.agndTop} onChange={handleChangeValue}>
                        {initialState.agndTopList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>
                <Button className="mr-1 flex-shrink-0" variant="searching" onClick={handleClickSearch}>
                    검색
                </Button>
                <Button variant="negative" className="flex-shrink-0" onClick={handleClickReset}>
                    초기화
                </Button>
            </div>

            {/* 아젠다, 전체 포스트 수 + 버튼 */}
            <div className="d-flex justify-content-between">
                <div className="d-flex align-items-end">
                    <p className="mb-0 mr-3">
                        아젠다 : <span className="color-primary">{agndTotal}</span>
                    </p>
                    <p className="mb-0">
                        전체 포스트 수 : <span className="color-primary">{answTotal}</span>
                    </p>
                </div>
                <div className="d-flex">
                    <Button className="mr-1" variant="outline-neutral" onClick={() => setShowBannerModal(true)}>
                        다른 주제 공통 배너
                    </Button>
                    <Button className="mr-1" variant="outline-neutral" onClick={() => setShowCtModal(true)}>
                        카테고리
                    </Button>
                    <Button className="mr-1" variant="outline-neutral" onClick={() => setShowOrderModal(true)}>
                        아젠다 순서
                    </Button>
                    <Button variant="positive" onClick={handleClickAdd}>
                        등록
                    </Button>
                </div>
            </div>

            {/* 배너 모달 */}
            <BannerModal show={showBannerModal} onHide={() => setShowBannerModal(false)} />

            {/* 카테고리 모달 */}
            <CategoryModal show={showCtModal} onHide={() => setShowCtModal(false)} />

            {/* 순서 모달 */}
            <OrderModal show={showOrderModal} onHide={() => setShowOrderModal(false)} />
        </div>
    );
};

export default MicAgendaSearch;
