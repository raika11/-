/**
 * msp-tps NaverBulkServiceImpl.java 2020. 1. 8. 오후 2:07:40 ssc
 */
package jmnet.moka.core.tps.mvc.naverbulk.service;

import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.naverbulk.dto.NaverBulkListDTO;
import jmnet.moka.core.tps.mvc.naverbulk.dto.NaverBulkSearchDTO;
import jmnet.moka.core.tps.mvc.naverbulk.entity.Article;
import jmnet.moka.core.tps.mvc.naverbulk.entity.ArticleList;
import jmnet.moka.core.tps.mvc.naverbulk.entity.ArticlePK;
import jmnet.moka.core.tps.mvc.naverbulk.repository.NaverBulkListRepository;
import jmnet.moka.core.tps.mvc.naverbulk.repository.NaverBulkRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 네이버벌크목록 서비스 2020. 11. 11. ssc 최초생성
 *
 * @author ssc
 * @since 2020. 11. 11. 오후 2:07:40
 */
@Service
@Slf4j
public class NaverBulkServiceImpl implements NaverBulkService {

    @Autowired
    private NaverBulkRepository naverBulkRepository;

    @Autowired
    private NaverBulkListRepository naverBulkListRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Page<Article> findAllNaverBulkList(NaverBulkSearchDTO search) {
        return naverBulkRepository.findAllNaverBulkList(search);
    }

//    @Override
//    public List<ArticleList>  findAllByClickartSeq(Long clickartSeq) {
//        return naverBulkListRepository.findAllByClickartSeq(
//                new ArticlePK(clickartSeq, null)
//        );
//    }

    @Override
    public Optional<Article> findById(Long clickartSeq) {
        return naverBulkRepository.findById(clickartSeq);
    }

    @Override
    public void updateArticle(Article article) {
        naverBulkRepository.updateArticle(article) ;
    }

    @Transactional
    @Override
    public Article insertNaverBulk(List<NaverBulkListDTO> asList, String clickartDiv, String sourceCode, String status) {

        Article saveArticle = new Article();

        try {
            saveArticle.setClickartDiv(clickartDiv);
            saveArticle.setSourceCode(sourceCode);
            saveArticle.setStatus(status);

            if(MokaConstants.STATUS_PUBLISH.equals(status)){
                saveArticle.setUsedYn(MokaConstants.YES);
                saveArticle.setSendDt(McpDate.now());
            }

            // 마스터 테이블에 한건
            saveArticle = naverBulkRepository.save(saveArticle);

            // 여기서 기존 로직 처리
            naverBulkRepository.updateArticle(saveArticle) ;
            Long clickarSeq = saveArticle.getClickartSeq();
            ArticlePK articlePK = new ArticlePK();
            for(NaverBulkListDTO naverBulkListDTO : asList){
                ArticleList articleList = modelMapper.map(naverBulkListDTO, ArticleList.class);
                articlePK.setClickartSeq(saveArticle.getClickartSeq());
                articlePK.setOrdNo(Long.valueOf(asList.indexOf(naverBulkListDTO)+1));
                articleList.setId(articlePK);
                articleList = naverBulkListRepository.save(articleList);
            }
        } catch (Exception e) {
            log.error(e.toString());
        }

        return saveArticle;
    }

    @Override
    public boolean isDuplicatedId(Long clickartSeq) {
        Optional<Article> existingArticle = this.findById(clickartSeq);
        return existingArticle.isPresent();
    }

}
