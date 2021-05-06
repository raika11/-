import React from 'react';
import Form from 'react-bootstrap/Form';
import { MokaIcon } from '@components';
import { Button, Col } from 'react-bootstrap';

const ABStatusRow = ({ status, modDt, onCopy, onCloseAbtest }) => {
    const statusRenderer = () => {
        let renderer = <></>;

        switch (status) {
            case 'Y':
                renderer = (
                    <>
                        <MokaIcon iconName="fas-circle" fixedWidth className="color-brand-a6 mr-1" />
                        <span className="mr-32">진행</span>
                    </>
                );
                break;
            case 'P':
                renderer = (
                    <>
                        <MokaIcon iconName="fas-circle" fixedWidth className="color-neutral mr-1" />
                        <span className="mr-32">대기</span>
                    </>
                );
                break;
            case 'T':
                renderer = (
                    <>
                        <MokaIcon iconName="fas-circle" fixedWidth className="color-gray-400 mr-1" />
                        <span className="mr-32">임시</span>
                    </>
                );
                break;
            case 'Q':
                renderer = (
                    <>
                        <MokaIcon iconName="fas-circle" fixedWidth className="color-searching mr-1" />
                        <span className="mr-32">종료</span>
                    </>
                );
                break;
            default:
                break;
        }

        return renderer;
    };
    return (
        <Form.Row className="d-flex mb-2 align-items-center justify-content-between">
            <Col xs={6}>
                {statusRenderer(status)}
                <span>수정일시 : {modDt}</span>
            </Col>
            <Col xs={6} className="text-right">
                <Button variant="outline-primary mr-2" onClick={onCopy}>
                    복사
                </Button>
                <Button variant="outline-dark" onClick={onCloseAbtest}>
                    종료
                </Button>
            </Col>
        </Form.Row>
    );
};

export default ABStatusRow;
