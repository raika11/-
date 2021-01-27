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
import { postSaveComponentWork, postPublishComponentWork, deleteDeskingWorkList } from '@store/desking';
import DropdownToggle from '@pages/Desking/components/ComponentWork/DropdownToggle';

/**
 * 네이버채널 컴포넌트 워크의 버튼 그룹 컴포넌트
 */
const ButtonGroup = (props) => {
    const { areaSeq, component, workTemplateSeq, setLoading } = props;
    // const { workStatus } = props;
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [viewN, setViewN] = useState(false);
    const [tooltipText, setTooltipText] = useState('');
    const [iconButton, setIconButton] = useState([]);

    /**
     * 전송
     */
    const handleClickPublish = useCallback(() => {
        messageBox.confirm('전송하시겠습니까?', () => {
            setLoading(true);
            dispatch(
                postPublishComponentWork({
                    componentWorkSeq: component.seq,
                    templateSeq: workTemplateSeq,
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
    }, [setLoading, dispatch, component.seq, workTemplateSeq, areaSeq]);

    /**
     * 임시저장
     */
    const handleClickSave = useCallback(() => {
        setLoading(true);
        dispatch(
            postSaveComponentWork({
                componentWorkSeq: component.seq,
                templateSeq: workTemplateSeq,
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
    }, [component.seq, dispatch, setLoading, workTemplateSeq]);

    /**
     * 전체삭제
     */
    const handleClickDelete = useCallback(() => {
        if (component.deskingWorks.length < 1) {
            toast.warning('삭제할 기사가 없습니다');
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
        const items = [{ text: '전체 삭제', viewN: false, onClick: handleClickDelete }];

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
    }, [handleClickDelete, viewN]);

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
            { title: '임시저장', iconName: 'fal-save', onClick: handleClickSave },
            { title: '전송', iconName: 'fal-share-square', onClick: handleClickPublish },
        ];
        setIconButton(btns);
    }, [handleClickSave, handleClickPublish, viewN, component.dataType]);

    return (
        <div className="px-2 py-1 button-group">
            <Row className="m-0 d-flex align-items-center justify-content-between position-relative">
                {/* 예약(안씀) + 타이틀 */}
                <Col className="d-flex align-items-center p-0 position-static" xs={8}>
                    <OverlayTrigger overlay={<Tooltip>{tooltipText}</Tooltip>}>
                        <p className="mb-0 component-title text-truncate">{title}</p>
                    </OverlayTrigger>
                </Col>

                <Col className="p-0 d-flex align-items-center justify-content-end" xs={4}>
                    {/* 기능 버튼 */}
                    {iconButton.map((icon, idx) => (
                        <MokaOverlayTooltipButton key={idx} tooltipText={icon.title} variant="white" className="px-1 py-0 mr-1" onClick={icon.onClick}>
                            <MokaIcon iconName={icon.iconName} />
                        </MokaOverlayTooltipButton>
                    ))}

                    {/* 드롭다운 메뉴 */}
                    <MokaOverlayTooltipButton tooltipText="더보기" variant="white" className="p-0">
                        <Dropdown style={{ position: 'unset' }}>
                            <Dropdown.Toggle as={DropdownToggle} id="dropdown-naverchannel-edit" />
                            <Dropdown.Menu>{createDropdownItem()}</Dropdown.Menu>
                        </Dropdown>
                    </MokaOverlayTooltipButton>
                </Col>
            </Row>
        </div>
    );
};

export default ButtonGroup;
