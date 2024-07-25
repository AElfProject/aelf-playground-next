import { WorkspaceForm } from "@/components/new-workspace-form";
import Existing from "@/components/workspace/existing";
import { getTemplateNames } from "@/data/template";

export default async function Page() {
  const templateOptions = await getTemplateNames();
  return (
    <div className="container grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3 md:gap-12 md:px-6 lg:py-16">
      <div>
        <h1 className="text-2xl mb-2">Create a new workspace</h1>
        <WorkspaceForm templateOptions={templateOptions} />
      </div>
      <div className="md:col-span-2">
        <h1 className="text-2xl mb-2">Open an existing workspace</h1>
        <Existing />
      </div>
    </div>
  );
}
