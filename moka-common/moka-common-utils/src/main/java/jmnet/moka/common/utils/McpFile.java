package jmnet.moka.common.utils;

import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.time.FastDateFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Base64Utils;

/**
 * <pre>
 * 파일 관련 유틸 클래스
 * 2017. 5. 17. ince 최초생성
 * </pre>
 *
 * @author ince
 * @since 2017. 5. 17. 오후 4:23:43
 */
public final class McpFile extends org.apache.commons.io.FileUtils {
    private static final Logger logger = LoggerFactory.getLogger(McpFile.class);

    public static final long IMG_SIZE = 100 * (1024 * 1024);

    public static final double MOV_SIZE = 20 * (1024 * 1024);

    public static final String IMG = "IMG";

    public static final String GIF = "GIF";

    public static final String MOV = "MOV";

    public static final String DEFAULT_CHARSET = "utf-8";

    public static final String[] IMG_EXTENSIONS = {"jpg", "jpeg", "png"};

    public static final String[] GIF_EXTENSIONS = {"gif"};

    public static final String[] IMG_MIMETYPES = {"image/gif", "image/jpeg", "image/jpg"};

    public static final String[] MOV_EXTENSIONS = {"mp4"};

    // https://ko.wikipedia.org/wiki/%EC%98%A4%EB%94%94%EC%98%A4_%ED%8C%8C%EC%9D%BC_%ED%8F%AC%EB%A7%B7
    public static final String[] AUD_EXTENSIONS =
            {"3gp", "aiff", "aac", "alac", "amr", "atrac", "au", "awb", "dvf", "flac", "mmf", "mp3", "mpc", "msv", "ogg", "opus", "ra ", "rm", "tta",
             "vox", "wav", "wma"};

