package jmnet.moka.core.tps.mvc.pkg.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.pkg.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.pkg.vo.PackageSimpleVO;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.pkg.mapper
 * ClassName : PackageMapper
 * Created : 2021-03-24
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-24 오전 10:42
 */
public interface PackageMapper extends BaseMapper<PackageSimpleVO, PackageSearchDTO> {

    /**
     * 패키지 목록 조회
     *
     * @param search 검색조건
     * @return 패키지 목록
     */
    List<PackageSimpleVO> findAllPackage(PackageSearchDTO search);
}
