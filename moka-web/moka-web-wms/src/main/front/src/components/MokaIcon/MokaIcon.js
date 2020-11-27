import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import {
    faCoffee as falCoffee,
    faAngleDoubleLeft as falAngleDoubleLeft,
    faSearch as falSearch,
    faExpandArrows as falExpandArrows,
    faCompressArrowsAlt as falCompressArrowsAlt,
    faArrowToRight as falArrowToRight,
    faRepeat as falRepeat,
    faFile as falFile,
    faFileAlt as falFileAlt,
    faBox as falBox,
    faBallot as falBallot,
    faNewspaper as falNewspaper,
    faAd as falAd,
    faHistory as falHistory,
    faFilePlus as falFilePlus,
    faExternalLink as falExternalLink,
    faEllipsisV as falEllipsisV,
    faEllipsisVAlt as falEllipsisVAlt,
    faPlus as falPlus,
    faMinus as falMinus,
    faFileImport as falFileImport,
    faFileSearch as falFileSearch,
    faCopy as falCopy,
    faCloudUpload as falCloudUpload,
    faMinusSquare as falMinusSquare,
    faSignOutAlt as falSignOutAlt,
    faCalendarAlt as falCalendarAlt,
    faMinusCircle as falMinusCircle,
    faClock as falClock,
    faSave as falSave,
    faMoneyCheck as falMoneyCheck, // 페이지탭 아이콘
    faCalculator as falCalculator, // 컨테이너탭 아이콘
    faTv as falTv, // 페이지편집 > 미리보기
    faCode as falCode,
    faExpandWide as falExpandWide,
    faShareSquare as falShareSquare,
    faPencil as falPencil,
    faAlarmClock as falAlarmClock,
} from '@moka/fontawesome-pro-light-svg-icons';
import {
    faThList as fasThList,
    faThLarge as fasThLarge,
    faAngleLeft as fasAngleLeft,
    faAngleRight as fasAngleRight,
    faPlayCircle as fasPlayCircle,
    faMinusCircle as fasMinusCircle,
    faPencil as fasPencil,
    faCheck as fasCheck,
    faTimes as fasTimes,
} from '@moka/fontawesome-pro-solid-svg-icons';
import { faRedoAlt as farRedoAlt } from '@moka/fontawesome-pro-regular-svg-icons';
import { faImage as fadImage } from '@moka/fontawesome-pro-duotone-svg-icons';
import { faFacebook as fabFacebook, faTwitter as fabTwitter } from '@fortawesome/free-brands-svg-icons';

// 아이콘 등록 (fal)
library.add(falCoffee);
library.add(falAngleDoubleLeft);
library.add(falSearch);
library.add(falExpandArrows);
library.add(falCompressArrowsAlt);
library.add(falArrowToRight);
library.add(falRepeat);
library.add(falFile);
library.add(falFileAlt);
library.add(falBox);
library.add(falBallot);
library.add(falNewspaper);
library.add(falAd);
library.add(falHistory);
library.add(falFilePlus);
library.add(falExternalLink);
library.add(falEllipsisV);
library.add(falEllipsisVAlt);
library.add(falPlus);
library.add(falMinus);
library.add(falFileImport);
library.add(falFileSearch);
library.add(falCopy);
library.add(falCloudUpload);
library.add(falMinusSquare);
library.add(falMinus);
library.add(falSignOutAlt);
library.add(falCalendarAlt);
library.add(falMinusCircle);
library.add(falClock);
library.add(falMoneyCheck);
library.add(falCalculator);
library.add(falTv);
library.add(falSave);
library.add(falCode);
library.add(falExpandWide);
library.add(falShareSquare);
library.add(falPencil);
library.add(falAlarmClock);

// 아이콘 등록(far)
library.add(farRedoAlt);

// 아이콘 등록 (fas)
library.add(fasThLarge);
library.add(fasThList);
library.add(fasAngleLeft);
library.add(fasAngleRight);
library.add(fasPlayCircle);
library.add(fasMinusCircle);
library.add(fasPencil);
library.add(fasCheck);
library.add(fasTimes);

// 아이콘 등록 (fad)
library.add(fadImage);

// 아이콘 등록 (fab)
library.add(fabFacebook);
library.add(fabTwitter);

const propTypes = {
    /**
     * iconName
     * string으로 들어오는 경우 fal-coffee => ['fal','coffee'] 로 변환함
     */
    iconName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * className
     */
    className: PropTypes.string,
};
const defaultProps = {};

/**
 * fontawesome 아이콘 라이브러리
 */
const MokaIcon = (props) => {
    const { iconName, className, ...rest } = props;

    if (typeof iconName === 'string') {
        const prefix = iconName.slice(0, 4);
        const rIconName = iconName.slice(4, iconName.length);
        let iconArray = ['fal', iconName];

        if (prefix === 'fal-') {
            iconArray = ['fal', rIconName];
        } else if (prefix === 'fas-') {
            iconArray = ['fas', rIconName];
        } else if (prefix === 'far-') {
            iconArray = ['far', rIconName];
        } else if (prefix === 'fab-') {
            iconArray = ['fab', rIconName];
        } else if (prefix === 'fad-') {
            iconArray = ['fad', rIconName];
        }

        return <FontAwesomeIcon icon={iconArray} className={className} {...rest} />;
    } else if (Array.isArray(iconName)) {
        return <FontAwesomeIcon icon={iconName} {...rest} />;
    }

    return null;
};

MokaIcon.propTypes = propTypes;
MokaIcon.defaultProps = defaultProps;

export default MokaIcon;
