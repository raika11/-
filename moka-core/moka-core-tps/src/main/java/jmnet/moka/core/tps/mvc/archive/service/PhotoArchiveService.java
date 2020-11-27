package jmnet.moka.core.tps.mvc.archive.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.archive.dto.PhotoArchiveSearchDTO;
import jmnet.moka.core.tps.mvc.archive.vo.OriginCodeVO;
import jmnet.moka.core.tps.mvc.archive.vo.PhotoArchiveDetailVO;
import jmnet.moka.core.tps.mvc.archive.vo.PhotoArchiveVO;
import jmnet.moka.core.tps.mvc.archive.vo.PhotoTypeVO;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.achive.service
 * ClassName : PhotoArchiveService
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 17:52
 */
public interface PhotoArchiveService {

    /**
     * 사진 아카이브 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    Page<PhotoArchiveVO> findAllPhotoArchive(PhotoArchiveSearchDTO searchDTO, String memberId);

    /**
     * 사진 정보 조회
     *
     * @param id 사진 ID
     * @return 사진 정보
     */
    Optional<PhotoArchiveDetailVO> findPhotoArchiveById(String id, String memberId);

    /**
     * 사진 아카이브 목록 조회
     *
     * @param menuNo 메뉴 코드
     * @return 검색 결과
     */
    List<OriginCodeVO> findAllPhotoOrigin(String menuNo, String memberId);

    /**
     * 사진 목록 조회
     *
     * @param memberId 사용자 ID
     * @return 검색 결과
     */
    List<PhotoTypeVO> findAllPhotoType(String memberId);
}
