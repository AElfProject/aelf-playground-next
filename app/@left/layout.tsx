import TopBottom from "@/components/top-bottom";
import { ReactNode } from "react";

export default function Left(props: { top: ReactNode; bottom: ReactNode }) {
  return <TopBottom {...props} />;
}
