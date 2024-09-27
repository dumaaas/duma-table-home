import { ReactElement } from "react";

type Props = {
  children: ReactElement;
};
const Content = ({ children }: Props) => {
  return <div className="w-full bg-gray-300 h-full pt-20">{children}</div>;
};

export default Content;
