import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import { MokaIcon, MokaOverlayTooltipButton } from '@components';
import { DATA_TYPE_FORM } from '@/constants';
import toast, { messageBox } from '@utils/toastUtil';
import { putComponentWork, postSaveComponentWork, postPublishComponentWork, postSavePublishComponentWork, deleteDeskingWorkList } from '@store/desking';
import ComponentInfo from './ComponentInfo';
import DropdownToggle from './DropdownToggle';
import ReserveComponentWork from './ReserveComponentWork';
import StatusBadge from './StatusBadge';
// import TemplateListModal from '@pages/Template/modals/TemplateListModal';
// import TemplateHtmlModal from '@pages/Template/modals/TemplateHtmlModal';
import { EditDeskingWorkModal, RegisterModal, EditListNumberModal, EditHtmlModal } from '@pages/Desking/modals';

/**
 * 컴포넌트 워크의 버튼 그룹 컴포넌트
 */
const ButtonGroup = (props) => {
    const { areaSeq, component, agGridIndex, componentAgGridInstances, workStatus, deskingPart, setLoading, onSaveDummy, saveFailMsg } = props;
    const dispatch = useDispatch();
    // const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [viewN, setViewN] = useState(false);
    const [iconButton, setIconButton] = useState([]);
    // modal state
    const [modalShow, setModalShow] = useState({
        html: false,
        template: false,
        tems: false,
        dummy: false,
        register: false,
        listNumber: false,
    });

    /**
     * 모달 상태 변경
     */
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
        if (workStatus === 'work' || workStatus === 'publish') {
            messageBox.alert(saveFailMsg);
            return;
        }
        messageBox.confirm('전송하시겠습니까?', () => {
            setLoading(true);
            dispatch(
                postPublishComponentWork({
                    componentWorkSeq: component.seq,
                    areaSeq,
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                        } else {
                            messageBox.alert(header.message);
                        }
                        setLoading(false);
                    },
                }),
            );
        });
    }, [workStatus, saveFailMsg, setLoading, dispatch, component.seq, areaSeq]);

    /**
     * 임시저장
     */
    const handleClickSave = useCallback(() => {
        setLoading(true);
        dispatch(
            postSaveComponentWork({
                componentWorkSeq: component.seq,
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success(header.message);
                    } else {
                        messageBox.alert(header.message);
                    }
                    setLoading(false);
                },
            }),
        );
    }, [component.seq, dispatch, setLoading]);

    /**
     * 임시저장 + 전송 (비활성 상태를 저장할 때)
     */
    const handleClickSavePublish = useCallback(() => {
        messageBox.confirm('컴포넌트 비활성 상태를 저장하시겠습니까?\n(즉시 전송되어 서비스 화면에 반영됩니다.)', () => {
            setLoading(true);
            dispatch(
                postSavePublishComponentWork({
                    componentWorkSeq: component.seq,
                    areaSeq,
                    callback: ({ header }) => {
                        if (!header.success) messageBox.alert(header.message);
                        setLoading(false);
                    },
                }),
            );
        });
    }, [setLoading, dispatch, component.seq, areaSeq]);

    /**
     * 공백추가
     */
    const handleOpenAddSpace = useCallback(() => handleModalShow('dummy', true), [handleModalShow]);

    /**
     * 기사이동
     */
    const handleOpenRegister = useCallback(() => {
        if (componentAgGridInstances[agGridIndex]) {
            const api = componentAgGridInstances[agGridIndex].api;
            api.getSelectedRows().length < 1 ? messageBox.alert('기사를 선택해주세요') : handleModalShow('register', true);
        } else {
            messageBox.alert('이동 대상이 없습니다. 새로고침하세요.');
        }
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
            messageBox.alert('삭제할 기사가 없습니다');
            return;
        }
        setLoading(true);
        dispatch(
            deleteDeskingWorkList({
                componentWorkSeq: component.seq,
                datasetSeq: component.datasetSeq,
                list: component.deskingWorks,
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.message);
                    }
                    setLoading(false);
                },
            }),
        );
    }, [component.datasetSeq, component.deskingWorks, component.seq, dispatch, setLoading]);

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
     * 영역 활성, 비활성
     */
    const handleClickViewYn = useCallback(() => {
        dispatch(
            putComponentWork({
                componentWork: { ...component, viewYn: viewN ? 'Y' : 'N' },
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.message);
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
            { text: 'HTML 수동편집', viewN: false, onClick: () => handleModalShow('html', true) },
            { text: '공백 기사 추가', viewN: false, onClick: handleOpenAddSpace },
            { text: '전체 삭제', viewN: false, onClick: handleClickDelete },
            { text: '기사 이동', viewN: false, onClick: handleOpenRegister },
            { text: '리스트 건수 변경', viewN: false, onClick: handleOpenListNumber },
            { text: '영역 활성', viewN: true, onClick: handleClickViewYn },
            { text: '컴포넌트 비활성', viewN: false, onClick: handleClickViewYn },
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
    }, [handleClickDelete, handleClickViewYn, handleModalShow, handleOpenAddSpace, handleOpenListNumber, handleOpenRegister, viewN]);

    useEffect(() => {
        setViewN(component.viewYn === 'N');
    }, [component.viewYn]);

    useEffect(() => {
        let btns = [
            // { title: '템플릿', iconName: 'fal-expand-wide', onClick: () => setTemplateModalShow(true) },
            { title: '임시저장', iconName: 'fal-save', onClick: handleClickSave },
            { title: '전송', iconName: 'fal-share-square', onClick: handleClickPublish },
        ];
        if (viewN) btns = [{ title: '저장', iconName: 'fal-save', onClick: handleClickSavePublish }];
        if (component.dataType === DATA_TYPE_FORM) btns = [];

        setIconButton(btns);
    }, [handleClickSave, handleClickPublish, handleClickSavePublish, viewN, component.dataType]);

    return (
        <div className="px-2 pt-2 pb-1 button-group">
            <Row className="m-0 d-flex align-items-center justify-content-between position-relative">
                {/* 예약 + 타이틀 */}
                <Col className="d-flex align-items-center p-0 position-static" xs={8}>
                    <ReserveComponentWork component={component} workStatus={workStatus} />
                    <ComponentInfo component={component} className="pr-1" />
                </Col>

                <Col className="p-0 d-flex align-items-center justify-content-end" xs={4}>
                    {/* 최종 전송 상태 표기 */}
                    <StatusBadge component={component} className="mr-1" />

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
                        <Dropdown style={{ position: 'unset' }}>
                            <Dropdown.Toggle as={DropdownToggle} id="dropdown-desking-edit" />
                            <Dropdown.Menu>{createDropdownItem()}</Dropdown.Menu>
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
                            <span className="font-weight-bold mr-2">컴포넌트명</span>
                            <a className="font-weight-bold" onClick={() => window.open(`/component/${component?.componentSeq}`)}>
                                ID{component?.componentSeq}_{component?.componentName}
                            </a>
                        </div>
                        <div className="d-flex">
                            <span className="font-weight-bold mr-2">사용 템플릿명</span>
                            <a className="font-weight-bold" onClick={() => window.open(`/template/${component?.templateSeq}`)}>
                                ID{component?.templateSeq}_{component?.templateName}
                            </a>
                        </div>
                    </div>
                }
            /> */}

            {/* 템플릿 소스보기 (보여주지 않음) */}
            {/* <TemplateHtmlModal show={modalShow.tems} onHide={() => handleModalShow('tems', false)} templateSeq={selectedTemplate} editable={false} /> */}

            {/* 공백기사 추가 */}
            <EditDeskingWorkModal
                show={modalShow.dummy}
                onHide={() => handleModalShow('dummy', false)}
                component={component}
                deskingPart={deskingPart}
                onSave={onSaveDummy}
                isDummy
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
