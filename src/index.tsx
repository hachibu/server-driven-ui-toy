import * as React from "npm:react";
import { renderToReadableStream } from "npm:react-dom/server";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

//
// Backend
//

type ComponentType = "HelloComponent";

interface HelloComponentProps {
  title: string;
  buttonText: string;
  buttonUrl: string;
}

interface ServerComponent<T> {
  type: ComponentType;
  props: T;
}

function getServerComponent(): ServerComponent<HelloComponentProps> {
  return JSON.parse(Deno.readTextFileSync("./src/database.json"));
}

//
// Server-side Rendered (SSR) Client
//

const CLIENT_COMPONENTS = {
  HelloComponent({ title, buttonText, buttonUrl }: HelloComponentProps) {
    return (
      <>
        <h1>{title}</h1>
        <button>
          <a href={buttonUrl}>{buttonText}</a>
        </button>
      </>
    );
  },
};

function getClientComponent(type: string) {
  return CLIENT_COMPONENTS[type];
}

async function renderServerComponent(): Promise<ReadableStream> {
  const serverComponent = getServerComponent();
  const ClientComponent = getClientComponent(serverComponent.type);

  return await renderToReadableStream(
    <ClientComponent {...serverComponent.props}></ClientComponent>,
  );
}

await serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return new Response(
      await renderServerComponent(),
      { headers: { "Content-Type": "text/html" } },
    );
  }

  return new Response("Not Found", { status: 404 });
});
