import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@components';

/**
 * 배경이미지(PC, M)
 */
const BackgroundImageForm = ({ className, agenda, onChange }) => {
    const pcImgRef = useRef(null);
    const mImgRef = useRef(null);

    /**
     * 이미지 파일 변경 (PC)
     */
    const setPcFileValue = (data) => {
        onChange({ key: 'agndImgFile', value: data });
        if (!data) {
            onChange({ key: 'agndImg', value: '' });
        }
    };

    /**
     * 이미지 파일 변경 (M)
     */
    const setMFileValue = (data) => {
        onChange({ key: 'agndImgMobFile', value: data });
        if (!data) {
            onChange({ key: 'agndImgMob', value: '' });
        }
    };

    return (
        <Form.Row className={className}>
            <MokaInputLabel
                as="imageFile"
                ref={pcImgRef}
                labelWidth={90}
                label={
                    <React.Fragment>
                        배경이미지
                        <br />
                        <span className="color-danger">PC (800*600px)</span>
                        <Button
                            variant="gray-700"
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                                pcImgRef.current.rootRef.onClick(e);
                            }}
                        >
                            신규등록
                        </Button>
                    </React.Fragment>
                }
                inputProps={{ img: agenda.agndImg, width: 290, height: 163, setFileValue: setPcFileValue, deleteButton: true }}
            />
            <MokaInputLabel
                as="imageFile"
                ref={mImgRef}
                labelWidth={90}
                label={
                    <React.Fragment>
                        배경이미지
                        <br />
                        <span className="color-danger">M (600*500px)</span>
                        <Button
                            variant="gray-700"
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                                mImgRef.current.rootRef.onClick(e);
                            }}
                        >
                            신규등록
                        </Button>
                    </React.Fragment>
                }
                inputProps={{ img: agenda.agndImgMob, width: 290, height: 163, setFileValue: setMFileValue, deleteButton: true }}
            />
        </Form.Row>
    );
};

export default BackgroundImageForm;