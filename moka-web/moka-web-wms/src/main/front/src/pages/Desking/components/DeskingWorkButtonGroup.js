import React, { useState, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaIcon, MokaOverlayTooltipButton } from '@components';
import toast from '@utils/toastUtil';
import { getComponentWork, postSaveComponentWork, postPublishComponentWork } from '@store/desking';

const HtmlEditModal = React.lazy(() => import('../modals/HtmlEditModal'));
const RegisterModal = React.lazy(() => import('../modals/RegisterModal'));

/**
 * 데스킹 워크 버튼 그룹 컴포넌트
 */
const DeskingWorkButtonGroup = (props) => {
    const { component, agGridIndex, componentAgGridInstances, setComponentAgGridInstances } = props;
    const dispatch = useDispatch();

    // modal state
    const [htmlEditModal, setHtmlEditModal] = useState(false);
    const [htmlEditModalData, sethtmlEditModalData] = useState({});
    const [registerModal, setRegisterModal] = useState(false);

    const title = `ID: CP${component.componentSeq} ${component.componentName}`;

    /**
     * HTML편집 버튼 클릭
     */
    const handleHtmlEditClicked = () => {
        const option = {
            componentWorkSeq: component.seq,
            callback: ({ header, body }) => {
                if (header.success) {
                    if (body) {
                        sethtmlEditModalData(body);
                        setHtmlEditModal(true);
                    }
                } else {
                    toast.warn(header.message);
                }
            },
        };
        dispatch(getComponentWork(option));
    };

    /**
     * 기사이동 버튼 클릭
     */
    const handleRegisterClicked = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!componentAgGridInstances[agGridIndex]) return;
        const api = componentAgGridInstances[agGridIndex].api;

        if (api.getSelectedRows().length < 1) {
            toast.warn('기사를 선택해주세요');
        } else {
            setRegisterModal(true);
        }
    };

    /**
     * 임시저장
     */
    const handleSaveComponentWork = () => {
        const option = {
            componentWorkSeq: component.seq,
            callback: ({ header }) => {
                if (header.success) {
                    toast.success(header.message);
                } else {
                    toast.error(header.message);
                }
            },
        };
        dispatch(postSaveComponentWork(option));
    };

    /**
     * 전송
     */
    const handlePublishComponentWork = () => {
        const option = {
            componentWorkSeq: component.seq,
            callback: ({ header }) => {
                if (header.success) {
                    toast.success(header.message);
                } else {
                    toast.error(header.message);
                }
            },
        };
        dispatch(postPublishComponentWork(option));
    };

    const iconButton = [
        { title: '관련기사 정보', iconName: 'fal-minus-circle' },
        { title: 'HTML 수동편집', iconName: 'fal-minus-circle', onClick: handleHtmlEditClicked },
        { title: '템플릿', iconName: 'fal-minus-circle' },
        { title: '히스토리', iconName: 'fal-minus-circle' },
        { title: '기사 이동', iconName: 'fal-minus-circle', onClick: handleRegisterClicked },
        { title: '더미기사 등록', iconName: 'fal-minus-circle' },
        { title: '임시저장', iconName: 'fal-minus-circle', onClick: handleSaveComponentWork },
        { title: '전송', iconName: 'fal-minus-circle', onClick: handlePublishComponentWork },
        { title: '삭제', iconName: 'fal-minus-circle' },
    ];

    return (
        <React.Fragment>
            <div className="px-2 pt-1">
                <Row className="m-0 d-flex align-items-center justify-content-between">
                    <Col className="p-0" xs={6}>
                        <p className="ft-12 mb-0">{title}</p>
                    </Col>
                    <Col className="p-0 d-flex align-items-center justify-content-between" xs={6}>
                        {iconButton.map((icon, idx) => (
                            <MokaOverlayTooltipButton key={idx} tooltipText={icon.title} variant="white" className="p-0" onClick={icon.onClick}>
                                <MokaIcon iconName={icon.iconName} />
                            </MokaOverlayTooltipButton>
                        ))}
                    </Col>
                </Row>
            </div>

            {/* HTML 수동 편집 */}
            <Suspense>
                <HtmlEditModal show={htmlEditModal} onHide={() => setHtmlEditModal(false)} data={htmlEditModalData} />
            </Suspense>

            {/* 기사 이동 */}
            <Suspense>
                <RegisterModal
                    show={registerModal}
                    onHide={() => setRegisterModal(false)}
                    agGridIndex={agGridIndex}
                    component={component}
                    componentAgGridInstances={componentAgGridInstances}
                />
            </Suspense>
        </React.Fragment>
    );
};

export default DeskingWorkButtonGroup;
