import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { WmsTextField, WmsButton } from '~/components';
import { loginJwt } from '~/stores/auth/authStore';
import Notifier from '../WmsRoute/Notifier';
import style from '~/assets/jss/components/WmsLoginStyle';

const useStyle = makeStyles(style);

const WmsLogin = () => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [idErr, setIdErr] = useState(false);
    const [pwErr, setPwErr] = useState(false);

    const changeId = (e) => {
        setId(e.target.value);
        setIdErr(false);
    };

    const changePw = (e) => {
        setPw(e.target.value);
        setPwErr(false);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (id.length < 1) {
            setIdErr(true);
            return;
        }
        if (pw.length < 1) {
            setPwErr(true);
            return;
        }
        dispatch(
            loginJwt({
                userId: id,
                userPassword: pw
            })
        );
    };

    return (
        <div className={classes.wrapper}>
            <Notifier />
            <Paper className={classes.paper}>
                <div className={classes.mb42}>
                    <Typography component="p" variant="h1">
                        Login
                    </Typography>
                </div>
                <div className={classes.mb8}>
                    <WmsTextField
                        label="아이디"
                        labelWidth="120"
                        value={id}
                        onChange={changeId}
                        onEnter={handleLogin}
                        fullWidth
                        error={idErr}
                    />
                </div>
                <div className={classes.mb42}>
                    <WmsTextField
                        label="password"
                        labelWidth="120"
                        value={pw}
                        fullWidth
                        onChange={changePw}
                        inputProps={{ type: 'password' }}
                        onEnter={handleLogin}
                        error={pwErr}
                    />
                </div>
                <div>
                    <WmsButton onClick={handleLogin} fullWidth>
                        로그인
                    </WmsButton>
                </div>
            </Paper>
        </div>
    );
};

export default WmsLogin;
