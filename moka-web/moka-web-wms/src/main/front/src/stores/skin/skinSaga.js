import { callApiAfterActions } from '~/stores/@common/createSaga';
import * as api from '~/stores/api/skinAPI';

/**
 * 목록 조회
 */
export const getSkinsSaga = callApiAfterActions(
    'skinStore/GET_SKINS',
    api.getSkins,
    (state) => state.skinStore
);
