import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';
import { MokaIcon, MokaOverlayTooltipButton } from '@components';
import { HIST_SAVE, HIST_PUBLISH } from '@/constants';
import toast, { messageBox } from '@utils/toastUtil';
import { changeSearchOption, putComponentWork, postSaveComponentWork, postPublishComponentWork, postSavePublishComponentWork, deleteDeskingWorkList } from '@store/desking';

import ReserveComponentWork from './ReserveComponentWork';
import TemplateListModal from '@pages/Template/modals/TemplateListModal';
import TemplateHtmlModal from '@pages/Template/modals/TemplateHtmlModal';
import { AddSpaceModal, RegisterModal, EditListNumberModal, EditHtmlModal } from '@pages/Desking/modals';

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
 * 컴포넌트 워크 버튼 그룹 컴포넌트
 */
const ComponentWorkButtonGroup = (props) => {
    const { areaSeq, component, agGridIndex, componentAgGridInstances, workStatus } = props;
    const dispatch = useDispatch();
    const { search } = useSelector((store) => store.desking.history.search);

    // state
    const [title, setTitle] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [viewN, setViewN] = useState(false);
    const [iconButton, setIconButton] = useState([]);

    // modal state
    const [htmlModalShow, setHtmlModalShow] = useState(false);
    const [templateModalShow, setTemplateModalShow] = useState(false);
    const [temsModalShow, setTemsModalShow] = useState(false);
    const [spaceModalShow, setSpaceModalShow] = useState(false);
    const [registerModalShow, setRegisterModalShow] = useState(false);
    const [listNumberModalShow, setListNumberModalShow] = useState(false);

    /**
     * 전송
     */
    const handleClickPublish = useCallback(() => {
        messageBox.confirm('전송하시겠습니까?', () => {
            dispatch(changeSearchOption({ ...search, status: HIST_PUBLISH }));
            dispatch(
                postPublishComponentWork({
                    componentWorkSeq: component.seq,
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        });
    }, [component.seq, dispatch, search]);

    /**
     * 임시저장
     */
    const handleClickSave = useCallback(() => {
        const option = {
            componentWorkSeq: component.seq,
            callback: ({ header }) => {
                if (header.success) {
                    toast.success(header.message);
                } else {
                    toast.fail(header.message);
                }
            },
        };
        dispatch(changeSearchOption({ ...search, status: HIST_SAVE }));
        dispatch(postSaveComponentWork(option));
    }, [component.seq, dispatch, search]);

    /**
     * 임시저장 + 전송 (영역 미노출 상태를 저장할 때)
     */
    const handleClickSavePublish = useCallback(() => {
        messageBox.confirm('영역 비노출 상태를 저장하시겠습니까?\n(즉시 전송되어 서비스 화면에 반영됩니다.)', () => {
            dispatch(
                postSavePublishComponentWork({
                    componentWorkSeq: component.seq,
                    callback: ({ header }) => {
                        if (!header.success) toast.fail(header.message);
                    },
                }),
            );
        });
    }, [component.seq, dispatch]);

    /**
     * 공백추가
     */
    const handleOpenAddSpace = () => setSpaceModalShow(true);

    /**
     * 기사이동
     */
    const handleOpenRegister = () => {
        if (!componentAgGridInstances[agGridIndex]) return;
        const api = componentAgGridInstances[agGridIndex].api;
        api.getSelectedRows().length < 1 ? toast.warning('기사를 선택해주세요') : setRegisterModalShow(true);
    };

    /**
     * 리스트 건수
     */
    const handleOpenListNumber = () => setListNumberModalShow(true);

    /**
     * 전체삭제
     */
    const handleClickDelete = () => {
        if (component.deskingWorks.length < 1) {
            toast.warning('삭제할 기사가 없습니다');
            return;
        }
        dispatch(
            deleteDeskingWorkList({
                componentWorkSeq: component.seq,
                datasetSeq: component.datasetSeq,
                list: component.deskingWorks,
                callback: ({ header }) => {
                    if (!header.success) {
                        toast.error(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 템플릿 변경
     */
    const handleChangeTemplate = (templateData) => {
        if (!templateData.templateSeq) {
            toast.warning('선택된 템플릿이 없습니다');
            return;
        }
        dispatch(
            putComponentWork({
                componentWork: { ...component, templateSeq: templateData.templateSeq },
                callback: ({ header }) => {
                    if (!header.success) {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 템플릿 썸네일테이블 -> tems 소스보기
     */
    const handleOpenTemplateTems = (templateData) => {
        if (templateData) {
            setSelectedTemplate(templateData?.templateSeq);
            setTemsModalShow(true);
        }
    };

    /**
     * 영역 노출, 비노출
     */
    const handleClickViewYn = () => {
        dispatch(
            putComponentWork({
                componentWork: { ...component, viewYn: viewN ? 'Y' : 'N' },
                callback: ({ header }) => {
                    if (!header.success) {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    useEffect(() => {
        if (component.componentSeq) setTitle(component.componentName);
    }, [component.componentName, component.componentSeq]);

    useEffect(() => {
        setViewN(component.viewYn === 'N');
    }, [component.viewYn]);

    useEffect(() => {
        let btns = [
            { title: 'HTML 수동편집', iconName: 'fal-code', onClick: () => setHtmlModalShow(true) },
            // { title: '템플릿', iconName: 'fal-expand-wide', onClick: () => setTemplateModalShow(true) },
            { title: '임시저장', iconName: 'fal-save', onClick: handleClickSave },
            { title: '전송', iconName: 'fal-share-square', onClick: handleClickPublish },
        ];

        if (viewN) btns = [{ title: '저장', iconName: 'fal-save', onClick: handleClickSavePublish }];
        setIconButton(btns);
    }, [handleClickSave, handleClickPublish, handleClickSavePublish, viewN]);

    return (
        <div className="px-2 py-1">
            <Row className="m-0 d-flex align-items-center justify-content-between position-relative">
                {/* 예약 + 타이틀 */}
                <Col className="d-flex align-items-center p-0 position-static" xs={7}>
                    <ReserveComponentWork component={component} workStatus={workStatus} />
                    <OverlayTrigger overlay={<Tooltip>{`컴포넌트ID: ${component.componentSeq}, 데이터셋ID: ${component.datasetSeq}, 템플릿ID: ${component.templateSeq}`}</Tooltip>}>
                        <p className="ft-12 mb-0 component-title text-truncate">{title}</p>
                    </OverlayTrigger>
                </Col>

                {/* 기능 버튼 + 드롭다운 메뉴 */}
                <Col className="p-0 d-flex align-items-center justify-content-end" xs={5}>
                    {iconButton.map((icon, idx) => (
                        <MokaOverlayTooltipButton key={idx} tooltipText={icon.title} variant="white" className="px-1 py-0 mr-1" onClick={icon.onClick}>
                            <MokaIcon iconName={icon.iconName} />
                        </MokaOverlayTooltipButton>
                    ))}
                    <MokaOverlayTooltipButton tooltipText="더보기" variant="white" className="p-0">
                        <Dropdown>
                            <Dropdown.Toggle as={customToggle} id="dropdown-desking-edit" />
                            <Dropdown.Menu className="ft-12">
                                {!viewN && (
                                    <React.Fragment>
                                        <Dropdown.Item eventKey="1" onClick={handleOpenAddSpace}>
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
                                    </React.Fragment>
                                )}
                                <Dropdown.Item eventKey="5" onClick={handleClickViewYn}>
                                    {viewN ? '영역 노출' : '영역 비노출'}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </MokaOverlayTooltipButton>
                </Col>
            </Row>

            {/* HTML 수동 편집 */}
            <EditHtmlModal show={htmlModalShow} onHide={() => setHtmlModalShow(false)} data={component} />

            {/* 템플릿 */}
            <TemplateListModal
                show={templateModalShow}
                onHide={() => setTemplateModalShow(false)}
                selected={component.templateSeq}
                templateGroup={component.templateGroup}
                templateWidth={component.templateWidth}
                listType="thumbnail"
                onClickSave={handleChangeTemplate}
                menus={[
                    { title: 'TEMS 소스 보기', onClick: handleOpenTemplateTems },
                    { title: '새창열기', onClick: (data) => window.open(`/template/${data.templateSeq}`) },
                ]}
                topAs={
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex">
                            <span className="ft-12 font-weight-bold mr-2">컴포넌트명</span>
                            <a className="ft-12 font-weight-bold" onClick={() => window.open(`/component/${component?.componentSeq}`)}>
                                ID{component?.componentSeq}_{component?.componentName}
                            </a>
                        </div>
                        <div className="d-flex">
                            <span className="ft-12 font-weight-bold mr-2">사용 템플릿명</span>
                            <a className="ft-12 font-weight-bold" onClick={() => window.open(`/template/${component?.templateSeq}`)}>
                                ID{component?.templateSeq}_{component?.templateName}
                            </a>
                        </div>
                    </div>
                }
            />

            {/* 템플릿 소스보기 */}
            <TemplateHtmlModal show={temsModalShow} onHide={() => setTemsModalShow(false)} templateSeq={selectedTemplate} editable={false} />

            {/* 공백 추가 */}
            <AddSpaceModal
                show={spaceModalShow}
                onHide={() => setSpaceModalShow(false)}
                areaSeq={areaSeq}
                component={component}
                agGridIndex={agGridIndex}
                componentAgGridInstances={componentAgGridInstances}
            />

            {/* 기사 이동 */}
            <RegisterModal
                show={registerModalShow}
                onHide={() => setRegisterModalShow(false)}
                agGridIndex={agGridIndex}
                component={component}
                componentAgGridInstances={componentAgGridInstances}
            />

            {/* 리스트 건수 */}
            <EditListNumberModal show={listNumberModalShow} onHide={() => setListNumberModalShow(false)} data={component} />
        </div>
    );
};

export default ComponentWorkButtonGroup;
