import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { removeSnackbar } from '~/stores/notification/snackbarStore';

const defaultOptions = {
    anchorOrigin: { horizontal: 'center', vertical: 'top' },
    autoHideDuration: 3000
};

let displayed = [];
const storeDisplayed = (id) => {
    displayed = [...displayed, id];
};

/**
 * snackbar notifier 구현
 */
const Notifier = () => {
    // notistack
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const noti = useSelector((state) => state.snackbarStore.noti);

    // notistack 처리
    useEffect(() => {
        noti.forEach(({ key, message, options = {}, callback }) => {
            if (displayed.includes(key)) return;

            enqueueSnackbar(message, {
                key,
                ...{ ...defaultOptions, ...options },
                style: { whiteSpace: 'pre-line' },
                onClose: (event, reason, myKey) => {
                    if (callback) {
                        callback(event, reason, myKey);
                    }
                },
                onExited: (event, myKey) => {
                    closeSnackbar(myKey);
                    dispatch(removeSnackbar(myKey));
                }
            });

            storeDisplayed(key);
        });
    }, [noti, enqueueSnackbar, dispatch, closeSnackbar]);

    return null;
};

export default Notifier;
