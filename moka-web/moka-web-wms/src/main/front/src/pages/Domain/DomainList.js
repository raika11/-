import React, { Suspense, useEffect, useState } from 'react';
import AgGrid from './DomainAgGrid';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { changeSearchOption, getDomains } from '@store/domain';

/**
 * <pre>
 *
 * 2020-10-14 thkim 최초생성
 * </pre>
 *
 * @since 2020-10-14 오후 1:23
 * @author thkim
 */
const DomainList = () => {
    return (
        <>
            <AgGrid />
        </>
    );
};

export default DomainList;
