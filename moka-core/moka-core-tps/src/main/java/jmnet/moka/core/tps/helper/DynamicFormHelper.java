package jmnet.moka.core.tps.helper;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.tps.common.code.EditFieldTypeCode;
import jmnet.moka.core.tps.common.dto.edit.DynamicFormDTO;
import jmnet.moka.core.tps.common.dto.edit.FieldDTO;
import jmnet.moka.core.tps.common.dto.edit.FieldGroupDTO;
import jmnet.moka.core.tps.common.dto.edit.OptionDTO;
import jmnet.moka.core.tps.common.dto.edit.PartDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

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
public class DynamicFormHelper {

    private final Map<String, DynamicFormDTO> dynamicFormMap;

    private final XmlMapper xmlMapper;

    @Value("${tps.dynamic.edit.form.xml.file.path}")
    private String xmlFilePath;

    public DynamicFormHelper(XmlMapper xmlMapper) {
        this.xmlMapper = xmlMapper;
        dynamicFormMap = new HashMap<>();
    }

    /**
     * 파일을 읽어, ChannelFormatDTO로 변환한다.
     *
     * @param site        사이트
     * @param channelName 채널명
     * @return ChannelFormatDTO
     * @throws MokaException 오류 처리
     */
    public DynamicFormDTO mapping(String site, String channelName)
            throws MokaException {
        String formatKey = site + "_" + channelName;
        File file = McpFile.getFile(String.format(xmlFilePath, site, channelName));
        if (!file.exists()) {
            throw new MokaException(new FileNotFoundException(file.getAbsolutePath()));
        }
        DynamicFormDTO dynamicFormDTO = dynamicFormMap.get(formatKey);
        if (dynamicFormDTO == null || !dynamicFormDTO
                .getLastModified()
                .equals(file.lastModified())) {
            synchronized (DynamicFormHelper.class) {
                try {
                    dynamicFormDTO = xmlMapper.readValue(file, DynamicFormDTO.class);
                    refineFieldGroup(dynamicFormDTO);
                } catch (IOException e) {
                    throw new MokaException(e.getMessage());
                }
                dynamicFormMap.put(formatKey, dynamicFormDTO);
            }
        }

        return dynamicFormMap.get(formatKey);
    }

    /**
     * field 목록의 그룹별로 묶는다.
     *
     * @param dynamicFormDTO ChannelFormatDTO
     * @throws MokaException
     */
    public void refineFieldGroup(DynamicFormDTO dynamicFormDTO)
            throws MokaException {

        dynamicFormDTO
                .getParts()
                .forEach(partDTO -> {
                    SortedMap<Integer, List<FieldDTO>> groupMap = new TreeMap<>();
                    partDTO.setFieldGroups(new ArrayList<>());
                    Integer currentGroupNumber = 1;
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
                    partDTO.setFields(null);
                    for (Entry<Integer, List<FieldDTO>> entry : groupMap.entrySet()) {
                        Integer group = entry.getKey();
                        List<FieldDTO> fieldDTOS = entry.getValue();
                        fieldDTOS.sort((o1, o2) -> {
                            if (!o1
                                    .getType()
                                    .equals(o2.getType())) {
                                return 1;
                            } else {
                                return o1.getSequence() - o2.getSequence();
                            }

                        });
                        FieldGroupDTO fieldGroupDTO = FieldGroupDTO
                                .builder()
                                .fields(fieldDTOS)
                                .group(group)
                                .build();
                        partDTO
                                .getFieldGroups()
                                .add(fieldGroupDTO);
                    }

                });

    }

    /**
     * widget 타입이 SELECT일때 value 문자열을 option 목록으로 차환
     *
     * @param fieldDTO FieldDTO
     */
    public void refineOptions(FieldDTO fieldDTO) {

        EditFieldTypeCode fieldType = EditFieldTypeCode.getType(fieldDTO.getType());
        if (fieldType == EditFieldTypeCode.SELECT) {
            String[] values = fieldDTO
                    .getValue()
                    .split("\\^");
            Set<OptionDTO> options = Arrays
                    .stream(values)
                    .map(OptionDTO::new)
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
     * @throws MokaException
     */
    public PartDTO getPart(String site, String channelName, String partId)
            throws MokaException {
        DynamicFormDTO dynamicFormDTO = getChannelFormat(site, channelName);
        return dynamicFormDTO
                .getParts()
                .stream()
                .filter(part -> part
                        .getId()
                        .equals(partId))
                .findFirst()
                .orElseThrow(() -> new MokaException(DynamicFormHelper.class.getName()));

    }

    /**
     * channel정보를 불러온다.
     *
     * @param channelName 채널명
     * @return ChannelFormatDTO
     */
    public DynamicFormDTO getChannelFormat(String site, String channelName)
            throws MokaException {
        return mapping(site, channelName);
    }
}
