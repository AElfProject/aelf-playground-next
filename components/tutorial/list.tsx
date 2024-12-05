import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { List } from "@/components/listing-page/list";
import { env } from "@/data/env";

const solidityEnabled = env.SOLIDITY_ENABLED;
const data = [
  {
    id: "hello-world",
    img: "/hello-world.jpeg",
    title: "Hello World Contract",
    description: "Simplest contract to get you started",
    level: "Beginner",
    levelId: "beginner",
    lang: "C#",
    langId: "csharp",
  },
  {
    id: "hello-world-solidity",
    img: "/hello-world.jpeg",
    title: "Hello World Contract",
    description: "Simplest contract to get you started",
    level: "Beginner",
    levelId: "beginner",
    lang: "Solidity",
    langId: "solidity",
  },
  {
    id: "vote-contract",
    img: "/vote.jpeg",
    title: "Vote Contract",
    description:
      "Voting mechanisms, security considerations, and advanced data structures",
    level: "Intermediate",
    levelId: "intermediate",
    lang: "C#",
    langId: "csharp",
  },
  {
    id: "lottery-game",
    img: "/lottery.jpeg",
    title: "Lottery Game Contract",
    description:
      "State variables, user interactions, and random number generation",
    level: "Advanced",
    levelId: "advanced",
    lang: "C#",
    langId: "csharp",
  },
  {
    id: "todo",
    img: "/todo.jpeg",
    title: "ToDo Contract",
    description: "A basic ToDo smart contract",
    level: "Intermediate",
    levelId: "intermediate",
    lang: "C#",
    langId: "csharp",
  },
  {
    id: "tic-tac-toe",
    img: "/tic-tac-teo-contract.png",
    title: "Tic-Tac-Toe Contract",
    description: "Decentralized gamify Contract",
    level: "Intermediate",
    levelId: "intermediate",
    lang: "C#",
    langId: "csharp",
  },
  {
    id: "expense-tracker",
    img: "/expense-tracker-contract.png",
    title: "Expense Tracker Contract",
    description: "User-friendly interface for recording expenses, categorizing them, and tracking spending habitst",
    level: "Intermediate",
    levelId: "intermediate",
    lang: "C#",
    langId: "csharp",
  },
  {
    id: "single-pool-staking",
    img: "/single-pool-staking-contract.png",
    title: "Single Pool Staking Contract",
    description: "Allows users to stake their tokens in a single staking pool",
    level: "Advanced",
    levelId: "advanced",
    lang: "C#",
    langId: "csharp",
  },
  {
    id: "role",
    img: "/allowance-contract.png",
    title: "Allowance Contract",
    description: "Integration of two smart contracts, RoleContract and AllowanceContract, focusing on role-based access and fund management",
    level: "Advanced",
    levelId: "advanced",
    lang: "C#",
    langId: "csharp",
  },
].filter((i) => (solidityEnabled ? true : i.langId !== "solidity"));

export function TutorialList() {
  const [searchParams] = useSearchParams();

  const list = useMemo(() => {
    let all = [...data];

    const level = searchParams.getAll("level");
    const lang = searchParams.getAll("lang");
    const search = searchParams.get("search");

    if (level.length > 0) all = all.filter((i) => level.includes(i.levelId));

    if (lang.length > 0) all = all.filter((i) => lang.includes(i.langId));

    if (search && search.length > 0)
      all = all.filter(
        (i) =>
          i.title.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search)
      );

    return all.map((i) => ({
      ...i,
      tags: [i.level, i.lang],
      link: `/tutorials/${i.id}`,
    }));
  }, [searchParams]);

  return <List list={list} />;
}
