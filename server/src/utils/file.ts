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

export interface IsDirectoryExistInput {
  path: string;
}

export function isFileExist({
  path,
  fileName,
  fileExtension = 'json'
}: BasicFileInput): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.exists(`${rootPath}/${path}/${fileName}.${fileExtension}`, exist => {
      resolve(exist);
    });
  });
}

export function isFileExistSync({
  path,
  fileName,
  fileExtension = 'json'
}: BasicFileInput): boolean {
  return fs.existsSync(`${rootPath}/${path}/${fileName}.${fileExtension}`);
}

export function isDirectoryExistSync({ path }: IsDirectoryExistInput): boolean {
  return fs.existsSync(`${rootPath}/${path}`);
}

export function isDirectoryExist({ path }: IsDirectoryExistInput): Promise<boolean> {
  return new Promise(resolve => {
    fs.exists(`${rootPath}/${path}`, exist => {
      resolve(exist);
    });
  });
}

export function writeFile({
  path,
  fileName,
  data,
  fileExtension = 'json'
}: WriteFileInput): Promise<NodeJS.ErrnoException | void> {
  return new Promise((resolve, reject) => {
    const filePath = `${rootPath}/${path}`;
    fs.exists(filePath, exist => {
      if (!exist) {
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

export function mkdirSync(directoryName: string) {
  fs.mkdirSync(directoryName);
}
