import useCancellablePromises from './useCancellablePromises';
import utils from '@utils/commonUtil';

/**
 * click, doubleclick 분리
 * @param {func} onClick 클릭 이벤트
 * @param {func} onDoubleClick 더블클릭 이벤트
 */
const useClickPreventionOnDoubleClick = (onClick, onDoubleClick) => {
    const api = useCancellablePromises();

    const handleClick = () => {
        api.clearPendingPromises();
        const waitForClick = utils.cancellablePromise(utils.delay(300));
        api.appendPendingPromise(waitForClick);

        return waitForClick.promise
            .then(() => {
                api.removePendingPromise(waitForClick);
                onClick();
            })
            .catch((errorInfo) => {
                api.removePendingPromise(waitForClick);
                if (!errorInfo.isCanceled) {
                    throw errorInfo.error;
                }
            });
    };

    const handleDoubleClick = () => {
        api.clearPendingPromises();
        onDoubleClick();
    };

    return [handleClick, handleDoubleClick];
};

export default useClickPreventionOnDoubleClick;
