import { SharePageComponent } from "./_sharepagecomponent";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  return (
    <SharePageComponent id={id} />
  );
}
