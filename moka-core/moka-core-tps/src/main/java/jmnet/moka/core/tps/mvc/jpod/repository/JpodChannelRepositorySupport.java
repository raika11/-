package jmnet.moka.core.tps.mvc.jpod.repository;

import jmnet.moka.core.tps.mvc.jpod.dto.JpodChannelSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodChannel;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.repository
 * ClassName : JpodChannelRepositorySupport
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 13:48
 */
public interface JpodChannelRepositorySupport {

    /**
     * jpod 채넑 목록 조회
     *
     * @param search 검색 조건
     * @return 채널 목록
     */
    Page<JpodChannel> findAllJpodChannel(JpodChannelSearchDTO search);

    /**
     * J팟 채널 일련번호 키워드 삭제
     *
     * @param chnlSeq J팟 채널 일련번호
     * @return 삭제여부
     */
    long deleteKeywordByChnlSeq(Long chnlSeq);
    

    /**
     * J팟 채널 일련번호 참여자 삭제
     *
     * @param chnlSeq J팟 채널 일련번호
     * @return 삭제여부
     */
    long deleteMemberByChnlSeq(Long chnlSeq);
}
