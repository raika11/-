package jmnet.moka.core.tps.helper;

import com.fasterxml.jackson.databind.type.TypeFactory;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.code.EditFieldTypeCode;
import jmnet.moka.core.tps.common.dto.edit.ChannelFormatDTO;
import jmnet.moka.core.tps.common.dto.edit.FieldDTO;
import jmnet.moka.core.tps.common.dto.edit.FieldGroupDTO;
import jmnet.moka.core.tps.common.dto.edit.OptionDTO;
import jmnet.moka.core.tps.common.dto.edit.PartDTO;
import jmnet.moka.core.tps.exception.NoDataException;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 * xml을 불러와 Edit Form 객체로 전환한다.
 * Project : moka
 * Package : jmnet.moka.core.tps.helper
 * ClassName : EditFormHelper
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 09:16
 */
@Slf4j
public class EditFormHelper {

    private static Map<String, ChannelFormatDTO> chnnelFormatMap = new HashMap<>();

    /**
     * 파일을 읽어, ChannelFormatDTO로 변환한다.
     *
     * @param filePath 파일 경우
     * @return ChannelFormatDTO
     * @throws Exception
     */
    public static ChannelFormatDTO mapping(String filePath)
            throws Exception {
        XmlMapper xmlMapper = new XmlMapper();
        TypeFactory tf = xmlMapper.getTypeFactory();

        File file = McpFile.getFile(filePath);
        String fileName = file.getName();
        ChannelFormatDTO channelFormatDTO = chnnelFormatMap.get(fileName);
        if (channelFormatDTO == null || !channelFormatDTO
                .getLastModified()
                .equals(file.lastModified())) {
            channelFormatDTO = xmlMapper.readValue(file, ChannelFormatDTO.class);
            refineFieldGroup(channelFormatDTO);

            chnnelFormatMap.put(fileName, channelFormatDTO);
        }

        return chnnelFormatMap.get(fileName);
    }

    /**
     * field 목록의 그룹별로 묶는다.
     *
     * @param channelFormatDTO ChannelFormatDTO
     * @throws Exception
     */
    public static void refineFieldGroup(ChannelFormatDTO channelFormatDTO)
            throws Exception {

        channelFormatDTO
                .getParts()
                .forEach(partDTO -> {
                    Map<String, List<FieldDTO>> groupMap = new HashMap<>();
                    partDTO.setFieldGroups(new ArrayList<>());
                    String currentGroupNumber = "1";
                    for (FieldDTO fieldDTO : partDTO.getFields()) {
                        refineOptions(fieldDTO);
                        if (McpString.isEmpty(fieldDTO.getGroup())) {
                            fieldDTO.setGroup(currentGroupNumber);
                        }
                        currentGroupNumber = fieldDTO.getGroup();
                        List<FieldDTO> groupInnerFields = groupMap.getOrDefault(currentGroupNumber, new ArrayList<>());
                        groupInnerFields.add(fieldDTO);
                        groupMap.put(currentGroupNumber, groupInnerFields);
                    }
                    groupMap.forEach((group, fieldDTOS) -> {
                        fieldDTOS.sort((o1, o2) -> {
                            return o1.getSequence() - o2.getSequence();
                        });
                        FieldGroupDTO fieldGroupDTO = FieldGroupDTO
                                .builder()
                                .fields(fieldDTOS)
                                .group(group)
                                .build();
                        partDTO
                                .getFieldGroups()
                                .add(fieldGroupDTO);
                    });

                });

    }

    /**
     * widget 타입이 SELECT일때 value 문자열을 option 목록으로 차환
     *
     * @param fieldDTO FieldDTO
     */
    public static void refineOptions(FieldDTO fieldDTO) {

        EditFieldTypeCode fieldType = EditFieldTypeCode.getType(fieldDTO.getType());
        if (fieldType == EditFieldTypeCode.SELECT) {
            String[] values = fieldDTO
                    .getValue()
                    .split("\\^");
            Set<OptionDTO> options = Arrays
                    .stream(values)
                    .map(s -> new OptionDTO(s))
                    .collect(Collectors.toSet());
            fieldDTO.setOptions(options);
        }

    }

    /**
     * channel별 영역 정보를 불러온다.
     *
     * @param channelName 채널명
     * @param partId      파트 ID
     * @return PartDTO
     * @throws Exception
     */
    public static PartDTO getPart(String channelName, String partId)
            throws Exception {
        ChannelFormatDTO channelFormatDTO = chnnelFormatMap.get(channelName);
        return channelFormatDTO
                .getParts()
                .stream()
                .filter(part -> part
                        .getId()
                        .equals(partId))
                .findFirst()
                .orElseThrow(() -> new NoDataException(EditFormHelper.class.getName()));

    }


}
