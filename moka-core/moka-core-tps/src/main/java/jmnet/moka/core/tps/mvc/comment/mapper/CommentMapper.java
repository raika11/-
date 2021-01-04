package jmnet.moka.core.tps.mvc.comment.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.comment.dto.CommentSearchDTO;
import jmnet.moka.core.tps.mvc.comment.vo.CommentVO;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.comment.mvc.comment.mapper
 * ClassName : CommentMapper
 * Created : 2020-12-28 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-28 15:45
 */
public interface CommentMapper extends BaseMapper<CommentVO, CommentSearchDTO> {
}
