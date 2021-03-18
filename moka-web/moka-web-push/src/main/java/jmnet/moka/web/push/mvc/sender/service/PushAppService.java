package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.dto.PushAppSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushApp;

import java.util.Optional;

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


    /**
     * 앱 일련번호 조회
     *
     * @param AppOs
     * @param AppDiv
     * @param DevDiv
     * @return 앱 일련번호 조회
     */
    Optional<PushApp> findById(String AppOs, String AppDiv, String DevDiv);
}
