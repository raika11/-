package jmnet.moka.core.tps.mvc.achive.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.BeanConverter;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.mvc.achive.dto.PhotoArchiveSearchDTO;
import jmnet.moka.core.tps.mvc.achive.vo.CmsDataVO;
import jmnet.moka.core.tps.mvc.achive.vo.CmsResultListVO;
import jmnet.moka.core.tps.mvc.achive.vo.CmsVO;
import jmnet.moka.core.tps.mvc.achive.vo.OriginCodeVO;
import jmnet.moka.core.tps.mvc.achive.vo.PhotoArchiveVO;
import jmnet.moka.core.tps.mvc.achive.vo.PhotoTypeVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.achive.service
 * ClassName : PhotoArchiveServiceImpl
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 18:09
 */
@Slf4j
@Service
public class PhotoArchiveServiceImpl implements PhotoArchiveService {

    private final static String IMAGE = "IMAGE";

    @Value("${cms.archive.sha512hex.data}")
    private String serviceType;

    @Value("${cms.archive.sha512hex.salt}")
    private String salt;

    @Value("${cms.archive.address}")
    private String archiveAddress;

    @Value("${cms.archive.api.photo-list}")
    private String photoListApi;

    @Value("${cms.archive.api.photo-detail}")
    private String photoDetailApi;

    @Value("${cms.archive.api.origin-code-list}")
    private String originCodeListApi;

    @Value("${cms.archive.api.photo-type-list}")
    private String photoTypeListApi;

    private final RestTemplateHelper restTemplateHelper;



    public PhotoArchiveServiceImpl(RestTemplateHelper restTemplateHelper) {
        this.restTemplateHelper = restTemplateHelper;
    }

    /**
     * 사진 아카이브 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    @Override
    public Page<PhotoArchiveVO> findAllPhotoArchive(PhotoArchiveSearchDTO searchDTO, String memberId) {
        CmsVO<CmsResultListVO<PhotoArchiveVO>> result = new CmsVO<>();
        try {
            MultiValueMap<String, Object> params = MapBuilder
                    .getInstance()
                    .getMultiValueMap();
            params.setAll(BeanConverter.toMap(searchDTO));
            params.set("page", searchDTO.getPage() + 1);
            params.remove("createdOrderby");
            params.remove("textOrderby");
            params.set("pageCount", searchDTO.getSize());
            if (McpString.isNotEmpty(searchDTO.getCreatedOrderby())) {
                params.set("created_orderby", searchDTO.getCreatedOrderby());
            }
            if (McpString.isNotEmpty(searchDTO.getTextOrderby())) {
                params.set("text_orderby", searchDTO.getTextOrderby());
            }
            if (McpString.isNotEmpty(searchDTO.getSearchType())) {
                params.set("searchKey", searchDTO.getSearchType());
            }
            if (McpString.isNotEmpty(searchDTO.getKeyword())) {
                params.set("searchValue", searchDTO.getKeyword());
            }
            ResponseEntity<String> responseEntity = restTemplateHelper.post(archiveAddress + photoListApi, params, getHeader(memberId));

            result = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(responseEntity.getBody(), new TypeReference<CmsVO<CmsResultListVO<PhotoArchiveVO>>>() {
                    });

        } catch (Exception ex) {
            log.error(ex.toString());
        }

        Page page = result != null ? new PageImpl<PhotoArchiveVO>(result
                .getData()
                .getResultList(), searchDTO.getPageable(), result
                .getData()
                .getTotalCount()) : new PageImpl<PhotoArchiveVO>(null, searchDTO.getPageable(), 0);

        return page;
    }

    /**
     * 사진 정보 조회
     *
     * @param id 사진 ID
     * @return 사진 정보
     */
    @Override
    public Optional<PhotoArchiveVO> findPhotoArchiveById(String id, String memberId) {
        PhotoArchiveVO result = null;
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        params.set("nid", id);
        ResponseEntity<String> responseEntity = restTemplateHelper.post(archiveAddress + photoDetailApi, params, getHeader(memberId));
        try {
            CmsVO<PhotoArchiveVO> resultCmsVo = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(responseEntity.getBody(), new TypeReference<CmsVO<PhotoArchiveVO>>() {
                    });

            result = resultCmsVo.getData();
        } catch (Exception ex) {
            log.error(ex.toString());
        }
        return Optional.ofNullable(result);
    }


    /**
     * 사진 아카이브 목록 조회
     *
     * @param menuNo 메뉴 코드
     * @return 검색 결과
     */
    @Override
    public List<OriginCodeVO> findAllPhotoOrigin(String menuNo, String memberId) {
        CmsVO<CmsDataVO<OriginCodeVO>> result = new CmsVO<>();
        try {
            MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
            params.set("menuNo", menuNo);
            ResponseEntity<String> responseEntity = restTemplateHelper.post(archiveAddress + originCodeListApi, params, getHeader(memberId));

            result = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(responseEntity.getBody(), new TypeReference<CmsVO<CmsDataVO<OriginCodeVO>>>() {
                    });

        } catch (Exception ex) {
            log.error(ex.toString());
        }

        return result.getData() != null ? result
                .getData()
                .getData() : null;
    }

    @Override
    public List<PhotoTypeVO> findAllPhotoType(String memberId) {
        CmsVO<CmsDataVO<PhotoTypeVO>> result = new CmsVO<>();
        try {
            MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
            params.set("type", IMAGE);
            ResponseEntity<String> responseEntity = restTemplateHelper.post(archiveAddress + photoTypeListApi, params, getHeader(memberId));

            result = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(responseEntity.getBody(), new TypeReference<CmsVO<CmsDataVO<PhotoTypeVO>>>() {
                    });

        } catch (Exception ex) {
            log.error(ex.toString());
        }

        return result.getData() != null ? result
                .getData()
                .getData() : null;
    }


    /**
     * Request Header 설정
     *
     * @param memberId 사용자ID
     * @return MultiValueMap
     */
    private MultiValueMap<String, String> getHeader(String memberId) {
        MultiValueMap<String, String> header = new LinkedMultiValueMap<>();
        try {
            String userToken = DigestUtils
                    .sha512Hex(String.format("%s%s", serviceType, salt))
                    .toUpperCase();

            header.set("user-id", memberId);
            header.set("user-token", userToken);
            header.set("service-Type", serviceType);
        } catch (Exception ex) {
            log.error(ex.toString());
        }
        return header;
    }
}
