package jmnet.moka.core.tps.mvc.group.controller;

import io.swagger.annotations.ApiOperation;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.code.MenuAuthTypeCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.group.dto.GroupDTO;
import jmnet.moka.core.tps.mvc.group.dto.GroupSearchDTO;
import jmnet.moka.core.tps.mvc.group.entity.GroupInfo;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import jmnet.moka.core.tps.mvc.group.service.GroupService;
import jmnet.moka.core.tps.mvc.member.dto.MemberDTO;
import jmnet.moka.core.tps.mvc.member.dto.MemberSearchDTO;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import jmnet.moka.core.tps.mvc.member.service.MemberService;
import jmnet.moka.core.tps.mvc.menu.dto.MenuAuthSimpleDTO;
import jmnet.moka.core.tps.mvc.menu.entity.MenuAuth;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.controller
 * ClassName : GroupRestController
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 16:05
 */
@Slf4j
@RestController
@RequestMapping("/api/groups")
public class GroupRestController extends AbstractCommonController {

    private final GroupService groupService;

    private final MenuService menuService;

    private final MemberService memberService;

    public GroupRestController(GroupService groupService, ModelMapper modelMapper, MessageByLocale messageByLocale, MenuService menuService,
            TpsLogger tpsLogger, MemberService memberService) {
        this.groupService = groupService;
        this.memberService = memberService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.menuService = menuService;
        this.tpsLogger = tpsLogger;
    }