    public static final String[] DOC_EXTENSIONS = {"doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "hwp"};

    /**
     * 시스템 시간을 기준으로 "/년도/월/일" 에 해당 하는 경로를 리턴 합니다.
     *
     * @return 노드 경로
     */
    public static String getDatePath() {
        return FastDateFormat
                .getInstance("/yyyy/MM/dd")
                .format(Calendar.getInstance());
    }



    /**
     * <pre>
     * 리소스 기준 경로를 리턴 합니다.
     * </pre>
     *
     * @param basePath 기본 저장 경로
     * @return 리소스 저장 기준 경로
     */
    public static String getDatePath(final String basePath) {
        return basePath + FastDateFormat
                .getInstance("/yyyy/MM/dd")
                .format(Calendar.getInstance());

    }

    /**
     * <pre>
     * 리소스 기준 경로를 리턴 합니다.
     * 날짜를 외부로 부터 전달 받는다.
     * </pre>
     *
     * @param basePath 기본 저장 경로
     * @param date     날짜
     * @return 파일 경로 String
     */
    public static String getDatePath(final String basePath, String date) {
        return basePath + date;
    }

    /**
     * <pre>
     * 파일명을 리턴 한다.
     * </pre>
     *
     * @param file File
     * @return 파일명 String
     */
    public static String getFilename(File file) {
        return FilenameUtils.getName(file.getName());
    }

    /**
     * 확장자를 제외한 파일명을 리턴 한다.
     *
     * @param filename 파일명
     * @return 확장자를 제외한 파일명
     */
    public static String getFileBasename(String filename) {
        return FilenameUtils.getBaseName(filename);
    }


    /**
     * 파일 확장자를 구한다.
     *
     * @param file 파일
     * @return 파일 확장자 String
     */
    public static String getExtension(File file) {
        return FilenameUtils.getExtension(file.getName());
    }

    /**
     * 파일 확장자를 구한다.
     *
     * @param fileName 파일명
     * @return 파일 확장자 String
     */
    public static String getExtension(String fileName) {
        return FilenameUtils.getExtension(fileName);
    }



    private static boolean isMatchedName(String name, String... arrs) {
        for (String ext : arrs) {
            if (name.equalsIgnoreCase(ext)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 이미지 파일인지 확인한다.
     *
     * @param file File
     * @return 이미지 파일 여부
     */
    public static boolean isImageFile(File file) {
        if (file == null) {
            return false;
        }
        return isMatchedName(getExtension(file), IMG_EXTENSIONS);
    }

    /**
     * 동영상 파일인지 확인한다.
     *
     * @param file File
     * @return 동영상 파일 여부
     */
    public static boolean isVideoFile(File file) {
        if (file == null) {
            return false;
        }
        return isMatchedName(getExtension(file), MOV_EXTENSIONS);
    }

    /**
     * 오디오 파일인지 확인한다.
     *
     * @param file File
     * @return 오디오 파일 여부
     */
    public static boolean isAudioFile(File file) {
        if (file == null) {
            return false;
        }
        return isMatchedName(getExtension(file), AUD_EXTENSIONS);
    }

    /**
     * 문서 파일인지 확인한다.
     *
     * @param file File
     * @return 문서 파일 여부
     */
    public static boolean isDocumentFile(File file) {
        if (file == null) {
            return false;
        }
        return isMatchedName(getExtension(file), DOC_EXTENSIONS);
    }

    /**
     * <pre>
     * 이미지 파일 사이즈 정보를 리턴 합니다.
     * </pre>
     *
     * @param file File
     * @return Map<String, Object>
     */
    public static Map<String, Object> getImageSize(File file) {
        try {
            BufferedImage bimg = ImageIO.read(file);
            int width = bimg.getWidth();
            int height = bimg.getHeight();
            return MapBuilder
                    .getInstance()
                    .add("width", width)
                    .add("height", height)
                    .getMap();
        } catch (IOException e) {
            return new HashMap<>();
        }
    }

    /**
     * 파일 경로가 물리디스크에 없을 경우 파일 경로 저장
     *
     * @param filePath 파일 경로
     */
    private static void mkDestdir(final String filePath) {
        File destDirectory = new File(filePath);
        if (!destDirectory.exists()) {
            destDirectory.mkdirs();
        }
    }

    /**
     * blob형태의 문자열을 파일로 저장하고 파일 객체로 변환하여 리턴합니다.
     *
     * @param filepath 파일경로
     * @param filename 파일명
     * @param blobBody blob데이터
     * @return 파일
     * @throws Exception 예외처리 예외처리
     */
    public static String processImageBlob(final String filepath, String filename, String blobBody)
            throws Exception {
        final String saveFilepath = getFilepath(filepath, filename);

        byte[] data = Base64Utils.decodeFromString(blobBody);
        File file = new File(saveFilepath);
        writeByteArrayToFile(file, data);
        return filepath;
    }

    /**
     * blob형태의 문자열을 파일로 저장하고 파일 객체로 변환하여 리턴합니다.
     *
     * @param filepath 파일경로
     * @param blobBody blob데이터
     * @return 파일
     * @throws Exception 예외처리 예외처리
     */
    public static File processImageBlob(final String filepath, String blobBody)
            throws Exception {

        byte[] data = Base64Utils.decodeFromString(blobBody);
        File file = new File(filepath);
        writeByteArrayToFile(file, data);
        return file;
    }


    /**
     * 파라미터 조합을 통한 파일이 저장될 물리 경로를 리턴 한다.
     *
     * @param basePath 마운트 경로
     * @param filename 파일명
     * @return 파일의 물리 경로
     */
    public static String getFilepath(final String basePath, final String filename) {
        return getFilepath(basePath, filename, true);
    }

    /**
     * <pre>
     * 파라미터 조합을 통한 파일이 저장될 물리 경로를 리턴 한다.
     * </pre>
     *
     * @param filePath    파일 경로
     * @param filename    파일 명
     * @param isMountPath 파일 경로가 마운트 경로인지 여부
     * @return 파일의 물리 경로
     */
    public static String getFilepath(final String filePath, final String filename, boolean isMountPath) {
        String destFilePath = (isMountPath ? getDatePath(filePath) : filePath);
        mkDestdir(destFilePath);
        return makeFilepathName(destFilePath, filename);
    }

    /**
     * <pre>
     * 파라미터 조합을 통한 파일이 저장될 물리 경로를 리턴 한다.
     * </pre>
     *
     * @param basePath 파일 패스
     * @param date     날짜
     * @param filename 파일 명
     * @return String 파일 저장 경로
     */
    public static String getFilepath(final String basePath, final String date, final String filename) {
        String destFilePath = getDatePath(basePath, date);
        mkDestdir(destFilePath);
        return makeFilepathName(destFilePath, filename);
    }

    /**
     * <pre>
     * 파일경로와 파일명을 합친 경로를 반환한다.
     * </pre>
     *
     * @param filePath 파일 패스
     * @param filename 파일 명
     * @return String 파일 저장 경로
     */
    public static String makeFilepathName(final String filePath, final String filename) {
        String destFilePath = McpString.defaultValue(filePath, File.separator);
        if (!destFilePath.endsWith(File.separator)) {
            destFilePath += File.separator;
        }
        return destFilePath + filename;
    }



    /**
     * 이미지 파일의 기본 정보를 구성 하여 맵으로 리턴 한다.
     *
     * @param file 소스 파일
     * @return 파일 기본 정보
     */
    public static Map<String, Object> getBasicInfo(File file) {
        if (file == null) {
            return null;
        }
        Map<String, Object> imageInfo = null;
        if (isImageFile(file)) {
            imageInfo = getImageSize(file);
        }
        String extension = getExtension(file);
        long size = file.length();
        return MapBuilder
                .getInstance()
                .add("file_ext", extension)
                .add("file_size", size)
                .add(imageInfo)
                .getMap();
    }

    /**
     * GIF 이미지의 원본 프레임 이미지들을 내려 줍니다.
     *
     * @param file GIF 애니메이션 파일
     * @return 이미지 프레임 목록
     */
    public static List<BufferedImage> getGifFrames(File file)
            throws Exception {
        List<BufferedImage> frames = new ArrayList<>();
        ImageReader reader = ImageIO
                .getImageReadersByFormatName("gif")
                .next();
        ImageInputStream stream = ImageIO.createImageInputStream(file);
        reader.setInput(stream);
        int count = reader.getNumImages(true);
        for (int index = 0; index < count; index++) {
            BufferedImage frame = reader.read(index);
            // logger.debug( "format: {}, frame: {}", reader.getFormatName(), frame );
            // reader.getFormatName(); // content-type
            frames.add(frame);
        }
        return frames;
    }


    /**
     * <pre>
     * 파일을 복사한다.
     * </pre>
     *
     * @param targetFilepath 원본 파일 경로
     * @param copyFilepath   복사 파일 경로
     * @throws Exception 예외처리
     */
    public static void copyFile(String targetFilepath, String copyFilepath)
            throws Exception {
        try (FileInputStream fis = new FileInputStream(targetFilepath); FileOutputStream fos = new FileOutputStream(copyFilepath)) {
            int data;
            while ((data = fis.read()) != -1) {
                fos.write(data);
            }
        } catch (IOException ex) {
            logger.debug("fileWrite erorr filepath : {}", targetFilepath);
            throw ex;
        }
    }

    /**
     * 파일이 이미지 파일인지 확장자와 mimeType을 구별한다.
     *
     * @param file File
     * @return 이미지 mimeType 여부 boolean
     * @throws Exception 예외처리
     */
    public static boolean checkImage(File file)
            throws Exception {
        boolean isValid = isImageFile(file);
        if (isValid) {
            Path filePath = Paths.get(file.getPath());
            String mimeType = Files.probeContentType(filePath);
            isValid = false;
            for (String mime : IMG_MIMETYPES) {
                logger.debug("Original mimeType : {}", mimeType);
                logger.debug("check mimeType : {}", mime);
                if (mimeType.equalsIgnoreCase(mime)) {
                    isValid = true;
                    break;
                }
            }
        }
        return isValid;
    }

    /**
     * 파일 사이즈 체크 (MB)
     *
     * @param file          파일
     * @param limitFileSize 체크 사이즈
     * @return 파일 크기 초콰 여부 boolean
     */
    public static boolean checkFileSize(File file, long limitFileSize, String type) {
        boolean isVaild = true;
        if (file == null) {
            isVaild = false;
        } else {
            if (type.equals(McpFile.IMG)) {
                if (file.length() > limitFileSize) {
                    isVaild = false;
                }
            }
            if (type.equals(McpFile.MOV)) {
                if (file.length() > limitFileSize) {
                    isVaild = false;
                }
            }
        }

        return isVaild;
    }


    /**
     * <pre>
     * 바이너리 정보를 파일로 저장한다.
     * </pre>
     *
     * @param filePath 파일경로
     * @param contents 바이너리 정보
     * @throws Exception 예외처리
     */
    public static void fileWrite(String filePath, byte[]... contents)
            throws Exception {

        File file = new File(filePath);
        File dir = new File(file.getParent());
        if (!dir.exists()) {
            dir.mkdirs();
        }
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(file);
            for (byte[] content : contents) {
                fos.write(content);
            }
        } catch (FileNotFoundException ex) {
            logger.debug("fileWrite erorr filepath : {}", filePath);
            throw ex;
        } finally {
            if (fos != null) {
                fos.flush();
                fos.close();
            }
        }
    }

    /**
     * <pre>
     * 텍스트 정보를 파일로 저장한다.
     * </pre>
     *
     * @param filePath 파일경로
     * @param contents 바이너리 정보
     * @throws Exception 예외처리
     */
    public static void fileWrite(String filePath, String... contents)
            throws Exception {

        File file = new File(filePath);
        File dir = new File(file.getParent());
        if (!dir.exists()) {
            dir.mkdirs();
        }

        try (BufferedWriter output = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file.getPath()), DEFAULT_CHARSET))) {

            for (String content : contents) {
                output.write(content);
            }
            output.flush();
        } catch (FileNotFoundException ex) {
            logger.debug("fileWrite erorr filepath : {}", filePath);
            throw ex;
        }
    }

