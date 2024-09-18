import { FileSystemEntity } from './FileSystemEntity';

export class File extends FileSystemEntity {
  constructor(name: string, public content: string) {
    super(name);
  }
}