    /**
     * 그룹목록조회
     *
     * @param search 검색조건
     * @return 그룹목록
     */
    @ApiOperation(value = "그룹 목록 조회")
    @GetMapping
    public ResponseEntity<?> getGroupList(@SearchParam GroupSearchDTO search) {

        ResultListDTO<GroupDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<GroupInfo> returnValue = groupService.findAllGroup(search);

        // 리턴값 설정
        List<GroupDTO> memberDtoList = modelMapper.map(returnValue.getContent(), GroupDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(memberDtoList);


        ResultDTO<ResultListDTO<GroupDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 그룹정보 조회
     *
     * @param request 요청
     * @param groupCd 그룹아이디 (필수)
     * @return 그룹정보
     * @throws NoDataException 그룹 정보가 없음
     */
    @ApiOperation(value = "그룹 조회")
    @GetMapping("/{groupCd}")
    public ResponseEntity<?> getGroup(HttpServletRequest request,
            @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd)
            throws NoDataException {

        String message = msg("tps.group.error.no-data", request);
        GroupInfo group = groupService
                .findGroupById(groupCd)
                .orElseThrow(() -> new NoDataException(message));

        GroupDTO dto = modelMapper.map(group, GroupDTO.class);


        tpsLogger.success(ActionType.SELECT);

        ResultDTO<GroupDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 그룹 중복 아이디 체크
     *
     * @param groupCd 그룹아이디
     * @return 중복 여부
     */
    @ApiOperation(value = "동일 아이디 존재 여부")
    @GetMapping("/{groupCd}/exists")
    public ResponseEntity<?> duplicateCheckId(
            @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd) {

        boolean duplicated = groupService.isDuplicatedId(groupCd);
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 등록
     *
     * @param request  요청
     * @param groupDTO 등록할 그룹정보
     * @return 등록된 그룹정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "그룹 등록")
    @PostMapping
    public ResponseEntity<?> postGroup(HttpServletRequest request, @Valid GroupDTO groupDTO)
            throws InvalidDataException, Exception {

        // GroupDTO -> Group 변환
        GroupInfo group = modelMapper.map(groupDTO, GroupInfo.class);
        if (McpString.isNotEmpty(group.getGroupCd())) { // 자동 발번이 아닌 경우 중복 체크
            if (groupService.isDuplicatedId(group.getGroupCd())) {
                throw new InvalidDataException(msg("tps.group.error.duplicated.groupCd", request));
            }
        }

        try {
            // insert
            GroupInfo returnValue = groupService.insertGroup(group);


            // 결과리턴
            GroupDTO dto = modelMapper.map(returnValue, GroupDTO.class);
            ResultDTO<GroupDTO> resultDto = new ResultDTO<>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT GROUP]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.group.error.save", request), e);
        }
    }

    /**
     * 수정
     *
     * @param request  요청
     * @param groupCd  그룹아이디
     * @param groupDTO 수정할 그룹정보
     * @return 수정된 그룹정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "그룹 수정")
    @PutMapping("/{groupCd}")
    public ResponseEntity<?> putGroup(HttpServletRequest request,
            @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd, @Valid GroupDTO groupDTO)
            throws Exception {

        // GroupDTO -> Group 변환
        String infoMessage = msg("tps.group.error.no-data", request);
        GroupInfo newGroup = modelMapper.map(groupDTO, GroupInfo.class);

        // 오리진 데이터 조회
        groupService
                .findGroupById(newGroup.getGroupCd())
                .orElseThrow(() -> new NoDataException(infoMessage));



        try {
            // update
            GroupInfo returnValue = groupService.updateGroup(newGroup);

            // 결과리턴
            GroupDTO dto = modelMapper.map(returnValue, GroupDTO.class);
            ResultDTO<GroupDTO> resultDto = new ResultDTO<>(dto);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE GROUP]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.group.error.save", request), e);
        }
    }

    /**
     * 그룹 내 속한 멤버 존재 여부
     *
     * @param groupCd 그룹ID
     * @return 관련아이템 존재 여부
     */
    @ApiOperation(value = "그룹 내 속한 멤버 존재 여부")
    @GetMapping("/{groupCd}/has-members")
    public ResponseEntity<?> hasMembers(
            @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd) {

        boolean exists = groupService.hasMembers(groupCd);
        String message = exists ? msg("tps.group.success.select.exist-member") : "";

        // 결과리턴
        ResultDTO<Boolean> resultDto = new ResultDTO<>(exists, message);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 삭제
     *
     * @param request 요청
     * @param groupCd 삭제 할 그룹아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 그룹 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "그룹 삭제")
    @DeleteMapping("/{groupCd}")
    public ResponseEntity<?> deleteGroup(HttpServletRequest request,
            @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd)
            throws InvalidDataException, NoDataException, Exception {


        // 그룹 데이터 조회
        String noContentMessage = msg("tps.group.error.no-data", request);
        GroupInfo groupInfo = groupService
                .findGroupById(groupCd)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        // 관련 데이터 조회
        if (groupService.hasMembers(groupCd)) {
            // 액션 로그에 실패 로그 출력
            tpsLogger.fail(ActionType.DELETE, msg("tps.group.error.delete.exist-member", request));
            throw new InvalidDataException(msg("tps.group.error.delete.exist-member", request));
        }

        try {
            // 삭제
            groupService.deleteGroup(groupInfo);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE GROUP] groupCd: {} {}", groupCd, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.group.error.delete", request), e);
        }
    }

    /**
     * 여러 메뉴의 그룹 권한 수정
     *
     * @param request   요청
     * @param menuAuths 메뉴권한목록
     * @return 수정된 메뉴정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "여러 메뉴의 그룹 권한 수정")
    @PutMapping("/{groupCd}/menu-auths")
    public ResponseEntity<?> putGroupMenuAuth(HttpServletRequest request,
            @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd,
            @RequestBody List<@Valid MenuAuthSimpleDTO> menuAuths)
            throws Exception {

        try {
            menuService.saveMenuAuth(groupCd, MenuAuthTypeCode.GROUP, menuAuths
                    .stream()
                    .map(menuAuthSimpleDTO -> modelMapper.map(menuAuthSimpleDTO, MenuAuth.class))
                    .collect(Collectors.toList()));

            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.group.success.update.menu-auth"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MENU AUTH]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(msg("tps.menu.auth.error.save", request), e);
        }
    }

    /**
     * 그룹 내 Member 목록조회
     *
     * @param search 검색조건
     * @return Member목록
     */
    @ApiOperation(value = "그룹 내 Member 목록 조회")
    @GetMapping("/{groupCd}/members")
    public ResponseEntity<?> getGroupMemberList(
            @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd,
            @SearchParam SearchDTO search) {

        ResultListDTO<MemberDTO> resultListMessage = new ResultListDTO<>();

        search.setExtraParamMap(null);
        MemberSearchDTO memberSearchDTO = modelMapper.map(search, MemberSearchDTO.class);
        memberSearchDTO.setGroupCd(groupCd);

        // 조회
        Page<MemberInfo> returnValue = memberService.findAllMember(memberSearchDTO);

        // 리턴값 설정
        List<MemberDTO> memberDtoList = modelMapper.map(returnValue.getContent(), MemberDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(memberDtoList);


        ResultDTO<ResultListDTO<MemberDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @ApiOperation(value = "그룹 사용자 추가/제거")
    @PutMapping("/{groupCd}/members")
    public ResponseEntity<?> postGroupMember(HttpServletRequest request,
            @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd,
            @RequestParam("memberIds") List<String> memberIds, @RequestParam(value = "useYn", defaultValue = MokaConstants.YES) String useYn)
            throws Exception {

        try {
            if (memberIds == null) {
                throw new MokaException(msg("tps.group.error.notnull.memberIds", request));
            }

            final List<String> errorMemberIds = new ArrayList<>();
            final List<String> errorGroupMemberIds = new ArrayList<>();

            memberIds.forEach(memberId -> memberService
                    .findMemberById(memberId)
                    .ifPresentOrElse((memberInfo) -> {
                        Optional<GroupMember> found = Optional.empty();
                        for (GroupMember member : memberInfo.getGroupMembers()) {
                            if (member
                                    .getGroupCd()
                                    .equals(groupCd)) {
                                found = Optional.of(member);
                                break;
                            }
                        }
                        found.ifPresentOrElse((groupMember) -> {
                            // 그룹 사용자 사용여부를 Y로 하여 저장
                            groupMember.setUsedYn(useYn);
                            memberService.updateGroupMember(groupMember);
                        }, () -> {
                            if (McpString.isYes(useYn)) {// 신규 등록
                                memberService.insertGroupMember(GroupMember
                                        .builder()
                                        .usedYn(MokaConstants.YES)
                                        .groupCd(groupCd)
                                        .memberId(memberId)
                                        .build());
                            } else {
                                errorGroupMemberIds.add(memberId);
                            }

                        });
                    }, () -> errorMemberIds.add(memberId)));

            StringBuilder sbMsg = new StringBuilder();
            boolean success = false;
            if (memberIds.size() > (errorMemberIds.size() + errorGroupMemberIds.size())) {
                success = true;
                if (McpString.isYes(useYn)) {
                    sbMsg.append(msg("tps.group.success.member-save"));
                } else {
                    sbMsg.append(msg("tps.group.success.member-delete"));
                }
            }
            if ((errorMemberIds.size() + errorGroupMemberIds.size()) > 0) {
                if (errorMemberIds.size() > 0) {
                    String errorMemberIdStr = McpString.arrayToCommaDelimitedString(errorMemberIds.toArray());
                    sbMsg
                            .append(sbMsg.length() > 0 ? "\n" : "")
                            .append(msg("tps.group.error.member-not-exist", errorMemberIdStr));
                }
                if (errorGroupMemberIds.size() > 0) {
                    String errorMemberIdStr = McpString.arrayToCommaDelimitedString(errorGroupMemberIds.toArray());
                    sbMsg
                            .append(sbMsg.length() > 0 ? "\n" : "")
                            .append(msg("tps.group.error.not-group-member", errorMemberIdStr));
                }
            }

            ResultDTO<Boolean> resultDto = new ResultDTO<>(success, sbMsg.toString());

            // 액션 로그에 성공 로그 출력
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO ADD GROUP MEMBER]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(msg("tps.group.error.member-save", request), e);
        }
    }

}
