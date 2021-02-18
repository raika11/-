package jmnet.moka.core.tps.mvc.jpod.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.jpod.vo.JpodEpisodeStatVO;
import jmnet.moka.core.tps.mvc.jpod.vo.JpodEpisodeVO;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.mapper
 * ClassName : JpodEpisodeMapper
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 17:37
 */
public interface JpodEpisodeMapper extends BaseMapper<JpodEpisodeVO, JpodEpisodeVO> {

    void deleteAllKeyword(JpodEpisodeVO episodeVO);

    void deleteAllMember(JpodEpisodeVO episodeVO);

    void deleteAllArticle(JpodEpisodeVO episodeVO);

    JpodEpisodeStatVO findEpisodeStat(JpodEpisodeVO episodeVO);
}
