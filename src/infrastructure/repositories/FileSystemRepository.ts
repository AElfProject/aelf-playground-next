import { FileSystemEntity } from '@/src/domain/entities/FileSystemEntity';
import { File } from '@/src/domain/entities/File';
import { Directory } from '@/src/domain/entities/Directory';

export class FileSystemRepository {
  private root: Directory;

  constructor() {
    this.root = new Directory('root');
  }

  addEntity(entity: FileSystemEntity, path: string): void {
    const parentDir = this.findDirectory(path);
    if (parentDir) {
      parentDir.addEntity(entity);
    } else {
      throw new Error(`Directory at path ${path} not found`);
    }
  }

  removeEntity(name: string, path: string): void {
    const parentDir = this.findDirectory(path);
    if (parentDir) {
      parentDir.children = parentDir.children.filter(entity => entity.name !== name);
    } else {
      throw new Error(`Directory at path ${path} not found`);
    }
  }

  findEntity(name: string, path: string): FileSystemEntity | undefined {
    const parentDir = this.findDirectory(path);
    if (parentDir) {
      return parentDir.children.find(entity => entity.name === name);
    } else {
      throw new Error(`Directory at path ${path} not found`);
    }
  }

  private findDirectory(path: string): Directory | undefined {
    const parts = path.split('/').filter(part => part.length > 0);
    let currentDir: Directory | undefined = this.root;

    for (const part of parts) {
      const nextDir = currentDir.children.find(entity => entity instanceof Directory && entity.name === part) as Directory;
      if (nextDir) {
        currentDir = nextDir;
      } else {
        return undefined;
      }
    }

    return currentDir;
  }
}