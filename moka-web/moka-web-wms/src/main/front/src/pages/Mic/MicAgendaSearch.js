import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import { MokaInput, MokaInputLabel } from '@/components';
import BannerModal from './modals/BannerModal';
import CategoryModal from './modals/CategoryModal';
import AgendaOrderModal from './modals/AgendaOrderModal';

const MicAgendaSearch = () => {
    const history = useHistory();
    const [agendaName, setAgendaName] = useState('');
    const [showMenu, setShowMenu] = useState('');
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [showCtModal, setShowCtModal] = useState(false);
    const [showAgendaModal, setShowAgendaModal] = useState(false);

    /**
     * 검색 버튼
     */
    const handleClickSearch = () => {};

    /**
     * 초기화 버튼
     */
    const handleClickReset = () => {};

    /**
     * 다른 주제 공통 배너 버튼
     */
    const handleClickBanner = () => {
        setShowBannerModal(true);
    };

    /**
     * 카테고리 버튼
     */
    const handleClickCategory = () => {
        setShowCtModal(true);
    };

    /**
     * 아젠다 순서 버튼
     */
    const handleClickOrderAgenda = () => {
        setShowAgendaModal(true);
    };

    /**
     * 등록 버튼
     */
    const handleClickAdd = () => {
        history.push('/mic/add');
    };

    return (
        <>
            <Form>
                <Form.Row className="mb-2">
                    <MokaInput className="ft-12 mb-0 mr-2" placeholder="아젠다 명을 입력해주세요" value={agendaName} onChange={(e) => setAgendaName(e.target.value)} />
                    <Col className="p-0" xs={4}>
                        <MokaInputLabel
                            label="메뉴 노출"
                            labelClassName="ft-12"
                            className="mb-0 mr-2"
                            inputClassName="ft-12"
                            as="select"
                            value={showMenu}
                            onChange={(e) => setShowMenu(e.target.value)}
                        >
                            <option value="">전체 노출</option>
                            <option value="Y">최상단</option>
                            <option value="N">비노출</option>
                        </MokaInputLabel>
                    </Col>
                    <Col className="p-0 d-flex">
                        <Button className="ft-12 mr-2" variant="searching" onClick={handleClickSearch}>
                            검색
                        </Button>
                        <Button className="ft-12" variant="negative" onClick={handleClickReset}>
                            초기화
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2 d-flex justify-content-end">
                    <Button className="ft-12 mr-2" variant="outline-neutral" onClick={handleClickBanner}>
                        다른 주제 공통 배너
                    </Button>
                    <Button className="ft-12 mr-2" variant="outline-neutral" onClick={handleClickCategory}>
                        카테고리
                    </Button>
                    <Button className="ft-12 mr-2" variant="outline-neutral" onClick={handleClickOrderAgenda}>
                        아젠다 순서
                    </Button>
                    <Button className="ft-12" variant="positive" onClick={handleClickAdd}>
                        등록
                    </Button>
                </Form.Row>
            </Form>
            <BannerModal show={showBannerModal} onHide={() => setShowBannerModal(false)} />
            <CategoryModal show={showCtModal} onHide={() => setShowCtModal(false)} />
            <AgendaOrderModal show={showAgendaModal} onHide={() => setShowAgendaModal(false)} />
        </>
    );
};

export default MicAgendaSearch;
