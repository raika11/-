import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
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
    const { areaSeq, component, agGridIndex, componentAgGridInstances, workStatus, setLoading } = props;
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
        if (workStatus === 'work' || workStatus === 'publish') {
            messageBox.alert('임시저장되지 않았습니다.');
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
    }, [workStatus, component.seq, setLoading, dispatch, areaSeq]);

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
        if (!componentAgGridInstances[agGridIndex]) return;
        const api = componentAgGridInstances[agGridIndex].api;
        api.getSelectedRows().length < 1 ? messageBox.alert('기사를 선택해주세요') : handleModalShow('register', true);
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
            { title: '임시저장', iconName: 'fal-save', onClick: handleClickSave },
            { title: '전송', iconName: 'fal-share-square', onClick: handleClickPublish },
        ];
        setIconButton(btns);
    }, [handleClickSave, handleClickPublish, component.dataType]);

    return (
        <div className="px-2 pt-2 pb-1 button-group">
            <Row className="m-0 d-flex align-items-center justify-content-between position-relative">
                {/* 예약(안씀) + 타이틀 */}
                <Col className="d-flex align-items-center p-0 position-static" xs={8}>
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

                    {/* 드롭다운 메뉴 */}
                    <MokaOverlayTooltipButton tooltipText="더보기" variant="white" className="p-0">
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
