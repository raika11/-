import React from 'react';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import { MokaIcon, MokaInput, MokaInputLabel } from '@/components';

const propTypes = {
    /**
     * 파라미터 목록
     */
    params: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            desc: PropTypes.string,
            paramYn: PropTypes.string,
            dataType: PropTypes.string,
        }),
    ),
};

const defaultProps = {
    params: [],
};

/**
 * 파라미터 컴포넌트
 */
const ParamsRenderer = (props) => {
    const { params, onClick } = props;

    return (
        <>
            {params.length > 0 && (
                <>
                    {params.map(({ name, desc, paramYn, dataType }, idx) => (
                        <div className="mb-2 d-flex align-items-center" key={idx}>
                            <MokaInputLabel label=" " className="mr-2" name="paramName" value={name} />
                            <MokaInput placeholder="파라미터 설명" className="mr-2" style={{ width: 350 }} name="paramDesc" value={desc} />
                            <MokaInput as="select" className="mr-2" style={{ width: 80 }} name="paramYn" value={paramYn}>
                                <option value="N">선택</option>
                                <option value="Y">필수</option>
                            </MokaInput>
                            <MokaInput as="select" className="mr-2" style={{ width: 150 }} name="dataType" value={dataType}>
                                <option value="string">String</option>
                                <option value="integer">Integer</option>
                                <option value="long">Long</option>
                                <option value="arrayString">Array[string]</option>
                                <option value="dateTime">Date-time</option>
                                <option value="file">File</option>
                            </MokaInput>
                            <div className="h-100 d-flex align-items-center justify-content-center">
                                <OverlayTrigger overlay={<Tooltip id="tooltip-api-edit">파라미터 삭제</Tooltip>}>
                                    <Button variant="white" className="border p-0 moka-table-button" onClick={onClick}>
                                        <MokaIcon iconName="fal-minus" />
                                    </Button>
                                </OverlayTrigger>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </>
    );
};

ParamsRenderer.propTypes = propTypes;
ParamsRenderer.defaultProps = defaultProps;

export default ParamsRenderer;
