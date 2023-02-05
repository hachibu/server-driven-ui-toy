import * as React from "npm:react";
import * as ReactDOMServer from "npm:react-dom/server";

interface ServerComponent {
  type: string
  props: Record<string, string>
}

function getServerComponent(): ServerComponent {
  return {
    type: 'HelloComponent',
    props: {
      subject: "Server-Driven UI"
    }
  }
}

function HelloComponent({ subject }: ServerComponent['props']) {
  return <div>Hello {subject}</div>;
}

function main() {
  const serverComponent = getServerComponent()

  let clientComponent;
  switch (serverComponent.type) {
    case 'HelloComponent':
      clientComponent = <HelloComponent {...serverComponent.props}></HelloComponent>
      break
  }

  console.log(ReactDOMServer.renderToString(clientComponent))
}

if (import.meta.main) main();
