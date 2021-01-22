package jmnet.moka.core.tps.mvc.search.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.search.dto.SearchKwdLogSearchDTO;
import jmnet.moka.core.tps.mvc.search.mapper.SearchKwdLogMapper;
import jmnet.moka.core.tps.mvc.search.repository.SearchKwdLogRepository;
import jmnet.moka.core.tps.mvc.search.vo.SearchKwdLogVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

/**
 * <pre>
 * 검색 키워드 서비스
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.search.service
 * ClassName : SearchKwdLogServiceImpl
 * Created : 2021-01-22 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-22 14:11
 */
@Service
public class SearchKwdLogServiceImpl implements SearchKwdLogService {

    @Autowired
    private SearchKwdLogRepository searchKwdLogRepository;

    @Autowired
    private SearchKwdLogMapper searchKwdLogMapper;

    @Override
    public Page<SearchKwdLogVO> findAllSearchKwdLogStat(SearchKwdLogSearchDTO searchDTO) {
        List<SearchKwdLogVO> list = searchKwdLogMapper.findAll(searchDTO);
        return new PageImpl<>(list, searchDTO.getPageable(), searchDTO.getTotal());
    }

    @Override
    public List<SearchKwdLogVO> findAllSearchKwdLogDetailStat(SearchKwdLogSearchDTO searchDTO) {
        return searchKwdLogMapper.findAllDetailStat(searchDTO);
    }
}
