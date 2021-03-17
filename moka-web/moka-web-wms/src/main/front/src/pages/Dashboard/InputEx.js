import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel, MokaPrependLinkInput } from '@components';

const InputEx = () => {
    const [temp, setTemp] = useState({});

    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;
        name === 'checkbox' ? setTemp({ ...temp, [name]: checked }) : name === 'switch' ? setTemp({ ...temp, [name]: checked }) : setTemp({ ...temp, [name]: value });
    };

    const handleChangeDate = (date) => (date === '' ? setTemp({ ...temp, date: null }) : setTemp({ ...temp, date }));

    return (
        <React.Fragment>
            {/* text */}
            <Form.Row>
                <Form.Label className="h4">1) Text</Form.Label>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInput placeholder="입력창입니다" name="text" value={temp.text} onChange={handleChangeValue} />
            </Form.Row>

            <MokaInputLabel label="라벨영역" name="inlineText" value={temp.inlineText} onChange={handleChangeValue} className="mb-2" />

            <hr className="divider" />

            {/* textarea */}
            <Form.Row>
                <Form.Label className="h4">2) TextArea</Form.Label>
            </Form.Row>

            <MokaInput as="textarea" placeholder="textarea" name="textarea" value={temp.textarea} onChange={handleChangeValue} className="mb-2" inputProps={{ rows: 3 }} />

            <hr className="divider" />

            {/* select */}
            <Form.Row>
                <Form.Label className="h4">3) Select</Form.Label>
            </Form.Row>

            <Form.Row>
                <Col xs={6} className="p-0 pr-2">
                    <MokaInput as="select" name="select" value={temp.select} onChange={handleChangeValue}>
                        <option value="">기본 셀렉트</option>
                        <option value="option1">옵션1</option>
                        <option value="option2">옵션2</option>
                    </MokaInput>
                </Col>

                <Col xs={6} className="p-0 pr-2">
                    <MokaInputLabel as="select" name="customSelect" value={temp.customSelect} onChange={handleChangeValue} inputProps={{ custom: true }}>
                        <option value="">커스텀 셀렉트</option>
                        <option value="option1">옵션1</option>
                        <option value="option2">옵션2</option>
                    </MokaInputLabel>
                </Col>
            </Form.Row>

            <hr className="divider" />

            {/* checkbox */}
            <Form.Row>
                <Form.Label className="h4">4) Checkbox</Form.Label>
            </Form.Row>

            <MokaInput className="mb-2" as="checkbox" name="checkbox" id="checkbox-1" inputProps={{ label: '기본', checked: temp.checkbox }} onChange={handleChangeValue} />
            <MokaInput as="checkbox" name="checkbox" id="checkbox-2" inputProps={{ label: '커스텀', custom: true, checked: temp.checkbox }} onChange={handleChangeValue} />

            <hr className="divider" />

            {/* RadioButton */}
            <Form.Row>
                <Form.Label className="h4">5) RadioButton</Form.Label>
            </Form.Row>

            <MokaInput
                className="mb-2"
                as="radio"
                name="radio"
                id="radio-1"
                value="radio-1"
                inputProps={{ label: '기본', checked: temp.radio === 'radio-1' }}
                onChange={handleChangeValue}
            />
            <MokaInput
                as="radio"
                name="radio"
                id="radio-2"
                value="radio-2"
                inputProps={{ label: '커스텀', custom: true, checked: temp.radio === 'radio-2' }}
                onChange={handleChangeValue}
            />

            <hr className="divider" />

            {/* Switch */}
            <Form.Row>
                <Form.Label className="h4">6) Switch</Form.Label>
            </Form.Row>

            <MokaInput className="mb-2" as="switch" name="switch" id="switch" inputProps={{ label: '스위치', checked: temp.switch }} onChange={handleChangeValue} />

            <hr className="divider" />

            {/* File */}
            <Form.Row>
                <Form.Label className="h4">7) File</Form.Label>
            </Form.Row>

            <MokaInput as="file" name="file" value={temp.file} onChange={handleChangeValue} />

            <hr className="divider" />

            {/* Datetime picker */}
            <Form.Row>
                <Form.Label className="h4">8) Datetime picker</Form.Label>
            </Form.Row>

            <MokaInputLabel label="좌측" as="dateTimePicker" value={temp.date} className="mb-2" onChange={handleChangeDate} />

            <MokaInputLabel label="우측" as="dateTimePicker" value={temp.date} className="mb-2" inputClassName="right" onChange={handleChangeDate} />

            <MokaInputLabel label="탑" as="dateTimePicker" value={temp.date} className="mb-2" inputClassName="top" onChange={handleChangeDate} />

            <MokaInputLabel label="중앙 Fixed" as="dateTimePicker" value={temp.date} className="mb-2" inputClassName="center-fixed" onChange={handleChangeDate} />

            <hr className="divider" />

            <p className="mb-2 text-positive font-weight-bold">날짜 선택 후 달력 닫기</p>
            <p className="mb-2 text-dark font-weight-bold">closeOnSelect, 기본 true이므로 true일 때 굳이 명시할 필요 없다. 필요 시에만 inputProps에 추가한다</p>

            <MokaInputLabel
                label="달력 닫지 않기"
                as="dateTimePicker"
                value={temp.date}
                className="mb-2"
                onChange={handleChangeDate}
                inputProps={{ closeOnSelect: false, timeFormat: null }}
            />

            <hr className="divider" />

            {/* 앞에 뭐 들어가는 input */}
            <Form.Row>
                <Form.Label className="h4">9) Input Group</Form.Label>
            </Form.Row>

            <MokaPrependLinkInput
                className="mb-3"
                to="/404"
                linkText="ID : 3"
                inputList={[
                    {
                        placeholder: '템플릿위치그룹',
                        disabled: true,
                        className: 'bg-white',
                    },
                    { placeholder: '템플릿명', disabled: true },
                ]}
            />
        </React.Fragment>
    );
};

export default InputEx;
