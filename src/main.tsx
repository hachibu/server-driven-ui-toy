import * as React from "npm:react";
import { renderToString } from "npm:react-dom/server";

//
// Server
//

type ComponentType = "HelloComponent";

interface HelloComponentProps {
  title: string;
  buttonText: string;
  buttonOnClickUrl: string;
}

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

const CLIENT_COMPONENTS = {
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

function getClientComponentByType(type: string) {
  return CLIENT_COMPONENTS[type];
}

function render() {
  const serverComponent = getServerComponent();
  const ClientComponent = getClientComponentByType(serverComponent.type);

  return renderToString(
    <ClientComponent {...serverComponent.props}></ClientComponent>,
  );
}

if (import.meta.main) {
  console.log(render());
}
