/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.issue.mapper.IssueMapper;
import jmnet.moka.core.tps.mvc.issue.vo.PackageVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Description: 이슈패키지 서비스impl
 *
 * @author ssc
 * @since 2021-03-22
 */
@Service
@Slf4j
public class PackageServiceImpl implements PackageService {

    @Autowired
    private IssueMapper issueMapper;

    @Override
    public List<PackageVO> findAllPackage(PackageSearchDTO search) {
        return issueMapper.findAll(search);
    }
}
