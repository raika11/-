import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaInputLabel, MokaCard } from '@/components';
import { getTourSetup, putTourSetup } from '@/store/tour';
import toast from '@/utils/toastUtil';

/**
 * 견학 기본 설정 편집
 */
const TourSetEdit = () => {
    const dispatch = useDispatch();
    const tourSetup = useSelector((store) => store.tour.tourSetup);
    const [temp, setTemp] = useState({
        tourYn: 'Y',
        minDay: null,
        maxDay: null,
        minVisitor: null,
        maxVisitor: null,
        sunday: 'N',
        monday: 'Y',
        tuesday: 'Y',
        wednesday: 'Y',
        thursday: 'Y',
        friday: 'Y',
        saturday: 'N',
    });

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        let week = Object.keys(temp).filter((day) => {
            return day.indexOf('day') > -1;
        });

        let weekYn = [];
        week.forEach((day) => {
            return weekYn.push(temp[day]);
        });

        let tourSetup = {
            tourYn: temp.tourYn,
            tourDayFrom: temp.minDay,
            tourDayTo: temp.maxDay,
            tourNumFrom: temp.minVisitor,
            tourNumTo: temp.maxVisitor,
            tourWeekYn: weekYn.join(''),
        };

        dispatch(
            putTourSetup({
                tourSetup: tourSetup,
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success(header.message);
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    const handleClickCancel = () => {
        if (Object.keys(tourSetup).length > 0) {
            let weekArr = tourSetup.tourWeekYn.split('');

            setTemp({
                tourYn: tourSetup.tourYn,
                minDay: tourSetup.tourDayFrom,
                maxDay: tourSetup.tourDayTo,
                minVisitor: tourSetup.tourNumFrom,
                maxVisitor: tourSetup.tourNumTo,
                sunday: weekArr[0],
                monday: weekArr[1],
                tuesday: weekArr[2],
                wednesday: weekArr[3],
                thursday: weekArr[4],
                friday: weekArr[5],
                saturday: weekArr[6],
            });
        }
    };

    /**
     * input value
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { name, value } = e.target;
            setTemp({ ...temp, [name]: value });
        },
        [temp],
    );

    /**
     * switch value
     */
    const handleChangeSwitch = (e) => {
        const { name, checked } = e.target;
        setTemp({ ...temp, [name]: checked ? 'Y' : 'N' });
    };

    useEffect(() => {
        // 기본 설정 조회
        dispatch(getTourSetup());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (Object.keys(tourSetup).length > 0) {
            let weekArr = tourSetup.tourWeekYn.split('');

            setTemp({
                ...temp,
                tourYn: tourSetup.tourYn,
                minDay: tourSetup.tourDayFrom,
                maxDay: tourSetup.tourDayTo,
                minVisitor: tourSetup.tourNumFrom,
                maxVisitor: tourSetup.tourNumTo,
                sunday: weekArr[0],
                monday: weekArr[1],
                tuesday: weekArr[2],
                wednesday: weekArr[3],
                thursday: weekArr[4],
                friday: weekArr[5],
                saturday: weekArr[6],
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tourSetup]);

    return (
        <MokaCard
            className="flex-fill"
            title="견학 기본설정"
            footer
            footerButtons={[
                {
                    text: '저장',
                    variant: 'positive',
                    className: 'mr-1',
                    onClick: handleClickSave,
                },
                {
                    text: '취소',
                    variant: 'negative',
                    onClick: handleClickCancel,
                },
            ]}
            footerClassName="justify-content-center"
        >
            <Form>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="견학신청"
                        as="switch"
                        name="tourYn"
                        id="tour-tourYn-switch"
                        inputProps={{
                            custom: true,
                            checked: temp.tourYn === 'Y',
                        }}
                        onChange={handleChangeSwitch}
                    />
                </Form.Row>
                <Form.Row className="mb-2 d-flex align-items-center">
                    <MokaInputLabel label="신청기간" as="none" />
                    <p className="mb-0 mr-2 ft-12">오늘자 기준</p>
                    <div style={{ width: 80 }}>
                        <MokaInput as="select" name="minDay" value={temp.minDay} onChange={handleChangeValue}>
                            {[...Array(90)].map((d, idx) => {
                                return (
                                    <option key={idx} value={`${idx + 1}`}>
                                        {idx + 1}
                                    </option>
                                );
                            })}
                        </MokaInput>
                    </div>
                    <p className="mb-0 mx-2 ft-12">일 후부터</p>
                    <div style={{ width: 80 }}>
                        <MokaInput as="select" name="maxDay" value={temp.maxDay} onChange={handleChangeValue}>
                            {[...Array(90)].map((d, idx) => {
                                return (
                                    <option key={idx} value={`${idx + 1}`}>
                                        {idx + 1}
                                    </option>
                                );
                            })}
                        </MokaInput>
                    </div>
                    <p className="mb-0 mx-2 ft-12">일 후까지 신청 가능</p>
                </Form.Row>
                <Form.Row className="mb-2 d-flex align-items-center">
                    <MokaInputLabel label="신청인원" as="none" />
                    <div style={{ width: 80 }}>
                        <MokaInput as="select" name="minVisitor" value={temp.minVisitor} onChange={handleChangeValue}>
                            {[...Array(90)].map((d, idx) => {
                                return (
                                    <option key={idx} value={`${idx + 1}`}>
                                        {idx + 1}
                                    </option>
                                );
                            })}
                        </MokaInput>
                    </div>
                    <p className="mb-0 mx-2 ft-12">명 이상 ~ </p>
                    <div style={{ width: 80 }}>
                        <MokaInput as="select" name="maxVisitor" value={temp.maxVisitor} onChange={handleChangeValue}>
                            {[...Array(90)].map((d, idx) => {
                                return (
                                    <option key={idx} value={`${idx + 1}`}>
                                        {idx + 1}
                                    </option>
                                );
                            })}
                        </MokaInput>
                    </div>
                    <p className="mb-0 mx-2 ft-12">명 이하</p>
                </Form.Row>
                <Form.Row>
                    <MokaInputLabel label="견학가능\n요일" as="none" />
                    <MokaInputLabel
                        label="일"
                        labelClassName="ml-0"
                        labelWidth={16}
                        style={{ marginRight: 30 }}
                        as="switch"
                        name="sunday"
                        id="tour-sun-switch"
                        inputProps={{
                            custom: true,
                            checked: temp.sunday === 'Y',
                        }}
                        onChange={handleChangeSwitch}
                    />
                    <MokaInputLabel
                        label="월"
                        labelWidth={16}
                        style={{ marginRight: 30 }}
                        as="switch"
                        name="monday"
                        id="tour-mon-switch"
                        inputProps={{
                            custom: true,
                            checked: temp.monday === 'Y',
                        }}
                        onChange={handleChangeSwitch}
                    />
                    <MokaInputLabel
                        label="화"
                        labelWidth={16}
                        style={{ marginRight: 30 }}
                        as="switch"
                        name="tuesday"
                        id="tour-tue-switch"
                        inputProps={{
                            custom: true,
                            checked: temp.tuesday === 'Y',
                        }}
                        onChange={handleChangeSwitch}
                    />
                    <MokaInputLabel
                        label="수"
                        labelWidth={16}
                        style={{ marginRight: 30 }}
                        as="switch"
                        name="wednesday"
                        id="tour-wed-switch"
                        inputProps={{
                            custom: true,
                            checked: temp.wednesday === 'Y',
                        }}
                        onChange={handleChangeSwitch}
                    />
                    <MokaInputLabel
                        label="목"
                        labelWidth={16}
                        style={{ marginRight: 30 }}
                        as="switch"
                        name="thursday"
                        id="tour-thu-switch"
                        inputProps={{
                            custom: true,
                            checked: temp.thursday === 'Y',
                        }}
                        onChange={handleChangeSwitch}
                    />
                    <MokaInputLabel
                        label="금"
                        labelWidth={16}
                        style={{ marginRight: 30 }}
                        as="switch"
                        name="friday"
                        id="tour-fri-switch"
                        inputProps={{
                            custom: true,
                            checked: temp.friday === 'Y',
                        }}
                        onChange={handleChangeSwitch}
                    />
                    <MokaInputLabel
                        label="토"
                        labelWidth={16}
                        as="switch"
                        name="saturday"
                        id="tour-sat-switch"
                        inputProps={{
                            custom: true,
                            checked: temp.saturday === 'Y',
                        }}
                        onChange={handleChangeSwitch}
                    />
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default TourSetEdit;
