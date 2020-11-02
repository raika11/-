package jmnet.moka.core.tps.mvc.member.controller;

import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.member.dto.MemberDTO;
import jmnet.moka.core.tps.mvc.member.dto.MemberSearchDTO;
import jmnet.moka.core.tps.mvc.member.entity.Member;
import jmnet.moka.core.tps.mvc.member.service.MemberService;
import jmnet.moka.core.tps.mvc.menu.dto.MenuNode;
import jmnet.moka.core.tps.mvc.menu.dto.MenuSearchDTO;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@Slf4j
@RequestMapping("/api/members")
public class MemberRestController {

    private final MenuService menuService;

    private final MemberService memberService;

    private final ModelMapper modelMapper;

    private final MessageByLocale messageByLocale;

    private final TpsLogger tpsLogger;


    public MemberRestController(MemberService memberService, MenuService menuService, ModelMapper modelMapper, MessageByLocale messageByLocale,
            TpsLogger tpsLogger) {
        this.memberService = memberService;
        this.menuService = menuService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
    }

    /**
     * Member목록조회
     *
     * @param search 검색조건
     * @return Member목록
     */
    @ApiOperation(value = "Member 목록 조회")
    @GetMapping
    public ResponseEntity<?> getMemberList(@SearchParam MemberSearchDTO search) {

        ResultListDTO<MemberDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<Member> returnValue = memberService.findAllMember(search);

        // 리턴값 설정
        List<MemberDTO> memberDtoList = modelMapper.map(returnValue.getContent(), MemberDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(memberDtoList);


        ResultDTO<ResultListDTO<MemberDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * Member정보 조회
     *
     * @param request  요청
     * @param memberId Member아이디 (필수)
     * @return Member정보
     * @throws NoDataException Member 정보가 없음
     */
    @ApiOperation(value = "Member 조회")
    @GetMapping("/{memberId}")
    public ResponseEntity<?> getMember(HttpServletRequest request,
            @PathVariable("memberId") @Size(min = 1, max = 3, message = "{tps.member.error.pattern.memberId}") String memberId)
            throws NoDataException {

        String message = messageByLocale.get("tps.member.error.no-data", request);
        Member member = memberService
                .findMemberById(memberId)
                .orElseThrow(() -> new NoDataException(message));

        MemberDTO dto = modelMapper.map(member, MemberDTO.class);


        tpsLogger.success(ActionType.SELECT);

        ResultDTO<MemberDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * Member 중복 아이디 체크
     *
     * @param memberId Member아이디
     * @return 중복 여부
     */
    @ApiOperation(value = "동일 아이디 존재 여부")
    @GetMapping("/{memberId}/exists")
    public ResponseEntity<?> duplicateCheckId(
            @PathVariable("memberId") @Size(min = 1, max = 3, message = "{tps.member.error.pattern.memberId}") String memberId) {

        boolean duplicated = memberService.isDuplicatedId(memberId);
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 등록
     *
     * @param request  요청
     * @param groupDTO 등록할 Member정보
     * @return 등록된 Member정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "Member 등록")
    @PostMapping
    public ResponseEntity<?> postMember(HttpServletRequest request, @Valid MemberDTO groupDTO)
            throws InvalidDataException, Exception {

        // MemberDTO -> Member 변환
        Member member = modelMapper.map(groupDTO, Member.class);
        if (McpString.isNotEmpty(member.getMemberId())) { // 자동 발번이 아닌 경우 중복 체크
            if (memberService.isDuplicatedId(member.getMemberId())) {
                throw new InvalidDataException(messageByLocale.get("tps.member.error.duplicated.memberId", request));
            }
        }

        try {
            // insert
            Member returnValue = memberService.insertMember(member);


            // 결과리턴
            MemberDTO dto = modelMapper.map(returnValue, MemberDTO.class);
            ResultDTO<MemberDTO> resultDto = new ResultDTO<>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT GROUP]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(messageByLocale.get("tps.member.error.save", request), e);
        }
    }

    /**
     * 수정
     *
     * @param request  요청
     * @param memberId Member아이디
     * @param groupDTO 수정할 Member정보
     * @return 수정된 Member정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "Member 수정")
    @PutMapping("/{memberId}")
    public ResponseEntity<?> putMember(HttpServletRequest request,
            @PathVariable("memberId") @Size(min = 1, max = 3, message = "{tps.member.error.pattern.memberId}") String memberId,
            @Valid MemberDTO groupDTO)
            throws Exception {

        // MemberDTO -> Member 변환
        String infoMessage = messageByLocale.get("tps.member.error.no-data", request);
        Member newMember = modelMapper.map(groupDTO, Member.class);

        // 오리진 데이터 조회
        memberService
                .findMemberById(newMember.getMemberId())
                .orElseThrow(() -> new NoDataException(infoMessage));



        try {
            // update
            Member returnValue = memberService.updateMember(newMember);

            // 결과리턴
            MemberDTO dto = modelMapper.map(returnValue, MemberDTO.class);
            ResultDTO<MemberDTO> resultDto = new ResultDTO<>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE GROUP]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(messageByLocale.get("tps.member.error.save", request), e);
        }
    }

    /**
     * Member 잠금 해제
     *
     * @param memberId MemberID
     * @param smsAuth  문자 인증 번호
     * @return 관련아이템 존재 여부
     * @throws NoDataException 데이터없음 예외처리
     */
    @ApiOperation(value = "Member 잠금 해제")
    @GetMapping("/{memberId}/unlock")
    public ResponseEntity<?> unlock(
            @PathVariable("memberId") @Size(min = 1, max = 50, message = "{tps.member.error.pattern.memberId}") String memberId,
            @RequestParam("smsAuth") @Size(min = 4, max = 6, message = "{tps.member.error.pattern.smsAuth}") String smsAuth)
            throws NoDataException {

        String noDataMsg = messageByLocale.get("tps.member.error.no-data");

        Member member = memberService
                .findMemberById(memberId)
                .orElseThrow(() -> new NoDataException(noDataMsg));
        if (member
                .getSmsAuth()
                .equals(smsAuth)) {
            member.setErrCnt(0);
            memberService.updateMember(member);
        }

        MemberDTO memberDTO = modelMapper.map(member, MemberDTO.class);

        // 결과리턴
        ResultDTO<MemberDTO> resultDto = new ResultDTO<>(memberDTO);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 삭제
     *
     * @param request  요청
     * @param memberId 삭제 할 Member아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 Member 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "Member 삭제")
    @DeleteMapping("/{memberId}")
    public ResponseEntity<?> deleteMember(HttpServletRequest request,
            @PathVariable("memberId") @Size(min = 1, max = 3, message = "{tps.member.error.pattern.memberId}") String memberId)
            throws InvalidDataException, NoDataException, Exception {


        // Member 데이터 조회
        String noContentMessage = messageByLocale.get("tps.member.error.no-data", request);
        Member member = memberService
                .findMemberById(memberId)
                .orElseThrow(() -> new NoDataException(noContentMessage));



        try {
            // 삭제
            memberService.deleteMember(member);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE GROUP] memberId: {} {}", memberId, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(messageByLocale.get("tps.member.error.delete", request), e);
        }
    }

    /**
     * Member 메뉴 트리 조회
     *
     * @return 메뉴목록
     */
    @ApiOperation(value = "Member 메뉴 트리 조회")
    @GetMapping("/menus")
    public ResponseEntity<?> getUserMenuTree(@NotNull Principal principal) {
        // 조회
        MenuSearchDTO searchDTO = MenuSearchDTO
                .builder()
                .memberId(principal.getName())
                .build();
        MenuNode menuNode = menuService.findServiceMenuTree(searchDTO);

        // 리턴값 설정
        ResultDTO<MenuNode> resultDto = new ResultDTO<>(menuNode);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



}
