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
import jmnet.moka.common.utils.exception.Filesizelimitexceededexception;

/**
 * 
 * <pre>
 * 파일 관련 유틸 클래스
 * 2017. 5. 17. ince 최초생성
 * </pre>
 * 
 * @since 2017. 5. 17. 오후 4:23:43
 * @author ince
 */
public final class McpFile extends org.apache.commons.io.FileUtils {
    private static final Logger logger = LoggerFactory.getLogger(McpFile.class);

    public static final long IMG_SIZE = 100 * (1024 * 1024);

    public static final long MOV_SIZE = 2 * (1024 * 1024 * 1024);

    public static final String IMG = "IMG";

    public static final String GIF = "GIF";

    public static final String MOV = "MOV";

    public static final String DEFAULT_CHARSET = "utf-8";

    public static final String[] IMG_EXTENSIONS = {"jpg", "jpeg", "png"};

    public static final String[] GIF_EXTENSIONS = {"gif"};

    public static final String[] IMG_MIMETYPES =
            {"image/gif", "image/jpeg", "image/pjpeg", "image/png"};

    public static final String[] MOV_EXTENSIONS = {"mp4"};

    // https://ko.wikipedia.org/wiki/%EC%98%A4%EB%94%94%EC%98%A4_%ED%8C%8C%EC%9D%BC_%ED%8F%AC%EB%A7%B7
    public static final String[] AUD_EXTENSIONS =
            {"3gp", "aiff", "aac", "alac", "amr", "atrac", "au", "awb", "dvf", "flac", "mmf", "mp3",
                    "mpc", "msv", "ogg", "opus", "ra ", "rm", "tta", "vox", "wav", "wma"};

