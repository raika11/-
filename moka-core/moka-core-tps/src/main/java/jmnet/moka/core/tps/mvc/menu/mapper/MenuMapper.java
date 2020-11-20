package jmnet.moka.core.tps.mvc.menu.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.menu.dto.MenuSearchDTO;
import jmnet.moka.core.tps.mvc.menu.vo.MenuVO;

public interface MenuMapper extends BaseMapper<MenuVO, MenuSearchDTO> {
    /**
     * 그룹 / 사용자의 권한 설정을 위한 메뉴 트리 목록 조회
     *
     * @param param 검색 파라미터
     * @return 검색 결과
     * @throws RuntimeException 에러 처리
     */
    List<MenuVO> findAllMenuAuth(MenuSearchDTO param)
            throws RuntimeException;

    /**
     * 메뉴 권한 일련번호를 반환한다.
     *
     * @param param 검색 파라미터
     * @return 메뉴 권한 일련번호
     * @throws RuntimeException 에러 처리
     */
    Long findMenuAuthSeq(MenuSearchDTO param)
            throws RuntimeException;
}
