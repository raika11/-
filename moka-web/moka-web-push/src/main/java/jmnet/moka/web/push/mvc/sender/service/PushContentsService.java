package jmnet.moka.web.push.mvc.sender.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.web.push.mvc.sender.dto.PushContentUsedYnSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import org.springframework.data.domain.Page;

/**
 * 작업 Service 2021. 2. 18.
 */
public interface PushContentsService {

    /**
     * 푸시 컨텐츠 등록
     *
     * @param pushContents 작업
     * @return 작업
     */
    PushContents savePushContents(PushContents pushContents);

    /**
     * 예약 작업 테이블에 del_yn을 'N'으로 변경
     *
     * @param pushContents 작업
     * @return 작업
     */
    PushContents saveUsedYn(PushContents pushContents);

    /**
     * 푸시 컨텐츠 조회
     *
     * @param contentSeq 일련번호
     * @return 컨텐츠 정보
     */
    Optional<PushContents> findPushContentsBySeq(Long contentSeq);

    /**
     * 푸시 컨텐츠 조회
     *
     * @param search 작업 정보
     * @return 작업목록
     */
    Page<PushContents> findAllByUsedYn(PushContentUsedYnSearchDTO search);

    /**
     * 푸시 컨텐츠 조회
     *
     * @param relContentId 일련번호
     * @return 컨텐츠 정보
     */
    List<PushContents> findByRelContentId(Long relContentId);

    /**
     * 요청한 취소 정보가 취소 가능한 작업인지 체크한다.
     *
     * @param contentSeq, pushYn 작업 정보
     * @return 중복여부
     */
    Long countByContentSeqAndPushYn(Long contentSeq, String pushYn);
}
