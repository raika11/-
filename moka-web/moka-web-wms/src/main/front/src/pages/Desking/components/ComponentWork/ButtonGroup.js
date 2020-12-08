import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';
import { MokaIcon, MokaOverlayTooltipButton } from '@components';
import { DATA_TYPE_DESK, DATA_TYPE_FORM } from '@/constants';
import toast, { messageBox } from '@utils/toastUtil';
import { putComponentWork, postSaveComponentWork, postPublishComponentWork, postSavePublishComponentWork, deleteDeskingWorkList } from '@store/desking';
import DropdownToggle from './DropdownToggle';
import ReserveComponentWork from './ReserveComponentWork';
// import TemplateListModal from '@pages/Template/modals/TemplateListModal';
// import TemplateHtmlModal from '@pages/Template/modals/TemplateHtmlModal';
import { AddSpaceModal, RegisterModal, EditListNumberModal, EditHtmlModal } from '@pages/Desking/modals';

/**
 * 컴포넌트 워크의 버튼 그룹 컴포넌트
 */
const ButtonGroup = (props) => {
    const { areaSeq, component, agGridIndex, componentAgGridInstances, workStatus } = props;
    const dispatch = useDispatch();

    // state
    const [title, setTitle] = useState('');
    // const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [viewN, setViewN] = useState(false);
    const [tooltipText, setTooltipText] = useState('');
    const [iconButton, setIconButton] = useState([]);

    // modal state
    const [modalShow, setModalShow] = useState({
        html: false,
        template: false,
        tems: false,
        space: false,
        register: false,
        listNumber: false,
    });

    const handleModalShow = useCallback(
        (key, showOrClose) => {
            setModalShow({ ...modalShow, [key]: showOrClose });
        },
        [modalShow],
    );

    /**
     * 전송
     */
    const handleClickPublish = useCallback(() => {
        messageBox.confirm('전송하시겠습니까?', () => {
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
    }, [component.seq, dispatch]);

    /**
     * 임시저장
     */
    const handleClickSave = useCallback(() => {
        dispatch(
            postSaveComponentWork({
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
    }, [component.seq, dispatch]);

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
    const handleOpenAddSpace = useCallback(() => handleModalShow('space', true), [handleModalShow]);

    /**
     * 기사이동
     */
    const handleOpenRegister = useCallback(() => {
        if (!componentAgGridInstances[agGridIndex]) return;
        const api = componentAgGridInstances[agGridIndex].api;
        api.getSelectedRows().length < 1 ? toast.warning('기사를 선택해주세요') : handleModalShow('register', true);
    }, [agGridIndex, componentAgGridInstances, handleModalShow]);

    /**
     * 리스트 건수
     */
    const handleOpenListNumber = useCallback(() => handleModalShow('listNumber', true), [handleModalShow]);

    /**
     * 전체삭제
     */
    const handleClickDelete = useCallback(() => {
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
    }, [component.datasetSeq, component.deskingWorks, component.seq, dispatch]);

    /**
     * 템플릿 변경
     */
    // const handleChangeTemplate = (templateData) => {
    //     if (!templateData.templateSeq) {
    //         toast.warning('선택된 템플릿이 없습니다');
    //         return;
    //     }
    //     dispatch(
    //         putComponentWork({
    //             componentWork: { ...component, templateSeq: templateData.templateSeq },
    //             callback: ({ header }) => {
    //                 if (!header.success) {
    //                     toast.fail(header.message);
    //                 }
    //             },
    //         }),
    //     );
    // };

    /**
     * 템플릿 썸네일테이블 -> tems 소스보기
     */
    // const handleOpenTemplateTems = (templateData) => {
    //     if (templateData) {
    //         setSelectedTemplate(templateData?.templateSeq);
    //         handleModalShow('tems', true);
    //     }
    // };

    /**
     * 영역 노출, 비노출
     */
    const handleClickViewYn = useCallback(() => {
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
    }, [component, dispatch, viewN]);

    /**
     * 드롭다운 아이템 생성
     */
    const createDropdownItem = useCallback(() => {
        const items = [
            { text: '공백 기사 추가', viewN: false, onClick: handleOpenAddSpace },
            { text: '전체 삭제', viewN: false, onClick: handleClickDelete },
            { text: '기사 이동', viewN: false, onClick: handleOpenRegister },
            { text: '리스트 건수 변경', viewN: false, onClick: handleOpenListNumber },
            { text: '영역 노출', viewN: true, onClick: handleClickViewYn },
            { text: '영역 비노출', viewN: false, onClick: handleClickViewYn },
        ];

        return (
            <React.Fragment>
                {items
                    .filter((i) => i.viewN === viewN)
                    .map((i, idx) => (
                        <Dropdown.Item key={idx} eventKey={idx} onClick={i.onClick}>
                            {i.text}
                        </Dropdown.Item>
                    ))}
            </React.Fragment>
        );
    }, [handleClickDelete, handleClickViewYn, handleOpenAddSpace, handleOpenListNumber, handleOpenRegister, viewN]);

    useEffect(() => {
        if (component.componentSeq) setTitle(component.componentName);
    }, [component.componentName, component.componentSeq]);

    useEffect(() => {
        setViewN(component.viewYn === 'N');
    }, [component.viewYn]);

    useEffect(() => {
        if (component.dataType === DATA_TYPE_DESK) {
            setTooltipText(`컴포넌트ID: ${component.componentSeq}, 데이터셋ID: ${component.datasetSeq}, 템플릿ID: ${component.templateSeq}`);
        } else if (component.dataType === DATA_TYPE_FORM) {
            setTooltipText(`컴포넌트ID: ${component.componentSeq}, 파트ID: ${component.partSeq}, 템플릿ID: ${component.templateSeq}`);
        }
    }, [component.componentSeq, component.dataType, component.datasetSeq, component.partSeq, component.templateSeq]);

    useEffect(() => {
        let btns = [
            { title: 'HTML 수동편집', iconName: 'fal-code', onClick: () => handleModalShow('html', true) },
            // { title: '템플릿', iconName: 'fal-expand-wide', onClick: () => setTemplateModalShow(true) },
            { title: '임시저장', iconName: 'fal-save', onClick: handleClickSave },
            { title: '전송', iconName: 'fal-share-square', onClick: handleClickPublish },
        ];
        if (viewN) btns = [{ title: '저장', iconName: 'fal-save', onClick: handleClickSavePublish }];
        if (component.dataType === DATA_TYPE_FORM) btns = [];

        setIconButton(btns);
    }, [handleClickSave, handleClickPublish, handleClickSavePublish, viewN, component.dataType, handleModalShow]);

    return (
        <div className="px-2 py-1">
            <Row className="m-0 d-flex align-items-center justify-content-between position-relative">
                {/* 예약 + 타이틀 */}
                <Col className="d-flex align-items-center p-0 position-static" xs={8}>
                    <ReserveComponentWork component={component} workStatus={workStatus} />
                    <OverlayTrigger overlay={<Tooltip>{tooltipText}</Tooltip>}>
                        <p className="ft-12 mb-0 component-title text-truncate">{title}</p>
                    </OverlayTrigger>
                </Col>

                <Col className="p-0 d-flex align-items-center justify-content-end" xs={4}>
                    {/* 기능 버튼 */}
                    {iconButton.map((icon, idx) => (
                        <MokaOverlayTooltipButton key={idx} tooltipText={icon.title} variant="white" className="px-1 py-0 mr-1" onClick={icon.onClick}>
                            <MokaIcon iconName={icon.iconName} />
                        </MokaOverlayTooltipButton>
                    ))}

                    {/* 폼일 경우 폼 편집 버튼 노출 2020.12.08 폼관련 주석처리, 추후 진행 */}
                    {/* {component.dataType === DATA_TYPE_FORM && (
                        <Button variant="outline-info" size="sm" className="mr-2" onClick={handleForm}>
                            폼 편집
                        </Button>
                    )} */}

                    {/* 드롭다운 메뉴 */}
                    <MokaOverlayTooltipButton tooltipText="더보기" variant="white" className="p-0">
                        <Dropdown>
                            <Dropdown.Toggle as={DropdownToggle} id="dropdown-desking-edit" />
                            <Dropdown.Menu className="ft-12">{createDropdownItem()}</Dropdown.Menu>
                        </Dropdown>
                    </MokaOverlayTooltipButton>
                </Col>
            </Row>

            {/* HTML 수동 편집 */}
            <EditHtmlModal show={modalShow.html} onHide={() => handleModalShow('html', false)} component={component} />

            {/* 템플릿(보여주지 않음) */}
            {/* <TemplateListModal
                show={modalShow.template}
                onHide={() => handleModalShow('template', false)}
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
            /> */}

            {/* 템플릿 소스보기 (보여주지 않음) */}
            {/* <TemplateHtmlModal show={modalShow.tems} onHide={() => handleModalShow('tems', false)} templateSeq={selectedTemplate} editable={false} /> */}

            {/* 공백 추가 */}
            <AddSpaceModal
                show={modalShow.space}
                onHide={() => handleModalShow('space', false)}
                areaSeq={areaSeq}
                component={component}
                agGridIndex={agGridIndex}
                componentAgGridInstances={componentAgGridInstances}
            />

            {/* 기사 이동 */}
            <RegisterModal
                show={modalShow.register}
                onHide={() => handleModalShow('register', false)}
                agGridIndex={agGridIndex}
                component={component}
                componentAgGridInstances={componentAgGridInstances}
            />

            {/* 리스트 건수 */}
            <EditListNumberModal show={modalShow.listNumber} onHide={() => handleModalShow('listNumber', false)} data={component} />
        </div>
    );
};

export default ButtonGroup;