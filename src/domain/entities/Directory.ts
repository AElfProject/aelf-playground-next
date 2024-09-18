import { FileSystemEntity } from './FileSystemEntity';

export class Directory extends FileSystemEntity {
  public children: FileSystemEntity[] = [];

  constructor(name: string) {
    super(name);
  }

  addEntity(entity: FileSystemEntity) {
    this.children.push(entity);
  }
}