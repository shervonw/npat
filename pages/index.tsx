import type { NextPage } from "next";
import { useAppMachine } from "../src/app-machine.hook";

const Index: NextPage<{ code: string }> = ({ code }) => {
  const { context, Component, send } = useAppMachine(code);

  return <div>{Component && <Component context={context} send={send} />}</div>;
};

Index.getInitialProps = async (context): Promise<{ code: string }> => {
  return {
    code: (context.query?.code ?? "") as string,
  };
};

export default Index;
