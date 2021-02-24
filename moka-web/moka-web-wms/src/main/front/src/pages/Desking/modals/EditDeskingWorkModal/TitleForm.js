import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from 'react-redux';
import { CODETYPE_DS_FONT_IMGD, CODETYPE_DS_FONT_IMGW, CODETYPE_DS_FONT_VODD } from '@/constants';
import util from '@utils/commonUtil';
import { getDsFontImgD, getDsFontImgW, getDsFontVodD } from '@store/codeMgt';
import { MokaInput, MokaInputLabel } from '@components';
import { fontSizeObj } from '@pages/Desking/deskingPartMapping';

/**
 * 타이틀 + 폰트사이즈 폼
 */
const TitleForm = ({ show, mappingData, temp, onChange, deskingPart, error }) => {
    const { as, field, label, errorCheck, ...mappingProps } = mappingData;
    const dispatch = useDispatch();
    const { dsFontImgDRows, dsFontImgWRows, dsFontVodDRows } = useSelector(({ codeMgt }) => codeMgt);
    const [fontList, setFontList] = useState([]);

    useEffect(() => {
        if (!show) return;

        // deskingPart (string) => 폰트사이즈 분리
        if (!deskingPart || deskingPart === '') return;
        const fontParts = deskingPart.split(',').filter((partKey) => fontSizeObj[partKey]);

        if (fontParts.length > 0) {
            const fontListType = fontParts[0];
            if (fontListType === CODETYPE_DS_FONT_IMGD) {
                !dsFontImgDRows ? dispatch(getDsFontImgD()) : setFontList(dsFontImgDRows);
            } else if (fontListType === CODETYPE_DS_FONT_IMGW) {
                !dsFontImgWRows ? dispatch(getDsFontImgW()) : setFontList(dsFontImgWRows);
            } else if (fontListType === CODETYPE_DS_FONT_VODD) {
                !dsFontVodDRows ? dispatch(getDsFontVodD()) : setFontList(dsFontVodDRows);
            } else {
                setFontList([]);
            }
        } else {
            setFontList([]);
        }
    }, [show, deskingPart, dispatch, dsFontImgDRows, dsFontImgWRows, dsFontVodDRows]);

    return (
        <Form.Row className="mb-2">
            <Col xs={11} className="p-0">
                <MokaInputLabel
                    as={as}
                    label={
                        <React.Fragment>
                            {label}
                            {fontList.length > 0 && (
                                <div className="mt-1">
                                    <MokaInput as="select" size="sm" name="titleSize" value={temp.titleSize} onChange={onChange}>
                                        <option value="">선택</option>
                                        {fontList.map((font, idx) => (
                                            <option key={idx} value={font.cdNm}>
                                                {font.name}
                                            </option>
                                        ))}
                                    </MokaInput>
                                </div>
                            )}
                        </React.Fragment>
                    }
                    name={field}
                    className="w-100"
                    value={temp[field]}
                    onChange={onChange}
                    isInvalid={errorCheck && error?.[field]}
                    {...mappingProps}
                />
            </Col>
            <Col xs={1} className="p-0 pl-1 ft-12 d-flex align-items-end flex-nowrap text-break">
                {util.euckrBytes(temp[field])}byte
            </Col>
        </Form.Row>
    );
};

export default TitleForm;
