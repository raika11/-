import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SmartphoneIcon from '@material-ui/icons/Smartphone';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import DevicesIcon from '@material-ui/icons/Devices';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        '& p': {
            lineHeight: '17px'
        }
    },
    icon: {
        fontSize: '14px !important;',
        lineHeight: '17px',
        marginRight: 5
    }
}));

const DomainPlatformIcon = (props) => {
    const { row } = props;
    const classes = useStyles();
    const [domainName, setDomainName] = useState('');
    const [icon, setIcon] = useState(null);

    useEffect(() => {
        if (row.domainName && row.domainName !== '') {
            setDomainName(row.domainName);
        } else {
            setDomainName('공통도메인');
            setIcon(<DevicesIcon classes={{ root: classes.icon }} />);
        }
        if (row.servicePlatform === 'P') {
            setIcon(<DesktopWindowsIcon classes={{ root: classes.icon }} />);
        } else if (row.servicePlatform === 'M') {
            setIcon(<SmartphoneIcon classes={{ root: classes.icon }} />);
        }
    }, [row, classes]);

    return (
        <div className={classes.root}>
            {icon}
            <Typography>{domainName}</Typography>
        </div>
    );
};

export default DomainPlatformIcon;
