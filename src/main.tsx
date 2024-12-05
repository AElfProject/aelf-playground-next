import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./error-page";
import Editor from "@/components/workspace/editor";
import HelloWorld from './tutorials/hello-world.mdx';
import HelloWorldSolidity from './tutorials/hello-world-solidity.mdx';
import LotteryGame from './tutorials/lottery-game.mdx';
import Todo from './tutorials/todo.mdx';
import VoteContract from './tutorials/vote-contract.mdx';
import TicTacToeContract from './tutorials/tic-tac-toe.mdx';
import ExpenseTracker from './tutorials/expense-tracker.mdx';
import SinglePoolStaking from './tutorials/single-pool-staking.mdx';
import RoleContract from './tutorials/role.mdx';
import AllowanceContract from './tutorials/allowance.mdx';
import {Component as Tutorial} from './routes/tutorial';

const tutorials = [
  {
    path: 'hello-world',
    component: HelloWorld,
  },
  {
    path: 'hello-world-solidity',
    component: HelloWorldSolidity,
  },
  {
    path: 'lottery-game',
    component: LotteryGame,
  },
  {
    path: 'todo',
    component: Todo,
  },
  {
    path: 'vote-contract',
    component: VoteContract,
  },
  {
    path: 'tic-tac-toe',
    component: TicTacToeContract,
  },
  {
    path: 'expense-tracker',
    component: ExpenseTracker,
  },
  {
    path: 'single-pool-staking',
    component: SinglePoolStaking,
  },
  {
    path: 'role',
    component: RoleContract,
  },
  {
    path: 'allowance',
    component: AllowanceContract,
  },
]

const router = createBrowserRouter(createRoutesFromElements(<Route path="/" lazy={() => import('./routes/root')}>
  <Route path="" lazy={() => import('./routes/home')} errorElement={<ErrorPage />} />
  <Route path="workspaces" lazy={() => import('./routes/workspaces')} />
  <Route path="workspace/:id" lazy={() => import('./routes/workspace')}>
    <Route path="" element={<Editor />} />
  </Route>
  <Route path="tutorials" lazy={() => import('./routes/tutorials')} />
  {tutorials.map(({ path, component: Component }) => (
    <Route key={path} path={`tutorials/${path}`} lazy={() => import('./routes/workspace')}>
      <Route path="" element={<Tutorial><Component /></Tutorial>} />
    </Route>
  ))}
  <Route path="deployments" lazy={() => import('./routes/deployments')} />
  <Route path="settings" lazy={() => import('./routes/settings')} />
  <Route path="import" lazy={() => import('./routes/import')} />
  <Route path="share/:id" lazy={() => import('./routes/share')} />
</Route>));

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