    /**
     * <pre>
     * 디렉토리를 읽어 prefix로 시작하는 파일의 갯수를 구한다.
     * </pre>
     *
     * @param basePath 파일 경로
     * @param date     날짜
     * @param prefix   접두어
     * @return 파일 건수
     */
    public static int getFileCount(String basePath, String date, String prefix) {

        String filePath = getDatePath(basePath, date);

        return getFileCount(filePath, prefix);
    }

    /**
     * <pre>
     * 디렉토리를 읽어  prefix로 시작하는 파일의 갯수를 구한다.
     * </pre>
     *
     * @param filePath 파일 경로
     * @param prefix   접두어
     * @return 파일 건수
     */
    public static int getFileCount(String filePath, String prefix) {

        File dir = new File(filePath);

        int fileCount = 0;
        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file
                            .getName()
                            .startsWith(prefix)) {
                        fileCount++;
                    }
                }
            }
        }

        return fileCount;
    }

    /**
     * <pre>
     * 파일을 삭제한다
     * </pre>
     *
     * @param filePaths 파일경로
     * @return 삭제 여부
     */
    public static boolean deleteFile(String... filePaths) {
        for (String filePath : filePaths) {
            if (!filePath.isEmpty()) {
                File file = new File(filePath);

                if (file.exists()) {
                    try {
                        boolean ret = file.delete();
                        logger.debug("File Delete: {}, Result: {}", file, ret);
                    } catch (Exception e) {
                        logger.error("File Delete Fail: {}, Error: {}", file, e);
                        return false;
                    }
                }
            } else {
                logger.error("That file doesn't exist: {}", filePath);
            }
        }
        return true;
    }

    /**
     * 파일명 확장자 바로 앞에 접미어를 추가한다.
     *
     * @param fileName 파일명
     * @param suffix   접미어
     * @return 새 파일명
     */
    public static String addSuffix(String fileName, String suffix) {
        return McpFile.getFileBasename(fileName) + suffix + "." + McpFile.getExtension(fileName);
    }
}