    public static final String[] DOC_EXTENSIONS =
            {"doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "hwp"};

    /**
     * 시스템 시간을 기준으로 "/년도/월/일" 에 해당 하는 경로를 리턴 합니다.
     *
     * @return 노드 경로
     */
    public static String getDatePath() {
        return FastDateFormat.getInstance("/yyyy/MM/dd").format(Calendar.getInstance());
    }



    /**
     * 
     * <pre>
     * 리소스 기준 경로를 리턴 합니다.
     * </pre>
     * 
     * @param mountPath
     * @return 리소스 저장 기준 경로
     */
    public static String getDatePath(final String mountPath) {
        final String basePath = mountPath
                + FastDateFormat.getInstance("/yyyy/MM/dd").format(Calendar.getInstance());
        return basePath;
    }

    /**
     * 
     * <pre>
     * 리소스 기준 경로를 리턴 합니다.
     * 날짜를 외부로 부터 전달 받는다.
     * </pre>
     * 
     * @param mountPath
     * @param date
     * @return 파일 경로 String
     */
    public static String getDatePath(final String mountPath, String date) {
        final String basePath = mountPath + date;
        return basePath;
    }

    /**
     * 
     * <pre>
     * 파일명을 리턴 한다.
     * </pre>
     * 
     * @param file
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
     * @param file MultipartFile 파일
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
     * @param file
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
     * @param file
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
     * @param file
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
     * @param file
     * @return 문서 파일 여부
     */
    public static boolean isDocumentFile(File file) {
        if (file == null) {
            return false;
        }
        return isMatchedName(getExtension(file), DOC_EXTENSIONS);
    }

    /**
     * 
     * <pre>
     * 이미지 파일 사이즈 정보를 리턴 합니다.
     * </pre>
     * 
     * @param file
     * @return Map<String, Object>
     */
    public static Map<String, Object> getImageSize(File file) {
        try {
            BufferedImage bimg = ImageIO.read(file);
            int width = bimg.getWidth();
            int height = bimg.getHeight();
            return MapBuilder.getInstance().add("width", width).add("height", height).getMap();
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
     * @throws Exception 예외처리
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
     * @throws Exception 예외처리
     */
    public static File processImageBlob(final String filepath, String blobBody) throws Exception {

        byte[] data = Base64Utils.decodeFromString(blobBody);
        File file = new File(filepath);
        writeByteArrayToFile(file, data);
        return file;
    }


    /**
     * 파라미터 조합을 통한 파일이 저장될 물리 경로를 리턴 한다.
     *
     * @param mountPath 마운트 경로
     * @param filename 파일명
     * @return 파일의 물리 경로
     * @throws Exception
     */
    public static String getFilepath(final String mountPath, final String filename)
            throws Exception {
        return getFilepath(mountPath, filename, true);
    }

    /**
     * 
     * <pre>
     * 파라미터 조합을 통한 파일이 저장될 물리 경로를 리턴 한다.
     * </pre>
     * 
     * @param filePath 파일 경로
     * @param filename 파일 명
     * @param isMountPath 파일 경로가 마운트 경로인지 여부
     * @return 파일의 물리 경로
     * @throws Exception
     */
    public static String getFilepath(final String filePath, final String filename,
            boolean isMountPath) throws IOException {
        String destFilePath = (isMountPath ? getDatePath(filePath) : filePath) + "/";
        mkDestdir(destFilePath);
        return destFilePath + filename;
    }

    /**
     * 
     * <pre>
     * 파라미터 조합을 통한 파일이 저장될 물리 경로를 리턴 한다.
     * </pre>
     * 
     * @param mountPath 파일 패스
     * @param date 날짜
     * @param filename 파일 명
     * @return String 파일 저장 경로
     * @throws Exception
     */
    public static String getFilepath(final String mountPath, final String date,
            final String filename) {
        String destFilePath = getDatePath(mountPath, date) + "/";
        mkDestdir(destFilePath);
        return destFilePath + filename;
    }



    /**
     * 이미지 파일의 기본 정보를 구성 하여 맵으로 리턴 한다.
     *
     * @param file 소스 파일
     * @return 파일 기본 정보
     */
    public static Map<String, Object> getBasicInfo(File file) throws Exception {
        if (file == null) {
            return null;
        }
        Map<String, Object> imageInfo = null;
        if (isImageFile(file)) {
            imageInfo = getImageSize(file);
        }
        String extension = getExtension(file);
        long size = file.length();
        return MapBuilder.getInstance().add("file_ext", extension).add("file_size", size)
                .add(imageInfo).getMap();
    }

    /**
     * GIF 이미지의 원본 프레임 이미지들을 내려 줍니다.
     *
     * @param file GIF 애니메이션 파일
     * @return 이미지 프레임 목록
     * @throws IOException
     */
    public static List<BufferedImage> getGifFrames(File file) throws Exception {
        List<BufferedImage> frames = new ArrayList<BufferedImage>();
        ImageReader reader = ImageIO.getImageReadersByFormatName("gif").next();
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
     * @param fromFilepath
     * @param toFilepath
     * @throws Exception
     */
    public static void copyFile(String fromFilepath, String toFilepath) throws Exception {
        FileInputStream fis = null;
        FileOutputStream fos = null;
        try {
            fis = new FileInputStream(fromFilepath);
            fos = new FileOutputStream(toFilepath);
            int data = 0;
            while ((data = fis.read()) != -1) {
                fos.write(data);
            }
        } catch (IOException ex) {
            logger.debug("fileWrite erorr filepath : {}", fromFilepath);
            throw ex;
        } finally {
            if (fis != null)
                fis.close();
            if (fos != null)
                fos.close();
        }
    }

    /**
     * 파일이 이미지 파일인지 확장자와 mimeType을 구별한다.
     * 
     * @param file
     * @return 이미지 mimeType 여부 boolean
     * @throws Exception
     */
    public static boolean checkImage(File file) throws Exception {
        Boolean isValid = isImageFile(file);
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
     * @param file 파일
     * @param filesize 체크 사이즈
     * @return 파일 크기 초콰 여부 boolean
     */
    public static boolean checkFileSize(File file, long filesize, String type) throws Exception {
        boolean isVaild = true;
        if (file == null) {
            return isVaild;
        } else {
            if (type.equals(McpFile.IMG)) {
                if (file.length() > filesize) {
                    return isVaild;
                } else {
                    isVaild = false;
                }
            }
            if (type.equals(McpFile.MOV)) {
                if (file.length() > filesize) {
                    return isVaild;
                } else {
                    isVaild = false;
                }
            }
        }
        if (isVaild) {
            throw new Filesizelimitexceededexception();
        } else {
        }
        return isVaild;
    }


    /**
     * 
     * <pre>
     * 바이너리 정보를 파일로 저장한다.
     * </pre>
     * 
     * @param filePath 파일경로
     * @param contents 바이너리 정보
     * @throws Exception
     */
    public static void fileWrite(String filePath, byte[]... contents) throws Exception {

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
     * 
     * <pre>
     * 텍스트 정보를 파일로 저장한다.
     * </pre>
     * 
     * @param filePath 파일경로
     * @param contents 바이너리 정보
     * @throws Exception
     */
    public static void fileWrite(String filePath, String... contents) throws Exception {

        File file = new File(filePath);
        File dir = new File(file.getParent());
        if (!dir.exists()) {
            dir.mkdirs();
        }

        BufferedWriter output = null;
        try {
            output = new BufferedWriter(
                    new OutputStreamWriter(new FileOutputStream(file.getPath()), DEFAULT_CHARSET));

            for (String content : contents) {
                output.write(content);
            }
            output.flush();
        } catch (FileNotFoundException ex) {
            logger.debug("fileWrite erorr filepath : {}", filePath);
            throw ex;
        } finally {
            if (output != null) {
                output.close();
            }
        }
    }

    /**
     * 
     * <pre>
     * 디렉토리를 읽어 prefix로 시작하는 파일의 갯수를 구한다.
     * </pre>
     * 
     * @param mountPath 파일 경로
     * @param date 날짜
     * @param prefix 접두어
     * @return 파일 건수
     */
    public static int getFileCount(String mountPath, String date, String prefix) {

        String filePath = getDatePath(mountPath, date);

        File dir = new File(filePath);

        int fileCount = 0;
        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            for (File file : files) {
                if (file.getName().startsWith(prefix)) {
                    fileCount++;
                }
            }
        }

        return fileCount;
    }

    /**
     * 
     * <pre>
     * 디렉토리를 읽어  prefix로 시작하는 파일의 갯수를 구한다.
     * </pre>
     * 
     * @param mountPath 파일 경로
     * @param date 날짜
     * @param prefix 접두어
     * @return 파일 건수
     */
    public static int getFileCount(String filePath, String prefix) {

        File dir = new File(filePath);

        int fileCount = 0;
        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            for (File file : files) {
                if (file.getName().startsWith(prefix)) {
                    fileCount++;
                }
            }
        }

        return fileCount;
    }
}
