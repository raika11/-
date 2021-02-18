import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from 'react-redux';
import { CODETYPE_DS_FONT_IMGD, CODETYPE_DS_FONT_IMGW, CODETYPE_DS_FONT_VODD } from '@/constants';
import { getDsFontImgD, getDsFontImgW, getDsFontVodD } from '@store/codeMgt';
import { MokaInput, MokaInputLabel } from '@components';
import util from '@utils/commonUtil';

/**
 * 타이틀 + 폰트사이즈 폼
 */
const TitleForm = ({ show, mappingData, temp, onChange, fontListType, error }) => {
    const { as, field, label, errorCheck, ...mappingProps } = mappingData;
    const dispatch = useDispatch();
    const [fontList, setFontList] = useState([]);

    const { dsFontImgDRows, dsFontImgWRows, dsFontVodDRows } = useSelector((store) => ({
        dsFontImgDRows: store.codeMgt.dsFontImgDRows,
        dsFontImgWRows: store.codeMgt.dsFontImgWRows,
        dsFontVodDRows: store.codeMgt.dsFontVodDRows,
    }));

    useEffect(() => {
        if (!show) return;
        if (fontListType !== CODETYPE_DS_FONT_IMGD) return;
        !dsFontImgDRows ? dispatch(getDsFontImgD()) : setFontList(dsFontImgDRows);
    }, [dispatch, fontListType, show, dsFontImgDRows]);

    useEffect(() => {
        if (!show) return;
        if (fontListType !== CODETYPE_DS_FONT_IMGW) return;
        !dsFontImgWRows ? dispatch(getDsFontImgW()) : setFontList(dsFontImgWRows);
    }, [dispatch, fontListType, show, dsFontImgWRows]);

    useEffect(() => {
        if (!show) return;
        if (fontListType !== CODETYPE_DS_FONT_VODD) return;
        !dsFontVodDRows ? dispatch(getDsFontVodD()) : setFontList(dsFontVodDRows);
    }, [dispatch, fontListType, show, dsFontVodDRows]);

    return (
        <Form.Row className="mb-2">
            <Col xs={11} className="p-0">
                <MokaInputLabel
                    as={as}
                    label={
                        <React.Fragment>
                            {label}
                            {fontListType && (
                                <MokaInput className="mt-1" as="select" size="sm" name="titleSize" value={temp.titleSize} onChange={onChange}>
                                    <option value="">선택</option>
                                    {fontList.map((font, idx) => (
                                        <option key={idx} value={font.id}>
                                            {font.name}
                                        </option>
                                    ))}
                                </MokaInput>
                            )}
                        </React.Fragment>
                    }
                    name={field}
                    className="mb-0 w-100"
                    value={temp[field]}
                    onChange={onChange}
                    isInvalid={errorCheck && error[field]}
                    {...mappingProps}
                />
            </Col>
            <Col xs={1} className="p-0 pl-1 ft-12 d-flex align-items-end flex-nowrap text-break">
                {temp[field] && util.euckrBytes(temp[field])}byte
            </Col>
        </Form.Row>
    );
};

export default TitleForm;
