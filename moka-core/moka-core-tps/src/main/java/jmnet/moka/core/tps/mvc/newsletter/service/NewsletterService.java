package jmnet.moka.core.tps.mvc.newsletter.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSearchDTO;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterExcel;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfo;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfoHist;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterSend;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.service
 * ClassName : NewsletterService
 * Created : 2021-04-16 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-16 오후 4:19
 */
public interface NewsletterService {
    /**
     * 뉴스레터 상품 조회
     *
     * @param search
     * @return
     */
    Page<NewsletterInfo> findAll(NewsletterSearchDTO search);

    /**
     * 뉴스레터 상품 조회
     *
     * @param letterSeq 뉴스레터상품 일련번호
     * @return
     */
    Optional<NewsletterInfo> findByLetterSeq(Long letterSeq);

    /**
     * 뉴스레터 일련번호별 히스토리 조회
     *
     * @param letterSeq
     * @param search
     * @return
     */
    Page<NewsletterInfoHist> findAllNewsletterInfoHistByLetterSeq(Long letterSeq, NewsletterSearchDTO search);

    /**
     * 뉴스레터 일련번호별 히스토리 상세 비교
     *
     * @param histSeq 히스토리 일련번호
     * @return
     */
    List<NewsletterInfoHist> findTop2ByLetterSeqAndHistSeq(Long histSeq);

    /**
     * 뉴스레터 채널별 등록된 컨텐츠 조회
     *
     * @param channelType 채널 타입
     * @return
     */
    List<Long> findChannelIdByChannelType(String channelType);

    /**
     * 뉴스레터 상품 등록
     *
     * @param newsletterInfo
     * @return
     */
    NewsletterInfo insertNewsletterInfo(NewsletterInfo newsletterInfo);

    /**
     * 뉴스레터 상품 수정
     *
     * @param newsletterInfo
     * @return
     */
    NewsletterInfo updateNewsletterInfo(NewsletterInfo newsletterInfo);

    /**
     * 뉴스레터 발송 조회
     *
     * @param search
     * @return
     */
    Page<NewsletterSend> findAllNewsletterSend(NewsletterSearchDTO search);

    /**
     * 뉴스레터 발송 상세
     *
     * @param sendSeq
     * @return
     */
    Optional<NewsletterSend> findNewsletterSendBySendSeq(Long sendSeq);

    /**
     * 뉴스레터 방송(수동) 등록
     *
     * @param newsletterSend
     * @return
     */
    NewsletterSend insertNewsletterSend(NewsletterSend newsletterSend, List<NewsletterExcel> emailList);

    /**
     * 뉴스레터 방송(수동) 수정
     *
     * @param newsletterSend
     * @return
     */
    NewsletterSend updateNewsletterSend(NewsletterSend newsletterSend, List<NewsletterExcel> emailList);
}
