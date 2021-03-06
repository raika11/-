package jmnet.moka.core.tps.mvc.bulklog.service;

import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogSearchDTO;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogTotalDTO;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogTotalIdDTO;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkTotalLogVO;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkLogVO;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bulklog.service
 * ClassName : BulkLogService
 * Created : 2021-01-22 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-22 14:02
 */
public interface BulkLogService {

    List<BulkTotalLogVO> findAllBulkLogStat(BulkLogTotalDTO searchDTO);

    Page<BulkLogVO> findAllBulkLogStatList(BulkLogSearchDTO searchDTO);

    Page<BulkLogVO> findAllBulkLogStatListByInfo(BulkLogTotalIdDTO searchDTO);

    Page<BulkLogVO> findAllBulkLogStatListByInfoMsg(BulkLogTotalIdDTO searchDTO);
}
