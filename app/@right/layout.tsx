import TopBottom from "@/components/top-bottom";
import { ReactNode } from "react";

export default function Right(props: { top: ReactNode; bottom: ReactNode }) {
  return <TopBottom {...props} />;
}
