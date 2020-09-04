package jmnet.moka.core.common.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jmnet.moka.core.common.MspConstants;

/**
 * <pre>
 * Resource의 경로, JSON 읽기/쓰기 구현
 * 2019. 10. 14. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 10. 14. 오후 2:09:59
 * @author kspark
 */

public class ResourceMapper {

    public static boolean PRETTY_JSON = false;
    public static final TypeReference<List<Map<String, Object>>> TYPEREF_LIST_MAP =
            new TypeReference<List<Map<String, Object>>>() {
            };
    public static final TypeReference<Map<String, Object>> TYPEREF_MAP_OBJECT =
            new TypeReference<Map<String, Object>>() {
            };
    public static final TypeReference<Map<String, String>> TYPEREF_MAP_STRING =
            new TypeReference<Map<String, String>>() {
    };

    private static ResourcePatternResolver resourcePatternResolver =
            new PathMatchingResourcePatternResolver();


    public static ResourcePatternResolver getResouerceResolver() {
        return resourcePatternResolver;
    }

    public static ObjectMapper getDefaultObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        setMspDefaultConfiguration(objectMapper);
        return objectMapper;
    }

    public static void setMspDefaultConfiguration(ObjectMapper objectMapper) {
        SimpleDateFormat sdf = new SimpleDateFormat(MspConstants.JSON_DATE_FORMAT);
        objectMapper.setDateFormat(sdf);
        objectMapper.setTimeZone(TimeZone.getTimeZone(MspConstants.JSON_DATE_TIME_ZONE));
        if (ResourceMapper.PRETTY_JSON)
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    /**
     * <pre>
     * 지정된 resource에서 지정된 타입으로 json을 읽는다.
     * </pre>
     * 
     * @param resourcePath 리소스 경로
     * @param returnType 반환 타입
     * @param <T> 리턴 타입
     * @return json 정보
     * @throws IOException IO예외
     */
    @SuppressWarnings("unchecked")
    public static <T> T readJson(String resourcePath, TypeReference<T> returnType)
            throws IOException {
        Resource resource = resourcePatternResolver.getResource(resourcePath);
        InputStream resourceInputStream = resource.getInputStream();
        Object value = getDefaultObjectMapper().readValue(resourceInputStream, returnType);
        resourceInputStream.close();
        return (T) value;
    }

    @SuppressWarnings("unchecked")
    public static <T> T readJson(File file, TypeReference<T> returnType) throws IOException {
        FileInputStream resourceInputStream = new FileInputStream(file);
        Object value = getDefaultObjectMapper().readValue(resourceInputStream, returnType);
        resourceInputStream.close();
        return (T) value;
    }

    /**
     * <pre>
     * 지정된 경로에 json을 저장한다.
     * </pre>
     * 
     * @param path 경로
     * @param object 저장될 정보
     * @throws JsonGenerationException Json예외
     * @throws JsonMappingException Json예외
     * @throws IOException IO예외
     */
    public static void writeJson(Path path, Object object)
            throws JsonGenerationException, JsonMappingException, IOException {
        writeJson(path.toFile(), object);
    }

    /**
     * <pre>
     * 지정된 경로에 json을 저장한다.
     * </pre>
     * 
     * @param file 파일
     * @param object 저장될 정보
     * @throws JsonGenerationException Json예외
     * @throws JsonMappingException Json예외
     * @throws IOException IO예외
     */
    public static void writeJson(File file, Object object)
            throws JsonGenerationException, JsonMappingException, IOException {
        ObjectMapper objectMapper = getDefaultObjectMapper();
        FileOutputStream fo = new FileOutputStream(file);
        objectMapper.writeValue(fo, object);
        fo.close();
    }

    /**
     * <pre>
     * 리소스의 절대경로를 반환한다.
     * </pre>
     * 
     * @param resourcePath 리소스 경로
     * @return 리소스 절대경로
     * @throws IOException IO예외
     */
    public static String getAbsolutePath(String resourcePath) throws IOException {
        File resourceFile = getFile(resourcePath);
        return resourceFile.getAbsolutePath();
    }

    /**
     * <pre>
     * 리소스를 File객체로 반환한다.
     * </pre>
     * 
     * @param resourcePath 리소스 경로
     * @return 파일 객체
     * @throws IOException IO예외
     */
    public static File getFile(String resourcePath) throws IOException {
        Resource resource = resourcePatternResolver.getResource(resourcePath);
        return resource.getFile();
    }

    /**
     * <pre>
     * 리소스를 Path 객체로 반환한다.
     * </pre>
     * 
     * @param resourcePath 리소스 경로
     * @return Path 객체
     * @throws IOException IO예외
     */
    public static Path getPath(String resourcePath) throws IOException {
        File resourceFile = getFile(resourcePath);
        return resourceFile.toPath();
    }

    /**
     * <pre>
     * 지정된 경로에 file을 저장한다.
     * </pre>
     * 
     * @param file 파일객체
     * @param content 파일내용
     * @throws IOException IO예외
     */
    public static void writeFile(File file, String content) throws IOException {
        Writer fw =
                new OutputStreamWriter(new FileOutputStream(file, false), StandardCharsets.UTF_8);
        fw.write(content);
        fw.close();
    }

    public static Resource getResource(String resourcePath) {
        return resourcePatternResolver.getResource(resourcePath);
    }
}
