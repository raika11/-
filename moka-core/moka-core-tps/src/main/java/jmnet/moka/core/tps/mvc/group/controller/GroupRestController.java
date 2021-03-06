package jmnet.moka.core.tps.mvc.group.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
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
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.code.MenuAuthTypeCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.mvc.group.dto.GroupDTO;
import jmnet.moka.core.tps.mvc.group.dto.GroupSearchDTO;
import jmnet.moka.core.tps.mvc.group.dto.GroupUpdateDTO;
import jmnet.moka.core.tps.mvc.group.entity.GroupInfo;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import jmnet.moka.core.tps.mvc.group.service.GroupService;
import jmnet.moka.core.tps.mvc.member.dto.MemberDTO;
import jmnet.moka.core.tps.mvc.member.dto.MemberSearchDTO;
import jmnet.moka.core.tps.mvc.member.dto.MemberSimpleDTO;
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
@Api(tags = {"?????? API"})
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
     * ??????????????????
     *
     * @param search ????????????
     * @return ????????????
     */
    @ApiOperation(value = "?????? ?????? ??????")
    @GetMapping
    public ResponseEntity<?> getGroupList(@SearchParam GroupSearchDTO search) {

        ResultListDTO<GroupDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        Page<GroupInfo> returnValue = groupService.findAllGroup(search);

        // ????????? ??????
        List<GroupDTO> memberDtoList = modelMapper.map(returnValue.getContent(), GroupDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(memberDtoList);


        ResultDTO<ResultListDTO<GroupDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ??????
     *
     * @param request ??????
     * @param groupCd ??????????????? (??????)
     * @return ????????????
     * @throws NoDataException ?????? ????????? ??????
     */
    @ApiOperation(value = "?????? ??????")
    @GetMapping("/{groupCd}")
    public ResponseEntity<?> getGroup(HttpServletRequest request,
            @ApiParam("????????????") @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd)
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
     * ?????? ?????? ????????? ??????
     *
     * @param groupCd ???????????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ????????? ?????? ??????")
    @GetMapping("/{groupCd}/exists")
    public ResponseEntity<?> duplicateCheckId(
            @ApiParam("????????????") @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd) {

        boolean duplicated = groupService.isDuplicatedId(groupCd);
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ??????
     *
     * @param request  ??????
     * @param groupDTO ????????? ????????????
     * @return ????????? ????????????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "?????? ??????")
    @PostMapping
    public ResponseEntity<?> postGroup(HttpServletRequest request, @Valid GroupDTO groupDTO)
            throws InvalidDataException, Exception {

        // GroupDTO -> Group ??????
        GroupInfo group = modelMapper.map(groupDTO, GroupInfo.class);
        if (McpString.isNotEmpty(group.getGroupCd())) { // ?????? ????????? ?????? ?????? ?????? ??????
            if (groupService.isDuplicatedId(group.getGroupCd())) {
                throw new InvalidDataException(msg("tps.group.error.duplicated.groupCd", request));
            }
        }

        try {
            // insert
            GroupInfo returnValue = groupService.insertGroup(group);


            // ????????????
            GroupDTO dto = modelMapper.map(returnValue, GroupDTO.class);
            MemberInfo memberInfo = memberService
                    .findMemberById(returnValue.getRegId())
                    .get();
            if (memberInfo != null) {
                dto.setRegMember(modelMapper.map(memberInfo, MemberSimpleDTO.class));
            }

            ResultDTO<GroupDTO> resultDto = new ResultDTO<>(dto, msg("tps.group.success.insert"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT GROUP]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.group.error.save", request), e);
        }
    }

    /**
     * ??????
     *
     * @param request  ??????
     * @param groupCd  ???????????????
     * @param groupDTO ????????? ????????????
     * @return ????????? ????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "?????? ??????")
    @PutMapping("/{groupCd}")
    public ResponseEntity<?> putGroup(HttpServletRequest request,
            @ApiParam("????????????") @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd,
            @Valid GroupUpdateDTO groupDTO)
            throws Exception {

        // GroupDTO -> Group ??????
        String infoMessage = msg("tps.group.error.no-data", request);
        GroupInfo newGroup = modelMapper.map(groupDTO, GroupInfo.class);
        newGroup.setGroupCd(groupCd);

        // ????????? ????????? ??????
        GroupInfo currentGroup = groupService
                .findGroupById(newGroup.getGroupCd())
                .orElseThrow(() -> new NoDataException(infoMessage));



        try {
            newGroup.setRegDt(currentGroup.getRegDt());
            newGroup.setRegId(currentGroup.getRegId());
            newGroup.setRegMember(currentGroup.getRegMember());
            // update
            GroupInfo returnValue = groupService.updateGroup(newGroup);

            // ????????????
            GroupDTO dto = modelMapper.map(returnValue, GroupDTO.class);

            ResultDTO<GroupDTO> resultDto = new ResultDTO<>(dto, msg("tps.group.success.update"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE GROUP]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.group.error.save", request), e);
        }
    }

    /**
     * ?????? ??? ?????? ?????? ?????? ??????
     *
     * @param groupCd ??????ID
     * @return ??????????????? ?????? ??????
     */
    @ApiOperation(value = "?????? ??? ?????? ?????? ?????? ??????")
    @GetMapping("/{groupCd}/has-members")
    public ResponseEntity<?> hasMembers(
            @ApiParam("????????????") @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd) {

        boolean exists = groupService.hasMembers(groupCd);
        String message = exists ? msg("tps.group.success.select.exist-member") : "";

        // ????????????
        ResultDTO<Boolean> resultDto = new ResultDTO<>(exists, message);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ??????
     *
     * @param request ??????
     * @param groupCd ?????? ??? ??????????????? (??????)
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? ?????? ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "?????? ??????")
    @DeleteMapping("/{groupCd}")
    public ResponseEntity<?> deleteGroup(HttpServletRequest request,
            @ApiParam("????????????") @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd)
            throws InvalidDataException, NoDataException, Exception {


        // ?????? ????????? ??????
        String noContentMessage = msg("tps.group.error.no-data", request);
        GroupInfo groupInfo = groupService
                .findGroupById(groupCd)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        // ?????? ????????? ??????
        if (groupService.hasMembers(groupCd)) {
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.fail(ActionType.DELETE, msg("tps.group.error.delete.exist-member", request));
            throw new InvalidDataException(msg("tps.group.error.delete.exist-member", request));
        }

        try {
            // ??????
            groupService.deleteGroup(groupInfo);

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.DELETE);

            // ????????????
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.group.success.delete"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE GROUP] groupCd: {} {}", groupCd, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.group.error.delete", request), e);
        }
    }

    /**
     * ?????? ????????? ?????? ?????? ??????
     *
     * @param request   ??????
     * @param menuAuths ??????????????????
     * @return ????????? ????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "?????? ????????? ?????? ?????? ??????")
    @PutMapping("/{groupCd}/menu-auths")
    public ResponseEntity<?> putGroupMenuAuth(HttpServletRequest request,
            @ApiParam("????????????") @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd,
            @RequestBody List<@Valid MenuAuthSimpleDTO> menuAuths)
            throws Exception {

        try {
            menuService.saveMenuAuth(groupCd, MenuAuthTypeCode.GROUP, menuAuths
                    .stream()
                    .map(menuAuthSimpleDTO -> modelMapper.map(menuAuthSimpleDTO, MenuAuth.class))
                    .collect(Collectors.toList()));

            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.group.success.update.menu-auth"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MENU AUTH]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e);
            throw new Exception(msg("tps.menu.auth.error.save", request), e);
        }
    }

    /**
     * ?????? ??? Member ????????????
     *
     * @param search ????????????
     * @return Member??????
     */
    @ApiOperation(value = "?????? ??? Member ?????? ??????")
    @GetMapping("/{groupCd}/members")
    public ResponseEntity<?> getGroupMemberList(
            @ApiParam("????????????") @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd,
            @SearchParam SearchDTO search) {

        ResultListDTO<MemberDTO> resultListMessage = new ResultListDTO<>();

        search.setExtraParamMap(null);
        MemberSearchDTO memberSearchDTO = modelMapper.map(search, MemberSearchDTO.class);
        memberSearchDTO.setGroupCd(groupCd);

        // ??????
        Page<MemberInfo> returnValue = memberService.findAllMember(memberSearchDTO);

        // ????????? ??????
        List<MemberDTO> memberDtoList = modelMapper.map(returnValue.getContent(), MemberDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(memberDtoList);


        ResultDTO<ResultListDTO<MemberDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    @ApiOperation(value = "?????? ????????? ??????/??????")
    @PutMapping("/{groupCd}/members")
    public ResponseEntity<?> postGroupMember(HttpServletRequest request,
            @ApiParam("????????????") @PathVariable("groupCd") @Size(min = 1, max = 3, message = "{tps.group.error.pattern.groupCd}") String groupCd,
            @ApiParam("?????????ID") @RequestParam("memberIds") List<String> memberIds,
            @ApiParam("????????????") @RequestParam(value = "useYn", defaultValue = MokaConstants.YES) String useYn)
            throws Exception {

        try {
            if (memberIds == null) {
                throw new MokaException(msg("tps.group.error.notnull.memberIds", request));
            }

            final List<String> errorMemberIds = new ArrayList<>();


            memberIds.forEach(memberId -> memberService
                    .findMemberById(memberId, true)
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
                            // ?????????
                            if (McpString.isNo(useYn)) {
                                memberService.deleteGroupMember(groupMember);
                            } else { // ?????? ?????? ?????? ?????? ????????? ?????? - ?????? ????????? ??????

                            }
                        }, () -> {
                            if (McpString.isYes(useYn)) {// ?????? ??????
                                if (memberInfo.getGroupMembers() != null && memberInfo
                                        .getGroupMembers()
                                        .size() > 0) { // ?????? ?????? ????????? ??????????????? ?????? ??????
                                    errorMemberIds.add(memberId);
                                } else { // ????????? ?????? ??????
                                    memberService.insertGroupMember(GroupMember.builder()
                                                                               //.usedYn(MokaConstants.YES)
                                                                               .groupCd(groupCd)
                                                                               .memberId(memberId)
                                                                               .build());
                                }
                            } else { // ?????? ????????? ????????? ????????? ???????????? ??????????????? ????????? ?????? - ?????? ????????? ??????

                            }
                        });
                    }, () -> errorMemberIds.add(memberId)));

            StringBuilder sbMsg = new StringBuilder();
            boolean success = false;
            if (memberIds.size() > (errorMemberIds.size())) {
                success = true;
                if (McpString.isYes(useYn)) {
                    sbMsg.append(msg("tps.group.success.member-save"));
                } else {
                    sbMsg.append(msg("tps.group.success.member-delete"));
                }
            }
            if (errorMemberIds.size() > 0) {
                String errorMemberIdStr = McpString.arrayToCommaDelimitedString(errorMemberIds.toArray());
                sbMsg
                        .append(sbMsg.length() > 0 ? "\n" : "")
                        .append(msg("tps.group.error.exist-group-member", errorMemberIdStr));
            }

            ResultDTO<Boolean> resultDto = new ResultDTO<>(success, sbMsg.toString());

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO ADD GROUP MEMBER]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e);
            throw new Exception(msg("tps.group.error.member-save", request), e);
        }
    }

}
