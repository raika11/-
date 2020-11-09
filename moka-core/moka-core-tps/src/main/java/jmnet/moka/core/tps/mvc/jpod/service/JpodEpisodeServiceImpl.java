package jmnet.moka.core.tps.mvc.jpod.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodEpisodeSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisode;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisodeRelArt;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodKeyword;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodKeywordPK;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodMember;
import jmnet.moka.core.tps.mvc.jpod.mapper.JpodEpisodeMapper;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodEpisodeRelArtRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodEpisodeRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodKeywordRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodMemberRepository;
import jmnet.moka.core.tps.mvc.jpod.vo.JpodEpisodeVO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.service
 * ClassName : JpodEpisodeServiceImpl
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 13:37
 */
@Service
public class JpodEpisodeServiceImpl implements JpodEpisodeService {

    private final JpodEpisodeRepository jpodEpisodeRepository;

    private final JpodEpisodeMapper jpodEpisodeMapper;

    private final JpodKeywordRepository jpodKeywordRepository;

    private final JpodEpisodeRelArtRepository jpodEpisodeRelArtRepository;

    private final JpodMemberRepository jpodMemberRepository;

    public JpodEpisodeServiceImpl(JpodEpisodeRepository jpodEpisodeRepository, JpodEpisodeMapper jpodEpisodeMapper,
            JpodKeywordRepository jpodKeywordRepository, JpodEpisodeRelArtRepository jpodEpisodeRelArtRepository,
            JpodMemberRepository jpodMemberRepository) {
        this.jpodEpisodeRepository = jpodEpisodeRepository;
        this.jpodEpisodeMapper = jpodEpisodeMapper;
        this.jpodKeywordRepository = jpodKeywordRepository;
        this.jpodEpisodeRelArtRepository = jpodEpisodeRelArtRepository;
        this.jpodMemberRepository = jpodMemberRepository;
    }


    @Override
    public Page<JpodEpisode> findAllJpodEpisode(JpodEpisodeSearchDTO search) {
        return jpodEpisodeRepository.findAllJpodEpisode(search);
    }

    @Override
    public Optional<JpodEpisode> findJpodEpisodeById(Long episodeSeq) {
        return jpodEpisodeRepository.findById(episodeSeq);
    }

    @Override
    public JpodEpisode insertJpodEpisode(JpodEpisode episode) {
        return jpodEpisodeRepository.save(episode);
    }

    @Override
    public JpodEpisode updateJpodEpisode(JpodEpisode episode) {
        return jpodEpisodeRepository.save(episode);
    }


    @Override
    public void deleteJpodEpisodeBySeq(Long episodeSeq) {
        this
                .findJpodEpisodeById(episodeSeq)
                .ifPresent(this::deleteJpodEpisode);
    }

    @Override
    public void deleteJpodEpisode(JpodEpisode jpodEpisode) {
        jpodEpisodeRepository.delete(jpodEpisode);
    }

    @Override
    public void insertJpodKeyword(Long chnlSeq, Long epsdSeq, String[] keywords) {
        JpodEpisodeVO jpodEpisodeVO = JpodEpisodeVO
                .builder()
                .chnlSeq(chnlSeq)
                .epsdSeq(epsdSeq)
                .build();
        insertJpodKeyword(jpodEpisodeVO, keywords);

    }

    @Override
    public void insertJpodKeyword(JpodEpisodeVO jpodEpisodeVO, String[] keywords) {

        jpodEpisodeMapper.deleteAllMember(jpodEpisodeVO);
        int ordNo = 0;
        for (String keyword : keywords) {
            JpodKeyword jpodKeyword = JpodKeyword
                    .builder()
                    .id(JpodKeywordPK
                            .builder()
                            .chnlSeq(jpodEpisodeVO.getChnlSeq())
                            .epsdSeq(jpodEpisodeVO.getEpsdSeq())
                            .ordNo(++ordNo)
                            .build())
                    .keyword(keyword)
                    .build();
            jpodKeywordRepository.save(jpodKeyword);
        }
    }

    @Override
    public void insertJpodMember(Long chnlSeq, Long epsdSeq, List<JpodMember> members) {
        JpodEpisodeVO jpodEpisodeVO = JpodEpisodeVO
                .builder()
                .chnlSeq(chnlSeq)
                .epsdSeq(epsdSeq)
                .build();

        insertJpodMember(jpodEpisodeVO, members);
    }

    @Override
    public void insertJpodMember(JpodEpisodeVO jpodEpisodeVO, List<JpodMember> members) {

        jpodEpisodeMapper.deleteAllMember(jpodEpisodeVO);

        jpodMemberRepository.saveAll(members);
    }

    @Override
    public void insertJpodEpisodeRelArt(Long chnlSeq, Long epsdSeq, List<JpodEpisodeRelArt> arts) {
        JpodEpisodeVO jpodEpisodeVO = JpodEpisodeVO
                .builder()
                .chnlSeq(chnlSeq)
                .epsdSeq(epsdSeq)
                .build();

        insertJpodEpisodeRelArt(jpodEpisodeVO, arts);
    }

    @Override
    public void insertJpodEpisodeRelArt(JpodEpisodeVO jpodEpisodeVO, List<JpodEpisodeRelArt> arts) {

        jpodEpisodeMapper.deleteAllArticle(jpodEpisodeVO);

        jpodEpisodeRelArtRepository.saveAll(arts);
    }
}
