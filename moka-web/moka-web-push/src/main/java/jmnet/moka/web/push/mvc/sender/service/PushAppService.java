package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.dto.PushAppSearchDTO;

/**
 * 작업 Service
 * 2021. 2. 18.
 *
 */
public interface PushAppService {
    /**
     * 등록가능한 데이터인지 체크한다.
     *
     * @param search 작업 정보
     * @return 중복여부
     */
    boolean isValidData(PushAppSearchDTO search);
}
