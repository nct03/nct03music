package com.nctcompany.nct03.constant;

import java.io.File;
import java.nio.file.Paths;

public class ApplicationConstants {

    public static final String ROOT_FOLDER_PATH = Paths.get("").toFile().getAbsolutePath();
    public static final String SONGS_FOLDER_PATH = ROOT_FOLDER_PATH + File.separator + "songs";
    public static final String USERS_FOLDER_PATH = ROOT_FOLDER_PATH + File.separator + "users";
    public static final String ARTISTS_FOLDER_PATH = ROOT_FOLDER_PATH + File.separator + "artists";

}
