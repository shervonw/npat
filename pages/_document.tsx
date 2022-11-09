import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap"
          rel="stylesheet"
          type="text/css"
        />

        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />

        <meta
          name="description"
          content="Play Name, Place, Animal, Thing online with friends!"
        ></meta>

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://npat-theta.vercel.app/"
        />
        <meta
          property="og:title"
          content="Name, Place, Animal, Thing | Online Multiplayer Game"
        />
        <meta
          property="og:description"
          content="Play 'Name, Place, Animal, Thing' online with friends! The iconic game has moved from our school notebooks to the online world. You can add additional categories besides name, place, animal and thing. Play with up to 10 of your friends online, from anywhere in the world!"
        />
        <meta
          property="og:image"
          content="%PUBLIC_URL%/share_image.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://npat-theta.vercel.app"
        />
        <meta
          property="twitter:title"
          content="Name, Place, Animal, Thing | Online Multiplayer Game"
        />
        <meta
          property="twitter:description"
          content="Play 'Name, Place, Animal, Thing' online with friends! The iconic game has moved from our school notebooks to the online world. You can add additional categories besides name, place, animal and thing. Play with up to 10 of your friends online, from anywhere in the world!"
        />
        <meta
          property="twitter:image"
          content="%PUBLIC_URL%/share_image.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
