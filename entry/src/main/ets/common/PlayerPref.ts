import fs from '@ohos.file.fs';

export class PlayerPreference {
  public static directoryInt = null;
  public static directoryFloat = null;
  public static directoryString = null;

  public static jsonInt = "{}";
  public static jsonFloat = "{}";
  public static jsonString = "{}";

  private static fileSavePath = "";

  public static Init(filePathPrefix) {
    PlayerPreference.fileSavePath = filePathPrefix;
    let filePath = filePathPrefix + "/PlayerPreference.txt";
    //Prevent crash
    let file = fs.openSync(filePath, fs.OpenMode.READ_ONLY | fs.OpenMode.CREATE);
    fs.closeSync(file);

    let str = fs.readTextSync(filePath);
    if (str != "") {
      let arr = str.split('\n');
      PlayerPreference.jsonInt = arr[0];
      PlayerPreference.jsonFloat = arr[1];
      PlayerPreference.jsonString = arr[2];
    }

    if (PlayerPreference.directoryInt == null)
      PlayerPreference.directoryInt = JSON.parse(PlayerPreference.jsonInt);
    if (PlayerPreference.directoryFloat == null)
      PlayerPreference.directoryFloat = JSON.parse(PlayerPreference.jsonFloat);
    if (PlayerPreference.directoryString == null)
      PlayerPreference.directoryString = JSON.parse(PlayerPreference.jsonString);
  }

  public static SetInt(name, value) {
    PlayerPreference.directoryInt[name] = value;
  }

  public static SetFloat(name, value) {
    PlayerPreference.directoryFloat[name] = value
  }

  public static SetString(name, value) {
    PlayerPreference.directoryString[name] = value
  }

  public static GetInt(name, def) {
    if (PlayerPreference.directoryInt[name] == null)
      return def;

    return PlayerPreference.directoryInt[name];
  }

  public static GetFloat(name, def) {
    if (PlayerPreference.directoryFloat[name] == null)
      return def;

    return PlayerPreference.directoryFloat[name];
  }

  public static GetString(name, def) {
    if (PlayerPreference.directoryString[name] == null)
      return def;
    
    return PlayerPreference.directoryString[name];
  }

  public static HasKey(name) {
    if (PlayerPreference.directoryString[name] != null)
      return true;
    if (PlayerPreference.directoryFloat[name] != null)
      return true;
    if (PlayerPreference.directoryInt[name] != null)
      return true;

    return false;
  }

  public static DeleteKey(name) {
    if (PlayerPreference.directoryString[name] != null)
      delete PlayerPreference.directoryString[name]
    if (PlayerPreference.directoryFloat[name] != null)
      delete PlayerPreference.directoryFloat[name]
    if (PlayerPreference.directoryInt[name] != null)
      delete PlayerPreference.directoryInt[name]
  }

  public static DeleteAll() {
    Object.keys(PlayerPreference.directoryString).forEach(function (key) {
      delete PlayerPreference.directoryString[key];
    });
    Object.keys(PlayerPreference.directoryFloat).forEach(function (key) {
      delete PlayerPreference.directoryFloat[key];
    });
    Object.keys(PlayerPreference.directoryInt).forEach(function (key) {
      delete PlayerPreference.directoryInt[key];
    });
  }

  public static Save(filePathPrefix) {
    PlayerPreference.jsonInt = JSON.stringify(PlayerPreference.directoryInt);
    PlayerPreference.jsonFloat = JSON.stringify(PlayerPreference.directoryFloat);
    PlayerPreference.jsonString = JSON.stringify(PlayerPreference.directoryString);

    let filePath = filePathPrefix + "/PlayerPreference.txt";
    let file = fs.openSync(filePath, fs.OpenMode.WRITE_ONLY | fs.OpenMode.CREATE);
    let content = PlayerPreference.jsonInt + '\n' + PlayerPreference.jsonFloat + '\n' + PlayerPreference.jsonString + '\n';
    fs.writeSync(file.fd, content);
    fs.closeSync(file);
  }

  public static LocalSave() {
    PlayerPreference.Save(PlayerPreference.fileSavePath);
  }
}
