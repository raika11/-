import React, { useEffect, useState } from 'react';
import PollDetailBasicTextAnswerComponent from '@pages/Survey/Poll/components/PollDetailBasicTextAnswerComponent';
import commonUtil from '@utils/commonUtil';
import PollDetailBasicPhotoAnswerComponent from '@pages/Survey/Poll/components/PollDetailBasicPhotoAnswerComponent';

const PollDetailQuestionComponent = ({ division, items, count, type, onChange }) => {
    const [editItems, setEditItems] = useState([]);

    let AnswerComponent = null;
    if (division === 'W') {
        if (type === 'T') {
            AnswerComponent = PollDetailBasicTextAnswerComponent;
        } else if (type === 'P') {
            AnswerComponent = PollDetailBasicPhotoAnswerComponent;
        }
    }

    useEffect(() => {
        if (count > 0) {
            if (items.length === 0) {
                const initItems = [];
                for (let itemCnt = 0; itemCnt < count; itemCnt++) {
                    initItems.push({ imgName: '', imgPath: '', linkUrl: '', title: '' });
                }
                setEditItems(initItems);
            } else {
                setEditItems(items);
            }
        }
    }, [count, items]);

    return (
        <>
            {!commonUtil.isEmpty(AnswerComponent) && <AnswerComponent items={editItems} hasUrl={false} />}

            {/*{type !== 'P' && (
                <Col className="flex-fill">
                    <Form.Row className="mb-2">
                        <Col xs={12}>
                            <MokaInputLabel
                                label={label1}
                                labelWidth={35}
                                onChange={(e) => {
                                    setValue1(e.target.value);
                                }}
                                value={value1}
                                placeholder="보기를 입력해주세요."
                            />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col xs={12}>
                            <MokaInputLabel
                                label={label2}
                                labelWidth={35}
                                onChange={(e) => {
                                    setValue2(e.target.value);
                                }}
                                value={value2}
                                placeholder="url을 입력해주세요"
                            />
                        </Col>
                    </Form.Row>
                </Col>
            )}

            {type !== 'T' && (
                <Col xs={3}>
                    <Form.Row>
                        <Col xs={12} className="mb-2 text-center">
                            <Figure.Image className="mb-0" src={IR_URL + BLANK_IMAGE_PATH} style={{ height: '70px', width: '100%' }} />
                        </Col>
                    </Form.Row>
                    <Form.Row className="d-flex justify-content-center">
                        <Col xs={7} className="pl-0 pr-0">
                            <Button variant="outline-table-btn" size="sm">
                                신규등록
                            </Button>
                        </Col>
                        <Col xs={5}>
                            <Button variant="outline-table-btn" size="sm">
                                편집
                            </Button>
                        </Col>
                    </Form.Row>
                </Col>
            )}*/}
        </>
    );
};

export default PollDetailQuestionComponent;
