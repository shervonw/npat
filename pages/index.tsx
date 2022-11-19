import type { NextPage } from "next";
import { useAppMachine } from "../src/app-machine.hook";
import { useAppChannel } from "../src/app.hook";
import { useWakeLock } from "../src/wake-lock.hook";
import styles from "../styles/app.module.css";

const Index: NextPage<{ code: string }> = ({ code }) => {
  const { context, Component, send } = useAppMachine(code);

  useWakeLock();

  const { channel, isSubscribed, players } = useAppChannel({
    context,
    send,
  });

  return (
    <div className={styles.container}>
      {Component && (
        <Component
          channel={channel}
          context={context}
          isSubscribed={isSubscribed}
          players={players}
          send={send}
        />
      )}
    </div>
  );
};

Index.getInitialProps = async (context): Promise<{ code: string }> => {
  return {
    code: (context.query?.code ?? "") as string,
  };
};

export default Index;
