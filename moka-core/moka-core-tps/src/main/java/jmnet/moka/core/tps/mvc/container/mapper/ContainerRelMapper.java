package jmnet.moka.core.tps.mvc.container.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.container.dto.ContainerSearchDTO;
import jmnet.moka.core.tps.mvc.container.vo.ContainerVO;

public interface ContainerRelMapper extends BaseMapper<ContainerVO, ContainerSearchDTO> {
    Long deleteByContainerSeq(Long containerSeq);
}
