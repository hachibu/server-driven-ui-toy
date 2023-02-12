import * as React from "npm:react";
import { renderToString } from "npm:react-dom/server";

//
// Shared Types
//

type ComponentType = "HelloComponent";

interface HelloComponentProps {
  title: string;
  buttonText: string;
  buttonOnClickUrl: string;
}

//
// Server
//

interface ServerComponent<T> {
  type: ComponentType;
  props: T;
}

function getServerComponent(): ServerComponent<HelloComponentProps> {
  return JSON.parse(Deno.readTextFileSync("./src/db.json"));
}

//
// Client
//

const CLIENT_COMPONENTS: Record<string, ReturnType<React.Component>> = {
  HelloComponent({ title, buttonText, buttonOnClickUrl }: HelloComponentProps) {
    const handleButtonClick = () => window.location.assign(buttonOnClickUrl);

    return (
      <div>
        <h1>{title}</h1>
        <button onClick={handleButtonClick}>{buttonText}</button>
      </div>
    );
  },
};

function main() {
  const { type, props } = getServerComponent();
  const ClientComponent = CLIENT_COMPONENTS[type];

  return renderToString(
    <ClientComponent {...props}></ClientComponent>,
  );
}

if (import.meta.main) {
  console.log(main());
}
