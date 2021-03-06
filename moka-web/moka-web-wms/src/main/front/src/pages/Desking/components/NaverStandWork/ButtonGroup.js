import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import { DESK_STATUS_WORK, DESK_STATUS_PUBLISH } from '@/constants';
import { MokaIcon, MokaOverlayTooltipButton } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { postSaveComponentWork, postPublishComponentWork, deleteDeskingWorkList } from '@store/desking';
import ComponentInfo from '../ComponentWork/ComponentInfo';
import DropdownToggle from '../ComponentWork/DropdownToggle';
import StatusBadge from '../ComponentWork/StatusBadge';
import { RegisterModal } from '@pages/Desking/modals';

/**
 * 네이버스탠드 컴포넌트 워크의 버튼 그룹 컴포넌트
 */
const ButtonGroup = (props) => {
    const { areaSeq, component, agGridIndex, componentAgGridInstances, workStatus, setLoading, saveFailMsg } = props;
    const dispatch = useDispatch();
    const [iconButton, setIconButton] = useState([]);
    const [modalShow, setModalShow] = useState({
        register: false,
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
        if (workStatus === DESK_STATUS_WORK || workStatus === DESK_STATUS_PUBLISH) {
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
     * 드롭다운 아이템 생성
     */
    const createDropdownItem = useCallback(() => {
        const items = [
            { text: '전체 삭제', viewN: false, onClick: handleClickDelete },
            { text: '기사 이동', viewN: false, onClick: handleOpenRegister },
        ];

        return (
            <React.Fragment>
                {items.map((i, idx) => (
                    <Dropdown.Item key={idx} eventKey={idx} onClick={i.onClick}>
                        {i.text}
                    </Dropdown.Item>
                ))}
            </React.Fragment>
        );
    }, [handleClickDelete, handleOpenRegister]);

    useEffect(() => {
        let btns = [
            { title: '임시저장', iconName: 'Save', feather: true, onClick: handleClickSave },
            { title: '전송', iconName: 'Send', feather: true, onClick: handleClickPublish },
        ];
        setIconButton(btns);
    }, [handleClickSave, handleClickPublish, component.dataType]);

    return (
        <div className="pl-3 pr-2 py-12 button-group">
            <Row className="m-0 d-flex align-items-center justify-content-between position-relative">
                {/* 예약(안씀) + 타이틀 */}
                <Col className="d-flex align-items-center p-0 position-static" xs={8}>
                    <ComponentInfo component={component} className="pr-1" />
                </Col>

                <Col className="p-0 d-flex justify-content-end" xs={4}>
                    {/* 최종 전송 상태 표기 */}
                    <StatusBadge
                        lastPublishDt={component.lastPublishDt}
                        lastPublishNm={component.lastPublishNm}
                        lastPublishId={component.lastPublishId}
                        lastSaveNm={component.lastSaveNm}
                        lastSaveId={component.lastSaveId}
                        lastSaveDt={component.lastSaveDt}
                        className="d-flex align-items-center mr-2"
                    />

                    {/* 기능 버튼 */}
                    {iconButton.map((icon, idx) => {
                        const { title, onClick, iconName, ...rest } = icon;

                        return (
                            <MokaOverlayTooltipButton key={idx} tooltipText={title} variant="white" className="work-btn mr-2" onClick={onClick}>
                                <MokaIcon iconName={iconName} {...rest} />
                            </MokaOverlayTooltipButton>
                        );
                    })}

                    {/* 드롭다운 메뉴 */}
                    <MokaOverlayTooltipButton tooltipText="더보기" variant="white" className="work-btn">
                        <Dropdown style={{ position: 'unset' }}>
                            <Dropdown.Toggle as={DropdownToggle} id="dropdown-desking-edit" />
                            <Dropdown.Menu>{createDropdownItem()}</Dropdown.Menu>
                        </Dropdown>
                    </MokaOverlayTooltipButton>
                </Col>
            </Row>

            {/* 기사 이동 */}
            <RegisterModal
                show={modalShow.register}
                onHide={() => handleModalShow('register', false)}
                agGridIndex={agGridIndex}
                component={component}
                componentAgGridInstances={componentAgGridInstances}
            />
        </div>
    );
};

export default ButtonGroup;
