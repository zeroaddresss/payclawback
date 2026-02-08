const server = Bun.serve({
  port: 18790,
  fetch() {
    return new Response(null, {
      status: 301,
      headers: { Location: "https://ubuntu-4gb-nbg1-2.tail8913bc.ts.net/" },
    });
  },
});
console.log(`Redirect server on port ${server.port}`);
