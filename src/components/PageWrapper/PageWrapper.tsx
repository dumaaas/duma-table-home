import { ReactElement } from "react";

type Props = {
  children: ReactElement;
  title: string;
};

const PageWrapper = ({ title, children }: Props) => {
  return (
    <div className="px-4 pb-4 flex flex-col gap-4 text-black">
      <h1 className="text-4xl font-bold">{title}</h1>
      <div className="overflow-hidden">{children}</div>
    </div>
  );
};

export default PageWrapper;
