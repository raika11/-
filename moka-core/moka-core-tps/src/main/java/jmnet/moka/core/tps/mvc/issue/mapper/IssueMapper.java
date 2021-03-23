/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.issue.vo.PackageVO;

/**
 * Description: 이슈 mapper
 *
 * @author ssc
 * @since 2021-03-22
 */
public interface IssueMapper extends BaseMapper<PackageVO, PackageSearchDTO> {
}
