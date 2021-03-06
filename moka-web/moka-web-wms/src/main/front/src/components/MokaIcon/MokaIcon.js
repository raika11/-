import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icon from 'react-feather';

import {
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
    // faCalendarAlt as falCalendarAlt,
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
    faQuestionCircle as falQuestionCircle,
    faInfoCircle as falInfoCircle,
    faSlidersH as falSlidersH, // 메뉴 아이콘
    faTachometerSlow as falTachometerSlow, // 메뉴 아이콘
    faShieldCheck as falShieldCheck, // 메뉴 아이콘
    faSearchPlus as falSearchPlus,
    faEyeSlash as falEyeSlash,
    faExclamationTriangle as falExclamationTriangle,
    faUser as falUser,
    faLockAlt as falLockAlt,
    faCommentAltLines as falCommentAltLines,
    faCommentAlt as falCommentAlt,
    faTrashAlt as falTrashAlt,
    faUserCircle as falUserCircle,
    faFileExcel as falFileExcel,
    faLink as falLink,
    faUnlink as falUnlink,
    faMoneyCheckEdit as falMoneyCheckEdit,
    faTimes as falTimes,
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
    faStar as fasStar,
    faSort as fasSort,
    faCaretDown as fasCaretDown,
    faSearch as fasSearch,
    faCircle as fasCircle,
    faInfoCircle as fasInfoCircle,
    faUserCircle as fasUserCircle,
} from '@moka/fontawesome-pro-solid-svg-icons';
import { faRedoAlt as farRedoAlt, faUserCircle as farUserCircle, faCalendarAlt as farCalendarAlt } from '@moka/fontawesome-pro-regular-svg-icons';
import { faImage as fadImage, faThumbsUp as fadThumbsUp, faThumbsDown as fadThumbsDown } from '@moka/fontawesome-pro-duotone-svg-icons';
import { faFacebook as fabFacebook, faTwitter as fabTwitter, faFacebookSquare as fabFacebookSquare, faTwitterSquare as fabTwitterSquare } from '@fortawesome/free-brands-svg-icons';

// 아이콘 등록 (fal)
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
// library.add(falCalendarAlt);
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
library.add(falQuestionCircle);
library.add(falInfoCircle);
library.add(falSlidersH);
library.add(falTachometerSlow);
library.add(falShieldCheck);
library.add(falSearchPlus);
library.add(falEyeSlash);
library.add(falExclamationTriangle);
library.add(falUser);
library.add(falLockAlt);
library.add(falCommentAltLines);
library.add(falCommentAlt);
library.add(falTrashAlt);
library.add(falUserCircle);
library.add(falFileExcel);
library.add(falLink);
library.add(falUnlink);
library.add(falMoneyCheckEdit);
library.add(falTimes);

// 아이콘 등록(far)
library.add(farRedoAlt);
library.add(farUserCircle);
library.add(fasUserCircle);
library.add(farCalendarAlt);

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
library.add(fasStar);
library.add(fasCaretDown);
library.add(fasSearch);
library.add(fasSort);
library.add(fasCircle);
library.add(fasInfoCircle);

// 아이콘 등록 (fad)
library.add(fadImage);
library.add(fadThumbsUp);
library.add(fadThumbsDown);

// 아이콘 등록 (fab)
library.add(fabFacebook);
library.add(fabFacebookSquare);
library.add(fabTwitter);
library.add(fabTwitterSquare);

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
    /**
     * feather 아이콘인지, feather 아이콘이면 react-reather에서 그림
     * @default
     */
    feather: PropTypes.bool,
};
const defaultProps = {
    feather: false,
};

/**
 * fontawesome 아이콘 라이브러리
 */
const MokaIcon = (props) => {
    const { iconName, className, feather, ...rest } = props;

    if (!feather) {
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
    } else {
        const FeatherIcon = Icon[iconName];
        return <FeatherIcon className={className} strokeWidth={1.5} {...rest} />;
    }
    return null;
};

MokaIcon.propTypes = propTypes;
MokaIcon.defaultProps = defaultProps;

export default MokaIcon;
