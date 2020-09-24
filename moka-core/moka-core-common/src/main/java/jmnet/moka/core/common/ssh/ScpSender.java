package jmnet.moka.core.common.ssh;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.EnumSet;
import org.apache.sshd.client.SshClient;
import org.apache.sshd.client.channel.ClientChannel;
import org.apache.sshd.client.channel.ClientChannelEvent;
import org.apache.sshd.client.future.AuthFuture;
import org.apache.sshd.client.future.OpenFuture;
import org.apache.sshd.client.scp.ScpClient;
import org.apache.sshd.client.scp.ScpClientCreator;
import org.apache.sshd.client.session.ClientSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;

public class ScpSender {
    private static final Logger logger = LoggerFactory.getLogger(ScpSender.class);
    private String stdOutMessage;
    private String stdErrMessage;
    private SshClient client;
    private ClientSession session;
    private String id;
    private String passwd;
    private String host;
    private int port;
    private File rsaKeyFile;
    private static ch.qos.logback.classic.Logger targetLogger;
    static {
        LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
        targetLogger = loggerContext.getLogger("org.apache.sshd");
        targetLogger.setLevel(Level.INFO);
    }
    public static final int SUCCESS = 0;
    public static final int FAIL_LOGIN = 1;
    public static final int FAIL_COMMAND = 2;
    public static final int FAIL_SCP = 3;
    public static final int UNKNOWN = 4;
    public static final String[] messages = {"success","login failed", "command failed","scp failed","unknown"};

    /**
     * ~/.ssh/id_rsa 에 저장된 키 파일을 이용하여 인증한다.
     * @param id 로그인 id
     * @param host 접속대상 host
     */
    public ScpSender(String id, String host) {
        this(id, host, null, null);
    }

    /**
     * 패스워드를 이용하여 인증한다.
     * @param id 로그인 id
     * @param host 접속대상 host
     * @param passwd 비밀번호
     */
    public ScpSender(String id, String host, String passwd) {
        this(id, host, passwd, null);
    }

    /**
     * 특정위치에  rsa private key를 이용하여 인증한다.
     * @param id
     * @param host
     * @param rsaKeyFile
     */
    public ScpSender(String id, String host, File rsaKeyFile) {
        this(id, host, null, rsaKeyFile);
    }

    public ScpSender(String id, String host, String passwd, File rsaKeyFile) {
        this.id = id;
        this.passwd = passwd;
        this.host = host;
        this.port = 22;
        this.rsaKeyFile = rsaKeyFile;
        this.client = SshClient.setUpDefaultClient();
        client.start();
    }

    public void enableLowLevelLog(boolean enable) {
        if ( enable ) {
            targetLogger.setLevel(Level.DEBUG);
        } else {
            targetLogger.setLevel(Level.INFO);
        }
    }

    public void setPort(int port) {
        this.port = port;
    }

    public static void main(String[] args) throws IOException {
        int testNo = 3;
        ScpSender scpSender = null;
        switch(testNo) {
            case 1 :
                scpSender = new ScpSender("msp","101.55.50.49");
                scpSender.enableLowLevelLog(true);
                break;
            case 2 :
                scpSender = new ScpSender("msp","101.55.50.49","msp#2019");
                break;
            case 3 :
                scpSender = new ScpSender("msp","101.55.50.49", new File("C:\\Users\\kspark\\.ssh\\id_rsa_org"));
//                scpSender.enableLowLevelLog(true);
                break;
            case 4 :
                scpSender = new ScpSender("asmanager","stg-backoffice.joongang.co.kr", new File("C:\\Users\\kspark\\.ssh\\id_rsa_backoffice"));
                scpSender.setPort(4490);
                break;
            default :
                logger.error("Test Number is invalid");
        }
        int result = UNKNOWN;
        if ( testNo == 4) {
            result = scpSender.send(new File("C:\\msp\\domains.json").toPath(), "/home/asmanager");
        } else {
            result = scpSender.send(new File("C:\\msp\\domains.json").toPath(), "/home/msp");
        }

        scpSender.close();
        logger.info(ScpSender.getMessage(result));
    }

