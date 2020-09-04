/**
 * msp-tps StyleRestController.java 2020. 4. 29. 오후 2:49:40 ssc
 */
package jmnet.moka.core.tps.mvc.style.controller;

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
import jmnet.moka.core.tps.mvc.style.dto.StyleDTO;
import jmnet.moka.core.tps.mvc.style.dto.StyleRefDTO;
import jmnet.moka.core.tps.mvc.style.dto.StyleSearchDTO;
import jmnet.moka.core.tps.mvc.style.dto.StyleSimpleDTO;
import jmnet.moka.core.tps.mvc.style.entity.Style;
import jmnet.moka.core.tps.mvc.style.service.StyleService;

/**
 * <pre>
 * 
 * 2020. 4. 29. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 29. 오후 2:49:40
 * @author ssc
 */
@RestController
@Validated
@RequestMapping("/api/styles")
public class StyleRestController {

    // private static final Logger logger = LoggerFactory.getLogger(StyleRestController.class);

    @Autowired
    private StyleService styleService;

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private ModelMapper modelMapper;

    /**
     * 스타일목록조회
     * 
     * @param request 요청
     * @param search 검색조건
     * @return 스타일 목록
     * @throws NoDataException 등록된 스타일 없음
     */
    @GetMapping
    public ResponseEntity<?> getStyleList(HttpServletRequest request,
            @Valid @SearchParam StyleSearchDTO search) throws NoDataException {

        // 페이징조건 설정
        Pageable pageable = search.getPageable();

        // 조회
        Page<Style> returnValue = styleService.findList(search, pageable);

        // 리턴값 설정
        ResultListDTO<StyleSimpleDTO> resultListMessage = new ResultListDTO<StyleSimpleDTO>();
        List<StyleSimpleDTO> dtoList =
                modelMapper.map(returnValue.getContent(), StyleSimpleDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(dtoList);

        ResultDTO<ResultListDTO<StyleSimpleDTO>> resultDto =
                new ResultDTO<ResultListDTO<StyleSimpleDTO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 스타일 정보 조회
     * 
     * @param request 요청
     * @param styleSeq 스타일아이디 (필수)
     * @return 페이지정보
     * @throws NoDataException 스타일 정보가 없음
     * @throws InvalidDataException 스타일 아이디 형식오류
     * @throws Exception 기타예외
     */
    @GetMapping("/{styleSeq}")
    public ResponseEntity<?> getSkin(HttpServletRequest request,
            @PathVariable("styleSeq") @Min(value = 0,
                    message = "{tps.style.error.invalid.styleSeq}") Long styleSeq)
            throws NoDataException, InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(request, styleSeq, null);

        String message = messageByLocale.get("tps.style.error.noContent", request);
        Style style = styleService.findByStyleSeq(styleSeq)
                .orElseThrow(() -> new NoDataException(message));

        StyleDTO dto = modelMapper.map(style, StyleDTO.class);
        ResultDTO<StyleDTO> resultDto = new ResultDTO<StyleDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 스타일정보 유효성 검사
     * 
     * @param request 요청
     * @param styleSeq 스타일 순번. 0이면 등록일때 유효성 검사
     * @param styleDTO 스타일정보
     * @return 유효하지 않은 필드목록
     * @throws Exception 기타예외
     * @throws InvalidDataException 데이타유효성예외
     */
    private void validData(HttpServletRequest request, Long styleSeq, StyleDTO styleDTO)
            throws Exception, InvalidDataException {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (styleDTO != null) {
            // 문법검사
            try {
                for (StyleRefDTO ref : styleDTO.getStyleRefs()) {
                    TemplateParserHelper.checkSyntax(ref.getStyleBody());
                }
            } catch (TemplateParseException e) {
                String message = e.getMessage();
                String extra = Integer.toString(e.getLineNumber());
                invalidList.add(new InvalidDataDTO("styleBody", message, extra));
            } catch (Exception e) {
                throw e;
            }
        }
        if (invalidList.size() > 0) {
            String validMessage = messageByLocale.get("tps.style.error.invalidContent", request);
            throw new InvalidDataException(invalidList, validMessage);
        }
    }

    /**
     * 스타일등록
     * 
     * @param request 요청
     * @param styleDTO 등록할 스타일정보
     * @param principal 로그인 사용자 세션
     * @return 등록된 스타일정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception 기타예외
     */
    @PostMapping(headers = {"content-type=application/json"},
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postStyle(HttpServletRequest request,
            @RequestBody @Valid StyleDTO styleDTO, Principal principal)
            throws InvalidDataException, Exception {

        // 데이타유효성검사.
        validData(request, (long) 0, styleDTO);

        // 등록
        Style style = modelMapper.map(styleDTO, Style.class);
        style.setCreateYmdt(McpDate.nowStr());
        style.setCreator(principal.getName());
        Style returnValue = styleService.insertStyle(style);

        // 결과리턴
        StyleDTO dto = modelMapper.map(returnValue, StyleDTO.class);

        ResultDTO<StyleDTO> resultDto = new ResultDTO<StyleDTO>(dto);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);

    }
}
