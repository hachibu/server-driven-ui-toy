import * as React from "npm:react";
import { renderToString } from "npm:react-dom/server";

//
// Server
//

interface ServerComponent {
  type: string;
  props: Record<string, string>;
}

function getServerComponent(): ServerComponent {
  return {
    type: "HelloComponent",
    props: {
      subject: "Server-Driven UI",
    },
  };
}

//
// Client
//

const CLIENT_COMPONENTS: Record<string, ReturnType<React.Component>> = {
  HelloComponent({ subject }: ServerComponent["props"]) {
    return <div>Hello {subject}</div>;
  },
};

function getClientComponentByType(type: string) {
  return CLIENT_COMPONENTS[type];
}

//
// Main
//

function main() {
  const { type, props } = getServerComponent();
  const ClientComponent = getClientComponentByType(type);

  return renderToString(<ClientComponent {...props}></ClientComponent>);
}

if (import.meta.main) {
  console.log(main());
}
