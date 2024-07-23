export enum Languages {
  CSHARP = "csharp",
  PROTOBUF = "protobuf",
  XML = "xml",
}

export function getLang(file: string) {
  if (file.endsWith("cs")) return Languages.CSHARP;

  if (file.endsWith("proto")) return Languages.PROTOBUF;

  if (file.endsWith("csproj")) return Languages.XML;
}
