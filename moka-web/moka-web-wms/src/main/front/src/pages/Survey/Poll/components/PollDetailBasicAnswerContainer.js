import React, { useEffect, useState } from 'react';
import commonUtil from '@utils/commonUtil';
import PollDetailBasicTextAnswerComponent from '@pages/Survey/Poll/components/PollDetailBasicTextAnswerComponent';
import PollDetailBasicPhotoAnswerComponent from '@pages/Survey/Poll/components/PollDetailBasicPhotoAnswerComponent';
import PollDetailBasicCombineAnswerComponent from '@pages/Survey/Poll/components/PollDetailBasicCombineAnswerComponent';
import produce from 'immer';

const PollDetailBasicAnswerContainer = ({ items, type, onChange }) => {
    const [editItems, setEditItems] = useState([]);

    let AnswerComponent = null;
    switch (type) {
        case 'T':
            AnswerComponent = PollDetailBasicTextAnswerComponent;
            break;
        case 'P':
            AnswerComponent = PollDetailBasicPhotoAnswerComponent;
            break;
        case 'M':
            AnswerComponent = PollDetailBasicCombineAnswerComponent;
            break;
        default:
            break;
    }

    const handleChangeValue = (index, item) => {
        if (onChange instanceof Function) {
            onChange(
                produce(editItems, (draft) => {
                    draft[index] = item;
                }),
            );
        }
    };

    useEffect(() => {
        /*if (count > 0) {
            if (items.length === 0) {
                const initItems = [];
                for (let itemCnt = 0; itemCnt < count; itemCnt++) {
                    initItems.push({ imgUrl: '', linkUrl: '', title: '' });
                }
                setEditItems(initItems);
            } else {
                setEditItems(items);
            }
        }*/

        setEditItems(items);
    }, [items]);

    return (
        <>
            {!commonUtil.isEmpty(AnswerComponent) &&
                editItems.map((editItem, index) => (
                    <AnswerComponent
                        key={index}
                        item={editItem}
                        index={index}
                        hasUrl={false}
                        onChange={(item) => {
                            handleChangeValue(index, item);
                        }}
                    />
                ))}

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

export default PollDetailBasicAnswerContainer;
