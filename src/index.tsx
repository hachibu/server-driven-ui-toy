import * as React from "npm:react";
import { renderToReadableStream } from "npm:react-dom/server";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

//
// Database
//

const db = new DB("./src/index.db");

db.execute("DROP TABLE IF EXISTS components");

db.execute(`CREATE TABLE IF NOT EXISTS components (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT,
  props JSON
)`);

db.query("INSERT INTO components (type, props) VALUES (?, ?)", [
  "HelloComponent",
  JSON.stringify({
    "title": "Hello, Server-driven UI!",
    "buttonText": "Learn More",
    "buttonUrl": "https://github.com/hachibu/server-driven-ui-toy",
  }),
]);

//
// Backend
//

interface ServerComponent<T> {
  id: number;
  type: string;
  props: T;
}

interface HelloComponentProps {
  title: string;
  buttonText: string;
  buttonUrl: string;
}

function getServerComponent(): ServerComponent<HelloComponentProps> {
  const [[id, type, props]] = db.query("SELECT * from components");

  return {
    id,
    type,
    props: JSON.parse(props),
  };
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
