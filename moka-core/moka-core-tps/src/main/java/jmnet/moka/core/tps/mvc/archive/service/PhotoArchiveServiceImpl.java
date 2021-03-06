package jmnet.moka.core.tps.mvc.archive.service;

import com.fasterxml.jackson.core.type.TypeReference;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.BeanConverter;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.mvc.archive.dto.PhotoArchiveSearchDTO;
import jmnet.moka.core.tps.mvc.archive.vo.CmsDataVO;
import jmnet.moka.core.tps.mvc.archive.vo.CmsResultListVO;
import jmnet.moka.core.tps.mvc.archive.vo.CmsRetrieveVO;
import jmnet.moka.core.tps.mvc.archive.vo.CmsVO;
import jmnet.moka.core.tps.mvc.archive.vo.OriginCodeVO;
import jmnet.moka.core.tps.mvc.archive.vo.PhotoArchiveDetailVO;
import jmnet.moka.core.tps.mvc.archive.vo.PhotoArchiveVO;
import jmnet.moka.core.tps.mvc.archive.vo.PhotoTypeVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.archive.service
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
     * ?????? ???????????? ?????? ??????
     *
     * @param searchDTO ?????? ??????
     * @return ?????? ??????
     */
    @Override
    public Page<PhotoArchiveVO> findAllPhotoArchive(PhotoArchiveSearchDTO searchDTO, String memberId) {
        CmsVO<CmsResultListVO<PhotoArchiveVO>> result;
        Page<PhotoArchiveVO> page = new PageImpl<>(new ArrayList<>(), PageRequest.of(searchDTO.getPage(), searchDTO.getPageCount()), 0);
        try {
            MultiValueMap<String, Object> params = MapBuilder
                    .getInstance()
                    .getMultiValueMap();
            BeanConverter
                    .toMap(searchDTO)
                    .entrySet()
                    .forEach(entry -> {
                        if (entry.getValue() != null) {
                            if (entry
                                    .getKey()
                                    .equals("page")) {
                                params.set("page", searchDTO.getPage() + 1);
                            } else if (entry
                                    .getKey()
                                    .equals("pageCount")) {
                                params.set("page_count", entry.getValue());
                            } else if (entry
                                    .getKey()
                                    .equals("menuCode")) {
                                if (searchDTO.getMenuCode() != null) {
                                    params.set("menuNo", searchDTO
                                            .getMenuCode()
                                            .getMenuNo());
                                }
                            } else {
                                params.set(entry.getKey(), entry.getValue());
                            }
                        }
                    });

            ResponseEntity<String> responseEntity = restTemplateHelper.post(archiveAddress + photoListApi, params, getHeader("ilbo"));

            result = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(responseEntity.getBody(), new TypeReference<CmsVO<CmsResultListVO<PhotoArchiveVO>>>() {
                    });
            CmsResultListVO<PhotoArchiveVO> data = result.getData();
            if (data != null) {
                page = new PageImpl<>(data.getResultList(), PageRequest.of(data.getPage(), data.getPageCount()), data.getTotalCount());
            }

        } catch (Exception ex) {
            log.error(ex.toString());
        }

        return page;
    }

    /**
     * ?????? ?????? ??????
     *
     * @param id ?????? ID
     * @return ?????? ??????
     */
    @Override
    public Optional<PhotoArchiveDetailVO> findPhotoArchiveById(String id, String memberId) {
        PhotoArchiveDetailVO result = null;
        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        params.set("nid", id);
        ResponseEntity<String> responseEntity = restTemplateHelper.post(archiveAddress + photoDetailApi, params, getHeader(memberId));
        try {
            CmsVO<CmsRetrieveVO<PhotoArchiveDetailVO>> resultCmsVo = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(responseEntity.getBody(), new TypeReference<CmsVO<CmsRetrieveVO<PhotoArchiveDetailVO>>>() {
                    });

            result = resultCmsVo
                    .getData()
                    .getRetrieve();
        } catch (Exception ex) {
            log.error(ex.toString());
        }
        return Optional.ofNullable(result);
    }


    /**
     * ?????? ???????????? ?????? ??????
     *
     * @param menuNo ?????? ??????
     * @return ?????? ??????
     */
    @Override
    public List<OriginCodeVO> findAllPhotoOrigin(String menuNo, String memberId, String siteCd) {
        CmsVO<CmsDataVO<List<OriginCodeVO>>> result = new CmsVO<>();
        try {
            MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
            params.set("menuNo", menuNo);
            params.set("siteCd", siteCd);
            ResponseEntity<String> responseEntity = restTemplateHelper.post(archiveAddress + originCodeListApi, params, getHeader(memberId));

            result = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(responseEntity.getBody(), new TypeReference<CmsVO<CmsDataVO<List<OriginCodeVO>>>>() {
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
        CmsVO<CmsDataVO<List<PhotoTypeVO>>> result = new CmsVO<>();
        try {
            MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
            params.set("type", IMAGE);
            ResponseEntity<String> responseEntity = restTemplateHelper.post(archiveAddress + photoTypeListApi, params, getHeader(memberId));

            result = ResourceMapper
                    .getDefaultObjectMapper()
                    .readValue(responseEntity.getBody(), new TypeReference<CmsVO<CmsDataVO<List<PhotoTypeVO>>>>() {
                    });

        } catch (Exception ex) {
            log.error(ex.toString());
        }

        return result.getData() != null ? result
                .getData()
                .getData() : null;
    }


    /**
     * Request Header ??????
     *
     * @param memberId ?????????ID
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
