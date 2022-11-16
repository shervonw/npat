import type { NextPage } from "next";
import { useAppMachine } from "../src/app-machine.hook";
import { AppContextProvider } from "../src/app.context";
import styles from "../styles/app.module.css";

const Index: NextPage<{ code: string }> = ({ code }) => {
  const { context, Component, send } = useAppMachine(code);

  return (
    <AppContextProvider>
      <div className={styles.container}>
        {Component && <Component context={context} send={send} />}
      </div>
    </AppContextProvider>
  );
};

Index.getInitialProps = async (context): Promise<{ code: string }> => {
  return {
    code: (context.query?.code ?? "") as string,
  };
};

export default Index;
