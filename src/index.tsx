import * as React from "npm:react";
import { renderToReadableStream } from "npm:react-dom/server";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

//
// Backend
//

interface ServerComponent<T> {
  type: string;
  props: T;
}

interface HelloComponentProps {
  title: string;
  buttonText: string;
  buttonUrl: string;
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

async function renderServerComponent(): Promise<ReadableStream> {
  const { type, props } = getServerComponent();
  const ClientComponent = CLIENT_COMPONENTS[type];

  return await renderToReadableStream(
    <ClientComponent {...props}></ClientComponent>,
  );
}

async function requestHandler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return new Response(
      await renderServerComponent(),
      { headers: { "Content-Type": "text/html" } },
    );
  }

  return new Response("Not Found", { status: 404 });
}

if (import.meta.main) {
  await serve(requestHandler);
}
