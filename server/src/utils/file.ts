import fs from 'fs';

const rootPath = 'src/assets';
export interface BasicFileInput {
  path: string;
  fileName: string;
  fileExtension?: string;
}
export interface WriteFileInput extends BasicFileInput {
  data: any;
}

export function isFileExist({
  path,
  fileName,
  fileExtension = 'json'
}: BasicFileInput): Promise<NodeJS.ErrnoException | void> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${rootPath}/${path}/${fileName}.${fileExtension}`,
      { encoding: 'utf-8' },
      (err, data) => {
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
}

export function IsFileExistSync({
  path,
  fileName,
  fileExtension = 'json'
}: BasicFileInput): boolean {
  try {
    fs.readFileSync(`${rootPath}/${path}/${fileName}.${fileExtension}`, { encoding: 'utf-8' });
    return true;
  } catch {
    return false;
  }
}

export function writeFile({
  path,
  fileName,
  data,
  fileExtension = 'json'
}: WriteFileInput): Promise<NodeJS.ErrnoException | void> {
  return new Promise((resolve, reject) => {
    const filePath = `${rootPath}/${path}`;
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }
    fs.writeFile(`${filePath}/${fileName}.${fileExtension}`, data, 'utf-8', err => {
      if (err) {
        console.log(`write ${path}/${fileName}.${fileExtension} has err`, err);
        reject(err);
        return;
      }
      console.log(`write ${path}/${fileName}.${fileExtension}`);
      resolve();
    });
  });
}

export function readFile({
  path,
  fileName,
  fileExtension = 'json'
}: BasicFileInput): Promise<NodeJS.ErrnoException | any> {
  return new Promise((resolve, reject) => {
    fs.readFile(`${rootPath}/${path}/${fileName}.${fileExtension}`, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

export function readFileSync({ path, fileName, fileExtension = 'json' }: BasicFileInput): string {
  return fs.readFileSync(`${rootPath}/${path}/${fileName}.${fileExtension}`, { encoding: 'utf-8' });
}