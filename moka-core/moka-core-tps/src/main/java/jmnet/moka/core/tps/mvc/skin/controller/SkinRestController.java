package jmnet.moka.core.tps.mvc.skin.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.tps.common.dto.InvalidDataDTO;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.skin.dto.SkinDTO;
import jmnet.moka.core.tps.mvc.skin.dto.SkinSearchDTO;
import jmnet.moka.core.tps.mvc.skin.entity.Skin;
import jmnet.moka.core.tps.mvc.skin.service.SkinService;

@RestController
@Validated
@RequestMapping("/api/skins")
public class SkinRestController {

    // private static final Logger logger = LoggerFactory.getLogger(SkinRestController.class);

    @Autowired
    private SkinService skinService;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private ModelMapper modelMapper;

    /**
     * 본문스킨목록조회
     * 
     * @param request 요청
     * @param search 검색조건
     * @return 스킨 목록
     * @throws NoDataException 등록된 스킨 없음
     */
    @GetMapping
    public ResponseEntity<?> getSkinList(HttpServletRequest request,
            @Valid @SearchParam SkinSearchDTO search) throws NoDataException {

        // 페이징조건 설정
        Pageable pageable = search.getPageable();

        // 조회
        Page<Skin> returnValue = skinService.findList(search, pageable);

        // 리턴값 설정
        ResultListDTO<SkinDTO> resultListMessage = new ResultListDTO<SkinDTO>();
        List<SkinDTO> dtoList = modelMapper.map(returnValue.getContent(), SkinDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<SkinDTO>> resultDto =
                new ResultDTO<ResultListDTO<SkinDTO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 본문스킨정보 조회
     * 
     * @param request 요청
     * @param containerSeq 스킨아이디 (필수)
     * @return 페이지정보
     * @throws NoDataException 스킨 정보가 없음
     * @throws InvalidDataException 스킨 아이디 형식오류
     * @throws Exception 기타예외
     */
    @GetMapping("/{skinSeq}")
    public ResponseEntity<?> getSkin(HttpServletRequest request,
            @PathVariable("skinSeq") @Min(value = 0,
                    message = "{tps.skin.error.invalid.skinSeq}") Long skinSeq)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(request, skinSeq, null);

        String message = messageByLocale.get("tps.skin.error.noContent", request);
        Skin skin =
                skinService.findBySkinSeq(skinSeq).orElseThrow(() -> new NoDataException(message));

        SkinDTO dto = modelMapper.map(skin, SkinDTO.class);
        ResultDTO<SkinDTO> resultDto = new ResultDTO<SkinDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 본문스킨정보 유효성 검사
     * 
     * @param request 요청
     * @param containerSeq 스킨 순번. 0이면 등록일때 유효성 검사
     * @param containerDTO 스킨정보
     * @return 유효하지 않은 필드목록
     * @throws InvalidDataException 데이타유효성 예외
     * @throws Exception 기타예외
     */
    private void validData(HttpServletRequest request, Long skinSeq, SkinDTO skinDTO)
            throws InvalidDataException, Exception {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (skinDTO != null) {
            // url id와 json의 id가 동일한지 검사
            if (skinSeq > 0 && !skinSeq.equals(skinDTO.getSkinSeq())) {
                String message = messageByLocale.get("tps.common.error.no-data", request);
                invalidList.add(new InvalidDataDTO("matchId", message));
            }

            // serviceType 중복검사
            List<Skin> skinList = skinService.findByServiceName(skinDTO.getSkinServiceName(),
                    skinDTO.getDomain().getDomainId());
            if (skinList.size() > 0) {
                for (Skin skin : skinList) {
                    if (!skin.getSkinSeq().equals(skinDTO.getSkinSeq())) {
                        String message = messageByLocale
                                .get("tps.skin.error.invalid.skinServiceName", request);
                        invalidList.add(new InvalidDataDTO("skinServiceName", message));
                    }
                }
            }

            // 문법검사
            try {
                TemplateParserHelper.checkSyntax(skinDTO.getSkinBody());
            } catch (TemplateParseException e) {
                String message = e.getMessage();
                String extra = Integer.toString(e.getLineNumber());
                invalidList.add(new InvalidDataDTO("skinBody", message, extra));
            } catch (Exception e) {
                throw e;
            }

        }
        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.skin.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 본문스킨등록
     * 
     * @param request 요청
     * @param skinDTO 등록할 본문스킨정보
     * @param principal 로그인 사용자 세션
     * @return 등록된 본문스킨정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception 기타예외
     */
    @PostMapping(headers = {"content-type=application/json"},
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postSkin(HttpServletRequest request,
            @RequestBody @Valid SkinDTO skinDTO, Principal principal)
            throws InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(request, (long) 0, skinDTO);

        // 등록
        Skin skin = modelMapper.map(skinDTO, Skin.class);
        skin.setCreateYmdt(McpDate.nowStr());
        skin.setCreator(principal.getName());
        Skin returnValue = skinService.insertSkin(skin);

        // 결과리턴
        SkinDTO dto = modelMapper.map(returnValue, SkinDTO.class);

        ResultDTO<SkinDTO> resultDto = new ResultDTO<SkinDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }

}
