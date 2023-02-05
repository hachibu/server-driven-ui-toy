import * as React from "npm:react";
import * as ReactDOMServer from "npm:react-dom/server";

interface ServerComponent {
  type: string
}

async function getServerComponent(): ServerComponent {
  return {
    subject: "Server-Driven UI"
  }
}

function HelloComponent({ subject }: ServerComponent) {
  return <div>Hello {subject}</div>;
}

async function main() {
  const res = await getServerComponent()

  const html = ReactDOMServer.renderToString(
    <HelloComponent subject={res.subject}></HelloComponent>,
  );
  console.log(html);
}

if (import.meta.main) await main();
