import type { NextPage } from "next";
import { useAppMachine } from "../src/app-machine.hook";
import styles from "../styles/app.module.css";

const Index: NextPage<{ code: string }> = ({ code }) => {
  const { context, Component, send, step } = useAppMachine(code);

  // console.log(context);

  return (
    <div className={styles.container}>
      {Component && <Component context={context} send={send} />}
    </div>
  );
};

Index.getInitialProps = async (context): Promise<{ code: string }> => {
  return {
    code: (context.query?.code ?? "") as string,
  };
};

export default Index;
