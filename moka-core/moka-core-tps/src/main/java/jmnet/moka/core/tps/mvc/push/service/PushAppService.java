package jmnet.moka.core.tps.mvc.push.service;

import java.util.List;
import jmnet.moka.core.tps.common.entity.CommonCode;
import jmnet.moka.core.tps.mvc.push.dto.PushAppSearchDTO;
import jmnet.moka.core.tps.mvc.push.entity.PushApp;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.push.service
 * ClassName : PushAppService
 * Created : 2021-03-23 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-23 08:10
 */
public interface PushAppService {

    /**
     * 푸시 앱 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색결과
     */
    List<PushApp> findAllPushApp(PushAppSearchDTO searchDTO);

    /**
     * 푸시 앱 일련번호 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색결과
     */
    List<Integer> findAllPushAppIds(PushAppSearchDTO searchDTO);

    /**
     * 푸시 앱 종류 조회
     *
     * @return 검색 결과
     */
    List<CommonCode> findAllAppDiv();

    /**
     * 푸시 앱 디바이스 종류 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    List<CommonCode> findAllDevDiv(PushAppSearchDTO searchDTO);

    /**
     * 푸시 앱 디바이스별 OS 종류 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    List<CommonCode> findAllAppOsDiv(PushAppSearchDTO searchDTO);
}
