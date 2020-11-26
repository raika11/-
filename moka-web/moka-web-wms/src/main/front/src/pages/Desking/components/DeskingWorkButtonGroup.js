import React, { useState, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';
import { MokaIcon, MokaOverlayTooltipButton } from '@components';
import toast from '@utils/toastUtil';
import { putComponentWork, postSaveComponentWork, postPublishComponentWork, deleteDeskingWorkList } from '@store/desking';

import HtmlEditModal from '../modals/HtmlEditModal';
import TemplateListModal from '@pages/Template/modals/TemplateListModal';
import AddSpaceModal from '../modals/AddSpaceModal';
import RegisterModal from '../modals/RegisterModal';
import ListNumberEditModal from '../modals/ListNumberEditModal';

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
    const { component, agGridIndex, componentAgGridInstances } = props;
    const dispatch = useDispatch();

    // modal state
    const [htmlEditModal, setHtmlEditModal] = useState(false);
    const [templateModal, setTemplateModal] = useState(false);
    const [addSpaceModal, setAddSpaceModal] = useState(false);
    const [registerModal, setRegisterModal] = useState(false);
    const [listNumberModal, setListNumberModal] = useState(false);
    const [title, setTitle] = useState('');

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
     * 공백추가
     */
    const handleOpenAddSpace = () => setAddSpaceModal(true);

    /**
     * 기사이동
     */
    const handleOpenRegister = () => {
        if (!componentAgGridInstances[agGridIndex]) return;
        const api = componentAgGridInstances[agGridIndex].api;

        if (api.getSelectedRows().length < 1) {
            toast.warn('기사를 선택해주세요');
        } else {
            setRegisterModal(true);
        }
    };

    /**
     * 리스트 건수
     */
    const handleOpenListNumber = () => setListNumberModal(true);

    /**
     * 전체삭제
     */
    const handleClickDelete = () => {
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

    /**
     * 템플릿 변경
     */
    const handleClickSaveTemplate = (templateData) => {
        if (!templateData.templateSeq) {
            toast.warn('선택된 템플릿이 없습니다');
            return;
        }

        dispatch(
            putComponentWork({
                componentWork: { ...component, templateSeq: templateData.templateSeq },
                callback: ({ header }) => {
                    if (!header.success) {
                        toast.error(header.message);
                    }
                },
            }),
        );
    };

    const iconButton = [
        { title: 'HTML 수동편집', iconName: 'fal-code', onClick: () => setHtmlEditModal(true) },
        { title: '템플릿', iconName: 'fal-expand-wide', onClick: () => setTemplateModal(true) },
        { title: '임시저장', iconName: 'fal-save', onClick: handleSaveComponentWork },
        { title: '전송', iconName: 'fal-share-square', onClick: handlePublishComponentWork },
    ];

    React.useEffect(() => {
        if (component.componentSeq) {
            setTitle(`ID: CP${component.componentSeq} ${component.componentName}`);
        }
    }, [component.componentName, component.componentSeq]);

    return (
        <>
            <div className="px-2 py-1">
                <Row className="m-0 d-flex align-items-center justify-content-between">
                    <Col className="p-0" xs={6}>
                        <OverlayTrigger overlay={<Tooltip>{`데이터셋ID: ${component.datasetSeq}`}</Tooltip>}>
                            <p className="ft-12 mb-0 component-title">{title}</p>
                        </OverlayTrigger>
                    </Col>
                    <Col className="p-0 d-flex align-items-center justify-content-end" xs={6}>
                        {iconButton.map((icon, idx) => (
                            <MokaOverlayTooltipButton key={idx} tooltipText={icon.title} variant="white" className="px-1 py-0 mr-1" onClick={icon.onClick}>
                                <MokaIcon iconName={icon.iconName} />
                            </MokaOverlayTooltipButton>
                        ))}
                        <MokaOverlayTooltipButton tooltipText="더보기" variant="white" className="p-0">
                            <Dropdown>
                                <Dropdown.Toggle as={customToggle} id="dropdown-desking-edit" />
                                <Dropdown.Menu className="ft-12">
                                    <Dropdown.Item eventKey="1" onClick={handleOpenAddSpace} date={component}>
                                        공백 추가
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="2" onClick={handleClickDelete}>
                                        전체 삭제
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="3" onClick={handleOpenRegister}>
                                        기사 이동
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="4" onClick={handleOpenListNumber}>
                                        리스트 건수
                                    </Dropdown.Item>
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
            <HtmlEditModal show={htmlEditModal} onHide={() => setHtmlEditModal(false)} data={component} />

            {/* 템플릿 */}
            <TemplateListModal
                show={templateModal}
                onHide={() => setTemplateModal(false)}
                selected={component.templateSeq}
                templateGroup={component.templateGroup}
                templateWidth={component.templateWidth}
                listType="thumbnail"
                onClickSave={handleClickSaveTemplate}
            />

            {/* 공백 추가 */}
            <AddSpaceModal
                show={addSpaceModal}
                onHide={() => setAddSpaceModal(false)}
                data={component}
                agGridIndex={agGridIndex}
                componentAgGridInstances={componentAgGridInstances}
            />

            {/* 기사 이동 */}
            <RegisterModal
                show={registerModal}
                onHide={() => setRegisterModal(false)}
                agGridIndex={agGridIndex}
                component={component}
                componentAgGridInstances={componentAgGridInstances}
            />

            {/* 리스트 건수 */}
            <ListNumberEditModal show={listNumberModal} onHide={() => setListNumberModal(false)} data={component} />
        </>
    );
};

export default DeskingWorkButtonGroup;
