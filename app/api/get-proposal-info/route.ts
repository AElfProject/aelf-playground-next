export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    throw new Error("no id");
  }

  const res = await fetch(
    `https://testnet.aelfscan.io/api/app/blockchain/transactions?&address=${id}&order=DESC`
  );
  const data = await res.json();

  return Response.json(data);
}
