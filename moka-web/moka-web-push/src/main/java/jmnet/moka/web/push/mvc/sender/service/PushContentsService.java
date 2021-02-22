package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.dto.PushAppSearchDTO;
import jmnet.moka.web.push.mvc.sender.dto.PushContentSeqSearchDTO;
import jmnet.moka.web.push.mvc.sender.dto.PushRelContentIdSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import jmnet.moka.web.push.mvc.sender.entity.PushContentsProc;
import org.springframework.data.domain.Page;

import java.util.Optional;

/**
 * 작업 Service
 * 2021. 2. 18.
 *
 */
public interface PushContentsService {
    /**
     * 등록가능한 데이터인지 체크한다.
     *
     * @param search 작업 정보
     * @return 중복여부
     */
    boolean isValidData(PushAppSearchDTO search);

    /**
     * 푸시 컨텐츠 등록
     *
     * @param pushContents 작업
     * @return 작업
     */
    PushContents savePushContents(PushContents pushContents);

    /**
     * 푸시 컨텐츠 조회
     *
     * @param search 작업 정보
     * @return 작업목록
     */
    Page<PushContents> findPushContentsList(PushRelContentIdSearchDTO search);

    /**
     * 푸시 컨텐츠 이력 등록
     *
     * @param pushContentsProc 작업
     * @return 작업
     */
    PushContentsProc savePushContentsProc(PushContentsProc pushContentsProc);

    /**
     * 예약 작업 테이블에 del_yn을 'N'으로 변경
     *
     * @param pushContents 작업
     * @return 작업
     */
    PushContents saveDelYn(PushContents pushContents);

    /**
     * 푸시 컨텐츠 조회
     *
     * @param search 작업 정보
     * @return 작업목록
     */
    Page<PushContents> findPushContents(PushContentSeqSearchDTO search);
}
