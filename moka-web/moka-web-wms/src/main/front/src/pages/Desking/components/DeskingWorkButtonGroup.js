import React, { useState, Suspense, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';
import { MokaIcon, MokaOverlayTooltipButton } from '@components';
import toast from '@utils/toastUtil';
import { getComponentWork, postSaveComponentWork, postPublishComponentWork, deleteDeskingWorkList } from '@store/desking';

const HtmlEditModal = React.lazy(() => import('../modals/HtmlEditModal'));
const RegisterModal = React.lazy(() => import('../modals/RegisterModal'));

/**
 * 커스텀 토글
 */
const customToggle = forwardRef(({ onClick, id }, ref) => {
    return (
        <div ref={ref} className="px-2" onClick={onClick} id={id}>
            <MokaIcon iconName="fal-ellipsis-v-alt" />
        </div>
    );
});

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
     * HTML편집 버튼
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
     * 기사이동 버튼
     */
    const handleRegisterClicked = () => {
        if (!componentAgGridInstances[agGridIndex]) return;
        const api = componentAgGridInstances[agGridIndex].api;

        if (api.getSelectedRows().length < 1) {
            toast.warn('기사를 선택해주세요');
        } else {
            setRegisterModal(true);
        }
    };

    /**
     * 전체삭제
     */
    const handleDeleteClicked = () => {
        if (component.deskingWorks.length > 0) {
            const option = {
                componentWorkSeq: component.seq,
                datasetSeq: component.datasetSeq,
                list: component.deskingWorks,
                callback: ({ header }) => {
                    if (!header.success) {
                        toast.error(header.message);
                    }
                },
            };
            dispatch(deleteDeskingWorkList(option));
        }
    };

    const iconButton = [
        { title: 'HTML 수동편집', iconName: 'fal-code', onClick: handleHtmlEditClicked },
        { title: '템플릿', iconName: 'fal-expand-wide' },
        { title: '임시저장', iconName: 'fal-save', onClick: handleSaveComponentWork },
        { title: '전송', iconName: 'fal-share-square', onClick: handlePublishComponentWork },
    ];

    return (
        <>
            <div className="px-2 pt-1">
                <Row className="m-0 d-flex align-items-center justify-content-between">
                    <Col className="p-0" xs={6}>
                        <p className="ft-12 mb-0">
                            <OverlayTrigger overlay={<Tooltip>{`데이타셋ID: ${component.datasetSeq}`}</Tooltip>}>
                                <div>{title}</div>
                            </OverlayTrigger>
                        </p>
                    </Col>
                    <Col className="p-0 d-flex align-items-center justify-content-end" xs={6}>
                        {iconButton.map((icon, idx) => (
                            <MokaOverlayTooltipButton key={idx} tooltipText={icon.title} variant="white" className="px-2 mx-auto" onClick={icon.onClick}>
                                <MokaIcon iconName={icon.iconName} />
                            </MokaOverlayTooltipButton>
                        ))}
                        <MokaOverlayTooltipButton tooltipText="더보기" variant="white" className="p-0 mx-auto">
                            <Dropdown>
                                <Dropdown.Toggle as={customToggle} id="dropdown-desking-edit" />
                                <Dropdown.Menu className="ft-12">
                                    <Dropdown.Item eventKey="1">공백 추가</Dropdown.Item>
                                    <Dropdown.Item eventKey="2" onClick={handleDeleteClicked}>
                                        전체 삭제
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="3" onClick={handleRegisterClicked}>
                                        기사 이동
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="4">리스트 건수</Dropdown.Item>
                                    <Dropdown.Item eventKey="5" style={component.viewYn === 'Y' ? { color: 'red' } : { color: 'black' }} disabled>
                                        영역 노출
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </MokaOverlayTooltipButton>
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
        </>
    );
};

export default DeskingWorkButtonGroup;
