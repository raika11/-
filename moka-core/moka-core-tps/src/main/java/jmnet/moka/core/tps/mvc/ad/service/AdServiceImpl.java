package jmnet.moka.core.tps.mvc.ad.service;

import static jmnet.moka.common.data.mybatis.support.McpMybatis.getRowBounds;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.ad.dto.AdSearchDTO;
import jmnet.moka.core.tps.mvc.ad.mapper.AdMapper;
import jmnet.moka.core.tps.mvc.ad.repository.AdRepository;
import jmnet.moka.core.tps.mvc.ad.vo.AdVO;

@Service
public class AdServiceImpl implements AdService {

    @Autowired
    private AdMapper adMapper;

    @Autowired
    private AdRepository adRepository;

    @Override
    public List<AdVO> findList(AdSearchDTO search) {
        if (search.getSearchType().equals("pageSeq") && McpString.isNotEmpty(search.getKeyword())) {
            return adMapper.findPageChildRels(search,
                    getRowBounds(search.getPage(), search.getSize()));
        } else if (search.getSearchType().equals("skinSeq")
                && McpString.isNotEmpty(search.getKeyword())) {
            return adMapper.findSkinChildRels(search,
                    getRowBounds(search.getPage(), search.getSize()));
        } else if (search.getSearchType().equals("containerSeq")
                && McpString.isNotEmpty(search.getKeyword())) {
            return adMapper.findContainerChildRels(search,
                    getRowBounds(search.getPage(), search.getSize()));
        } else {
            if (search.getSearchType().equals("pageSeq") || search.getSearchType().equals("skinSeq")
                    || search.getSearchType().equals("containerSeq")) {
                search.clearSort();
                search.addSort("adSeq,desc");
            }
            return adMapper.findAll(search, getRowBounds(search.getPage(), search.getSize()));
        }
    }

    @Override
    public Long findListCount(AdSearchDTO search) {
        if (search.getSearchType().equals("pageSeq") && McpString.isNotEmpty(search.getKeyword())) {
            return adMapper.findPageChildRelsCount(search);
        } else if (search.getSearchType().equals("skinSeq")
                && McpString.isNotEmpty(search.getKeyword())) {
            return adMapper.findSkinChildRelsCount(search);
        } else if (search.getSearchType().equals("containerSeq")
                && McpString.isNotEmpty(search.getKeyword())) {
            return adMapper.findContainerChildRelsCount(search);
        } else {
            return adMapper.count(search);
        }
    }

    @Override
    public int countByDomainId(String domainId) {
        return adRepository.countByDomain_DomainId(domainId);
    }

}
