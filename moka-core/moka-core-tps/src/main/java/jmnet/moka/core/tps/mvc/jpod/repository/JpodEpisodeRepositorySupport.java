package jmnet.moka.core.tps.mvc.jpod.repository;

import jmnet.moka.core.tps.mvc.jpod.dto.JpodEpisodeSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisode;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.repository
 * ClassName : JpodEpisodeRepositorySupport
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 17:15
 */
public interface JpodEpisodeRepositorySupport {

    /**
     * 에피소드 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    Page<JpodEpisode> findAllJpodEpisode(JpodEpisodeSearchDTO search);

    /**
     * 사용 여부 변경
     *
     * @param epsdSeq 에피소드 일련번호
     * @param usedYn  사용여부
     * @return 성공여부
     */
    long updateUsedYn(Long epsdSeq, String usedYn);

    /**
     * 에피소드 일련번호 키워드 삭제
     *
     * @param epsdSeq 에피소드 일련번호
     * @return 삭제여부
     */
    long deleteKeywordByEpsdSeq(Long epsdSeq);

    /**
     * 에피소드 일련번호 관련기사 삭제
     *
     * @param epsdSeq 에피소드 일련번호
     * @return 삭제여부
     */
    long deleteArticleByEpsdSeq(Long epsdSeq);

    /**
     * 에피소드 일련번호 참여자 삭제
     *
     * @param epsdSeq 에피소드 일련번호
     * @return 삭제여부
     */
    long deleteMemberByEpsdSeq(Long epsdSeq);
}
