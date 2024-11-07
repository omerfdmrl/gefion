const fs = require("fs");
const Storage = require("@gefion/storage");
const Config = require("@gefion/config");

/**
 * Represents the local provider for GefionStorage.
 * @class
 */
class Local {
  /**
   * Name of the provider.
   * @type {string}
   * @static
   */
  static provider = "local";

  /** @private */
  #config;

  /**
   * Constructs a new instance of the Local storage provider.
   * @param {object} config - Configuration options for the provider.
   */
  constructor(config) {
    this.#config = config;
  }

  /**
   * Uploads a file to the local storage provider.
   * @param {object} file - The file to upload.
   * @param {string} fileName - The desired file name.
   * @returns {Promise} - A promise that resolves when the file is uploaded successfully.
   */
  async upload(file, fileName) {
    const destinationPath = this.#getFilePath(fileName);
    const fileExtension = file.originalFilename.substring(
      file.originalFilename.lastIndexOf(".") + 1,
      file.originalFilename.length
    );
    const fullFilePath = `${destinationPath}.${fileExtension}`;

    try {
      await fs.promises.mkdir(destinationPath, { recursive: true });

      await fs.promises.copyFile(file.path, fullFilePath);

      return {
        path: fullFilePath,
        link: this.#config.visibility
          ? `${Config.get("server").url}${
              this.#config.link
            }${fileName}.${fileExtension}`
          : null,
      };
    } catch (err) {
      return err;
    }
  }

  /**
   * Deletes a file from the local storage provider.
   * @param {string} fileName - The name of the file to delete.
   * @returns {Promise} - A promise that resolves when the file is deleted successfully.
   */
  delete(fileName) {
    return fs.unlink(this.#getFilePath(fileName));
  }

  /**
   * Renames a file in the local storage provider.
   * @param {string} oldName - The current name of the file.
   * @param {string} newName - The new name for the file.
   * @param {Function} callback - A callback function to be called when the file is renamed.
   * @returns {Promise} - A promise that resolves when the file is renamed successfully.
   */
  rename(oldName, newName, callback) {
    return fs.rename(
      this.#getFilePath(oldName),
      this.#getFilePath(newName),
      callback
    );
  }

  /**
   * Opens a file in the local storage provider.
   * @param {string} fileName - The name of the file to open.
   * @param {Function} [callback=null] - A callback function to be called when the file is opened.
   * @param {string} [flags=undefined] - The file system flags to use when opening the file.
   * @returns {Promise} - A promise that resolves with the file descriptor when the file is opened successfully.
   */
  open(fileName, callback = null, flags = undefined) {
    return fs.open(this.#getFilePath(fileName), flags, callback);
  }

  /**
   * Appends data to a file in the local storage provider.
   * @param {string} fileName - The name of the file to append data to.
   * @param {string|Buffer|Uint8Array} data - The data to append to the file.
   * @param {Function} callback - A callback function to be called when the data is appended to the file.
   * @returns {Promise} - A promise that resolves when the data is appended to the file successfully.
   */
  append(fileName, data, callback) {
    return fs.appendFile(this.#getFilePath(fileName), data, callback);
  }

  /**
   * Writes data to a file in the local storage provider.
   * @param {string} fileName - The name of the file to write data to.
   * @param {string|Buffer|Uint8Array} data - The data to write to the file.
   * @param {Function} callback - A callback function to be called when the data is written to the file.
   * @returns {Promise} - A promise that resolves when the data is written to the file successfully.
   */
  write(fileName, data, callback) {
    return fs.writeFile(this.#getFilePath(fileName), data, callback);
  }

  /**
   * Reads the contents of a file from the local storage provider.
   * @param {string} fileName - The name of the file to read.
   * @param {Function} [callback=null] - A callback function to be called when the file is read.
   * @returns {Promise} - A promise that resolves with the file contents when the file is read successfully.
   */
  read(fileName, callback = null) {
    return fs.readFile(this.#getFilePath(fileName), callback);
  }

  /**
   * Generates the file path by appending the file name to the configured storage path.
   * @private
   * @param {string} fileName - The name of the file.
   * @returns {string} - The full file path.
   */
  #getFilePath(fileName) {
    return (
      (this.#config.path.endsWith("/") ? this.#config.path : +"/") + fileName
    );
  }
}

Storage.register(Local);
