"use client";

import {
  Tree,
  TreeViewElement,
  File,
  Folder,
  CollapseButton,
} from "@/components/extension/tree-view-api";
import Link from "next/link";

type TOCProps = {
  toc: TreeViewElement[];
  pathname: string;
};

const TOC = ({ toc, pathname }: TOCProps) => {
  return (
    <Tree className="w-full bg-background p-2 rounded-md" indicator={true}>
      {toc.map((element, _) => (
        <TreeItem key={element.id} elements={[element]} pathname={pathname} />
      ))}
      <CollapseButton elements={toc} expandAll={true} />
    </Tree>
  );
};

type TreeItemProps = {
  elements: TreeViewElement[];
  pathname: string;
};

export const TreeItem = ({ elements, pathname }: TreeItemProps) => {
  return (
    <ul className="w-full space-y-1">
      {elements.map((element) => (
        <li key={element.id} className="w-full space-y-2">
          {element.children && element.children?.length > 0 ? (
            <Folder
              element={element.name}
              value={element.id}
              isSelectable={element.isSelectable}
              className="px-px pr-1"
            >
              <TreeItem
                key={element.id}
                aria-label={`folder ${element.name}`}
                elements={element.children}
                pathname={pathname}
              />
            </Folder>
          ) : (
            <File
              key={element.id}
              value={element.id}
              isSelectable={element.isSelectable}
            >
              <Link href={`${pathname}/${encodeURIComponent(element.id)}`}>
                {element?.name}
              </Link>
            </File>
          )}
        </li>
      ))}
    </ul>
  );
};

function convert(data: string[]) {
  const map = new Map();
  const root: { children: TreeViewElement[] } = { children: [] };
  for (const name of data) {
    let path = "";
    let parent = root;
    for (const label of name.split("/")) {
      path += "/" + label;
      let node = map.get(path);
      if (!node) {
        map.set(path, (node = { id: name, name: label } as TreeViewElement));
        (parent.children ??= []).push(node);
      }
      parent = node;
    }
  }
  return root.children;
}

const FileExplorer = ({
  paths,
  pathname,
}: {
  paths: string[];
  pathname: string;
}) => {
  return <TOC toc={convert(paths)} pathname={pathname} />;
};

export default FileExplorer;
