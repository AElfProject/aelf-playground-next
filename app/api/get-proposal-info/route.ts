export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    throw new Error("no id");
  }

  const res = await fetch(
    `https://explorer-test-side02.aelf.io/api/proposal/proposalInfo?proposalId=${id}`
  );
  const data = await res.json();

  return Response.json(data);
}
