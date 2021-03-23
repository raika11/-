package jmnet.moka.core.tps.mvc.push.repository;

import java.util.List;
import jmnet.moka.core.tps.common.entity.CommonCode;
import jmnet.moka.core.tps.mvc.push.dto.PushAppSearchDTO;
import jmnet.moka.core.tps.mvc.push.entity.PushApp;

/**
 * <pre>
 * 푸시앱 Repository Support
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.push.repository
 * ClassName : PushAppRepositorySupport
 * Created : 2021-03-23 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-23 08:21
 */
public interface PushAppRepositorySupport {

    /**
     * 푸시앱 목록 조회
     *
     * @param searchDTO 검색조건
     * @return 검색 결과
     */
    List<PushApp> findAll(PushAppSearchDTO searchDTO);

    /**
     * 푸시앱 일련번호 목록 조회
     *
     * @param searchDTO 검색조건
     * @return 검색 결과
     */
    List<Integer> findAllIds(PushAppSearchDTO searchDTO);

    /**
     * 푸시앱 구분 코드 목록 조회
     *
     * @return 검색 결과
     */
    List<CommonCode> findAllAppDiv();

    /**
     * 푸시앱 디바이스 구분 코드 목록 조회 - 기준 : appDiv
     *
     * @param searchDTO 검색조건
     * @return 검색 결과
     */
    List<CommonCode> findAllAppDevDiv(PushAppSearchDTO searchDTO);

    /**
     * 푸시앱 OS 구분 코드 목록 조회 - 기준 : appDiv, devDiv
     *
     * @param searchDTO 검색조건
     * @return 검색 결과
     */
    List<CommonCode> findAllAppOsDiv(PushAppSearchDTO searchDTO);
}
