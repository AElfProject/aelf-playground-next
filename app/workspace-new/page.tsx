import { WorkspaceForm } from "@/components/menu/new-workspace-form";
import { getTemplateNames } from "@/data/template";

export default async function Page() {
  const templateOptions = await getTemplateNames();
  return (
    <main>
      <div className="h-screen flex items-center justify-center">
        <WorkspaceForm templateOptions={templateOptions} />
      </div>
    </main>
  );
}