    public static String getMessage(int messageCode) {
        if ( messageCode>=SUCCESS && messageCode<=FAIL_SCP) {
            return messages[messageCode];
        }else {
            return messages[UNKNOWN];
        }
    }

    public int send(Path localPath, String remoteFolder) throws IOException {
        if ( login() == false ) {
            return FAIL_LOGIN;
        }
        if ( this.session.isOpen()) {
            String fileName = localPath.toFile().getName();
            String tempFileName = fileName+".temp";
            String remoteTempPath = String.join("/", remoteFolder,tempFileName);
            String remotePath = String.join("/", remoteFolder,fileName);
            if ( upload(localPath, remoteTempPath) == false) {
                return FAIL_SCP;
            }
            if (command(String.join(" ", "mv", remoteTempPath, remotePath), 0) == false) {
                return FAIL_COMMAND;
            }
        }
        return SUCCESS;
    }

    public void close() throws IOException {
        client.stop();
        this.client.close();
        logger.debug("ssh client closed: {}@{}:{}", this.id, this.host,this.port);
    }

    public boolean login() throws IOException {
        logger.debug("connecting ssh: {}@{}:{}", this.id, this.host,this.port);
        this.session = this.client.connect(this.id,this.host,this.port).verify().getSession();
        logger.debug("connected ssh: {}@{}:{}", this.id, this.host,this.port);

        if ( this.passwd != null) {
            session.addPasswordIdentity(this.passwd);
        }

        if ( this.rsaKeyFile != null) {
            try {
                session.addPublicKeyIdentity(RsaKeyPairParser.load(this.rsaKeyFile));
            } catch (Exception e) {
                logger.error("key pair load fail.." ,e);
                return false;
            }
        }

        AuthFuture authFuture = session.auth();
        authFuture.await();
        if (authFuture.isSuccess()) {
            logger.debug("logged in : {}@{}:{}", this.id, this.host,this.port);
            return true;
        } else {
            logger.debug("login fail : {}@{}:{}", this.id, this.host,this.port);
            return false;
        }
    }

    public boolean command(String command, int waitSec) {
        ByteArrayOutputStream stdOut = new ByteArrayOutputStream();
        ByteArrayOutputStream stdErr = new ByteArrayOutputStream();
        try ( ClientChannel channel = this.session.createExecChannel(command)) {
            logger.debug("opening channel  : {}", command);
            channel.setOut(stdOut);
            channel.setErr(stdErr);
            OpenFuture openFuture = channel.open();
            openFuture.verify();
            if ( waitSec == 0 ) {
                channel.waitFor(EnumSet.of(ClientChannelEvent.CLOSED), 0L);
            } else {
                channel.waitFor(EnumSet.of(ClientChannelEvent.CLOSED, ClientChannelEvent.TIMEOUT), waitSec*1000L);
            }
            logger.debug("command execute success: {}", command);
        } catch (IOException e) {
            logger.debug("command execute failed: {}", command);
            return false;
        } finally {
            this.stdErrMessage = stdErr.toString();
            this.stdOutMessage = stdOut.toString();
            if ( this.stdOutMessage.length()>0) {
                logger.debug("stdout = \n{}", this.stdOutMessage);
            }
            if ( this.stdErrMessage.length()>0) {
                logger.debug("stderr = \n{}", this.stdErrMessage);
            }
        }
        return true;
    }

    public boolean upload(Path local, String remotePath) {
        ScpClientCreator scc = ScpClientCreator.instance();
        ScpClient scpClient = scc.createScpClient(this.session);
        try {
            logger.debug("before upload : {} {}", local.toFile().getAbsolutePath(), remotePath);
            scpClient.upload(local, remotePath);
            logger.debug("upload completed: {} {}", local.toFile().getAbsolutePath(), remotePath);
        } catch (IOException e) {
            logger.debug("upload failed: {} {}", local.toFile().getAbsolutePath(), remotePath);
            return false;
        }
        return true;
    }
}
