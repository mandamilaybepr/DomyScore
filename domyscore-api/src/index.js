export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/upload") {
      try {
        const body = await request.json();

        const response = await fetch(
          `https://api.github.com/repos/mandamilaybepr/DomyScore/actions/workflows/update-json.yml/dispatches`,
          {
            method: "POST",
            headers: {
              "Authorization": `token ${env.GITHUB_PAT}`,
              "Accept": "application/vnd.github.v3+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
            body: JSON.stringify({
              ref: "main",
              inputs: {
                new_data: JSON.stringify(body),
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`GitHub error: ${response.status}`);
        }

        return new Response(
          JSON.stringify({ success: true, message: "Action GitHub déclenchée !" }),
          { headers: { "Content-Type": "application/json" }, status: 200 }
        );
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          headers: { "Content-Type": "application/json" },
          status: 500,
        });
      }
    }

    return new Response("Cloudflare Worker actif 🚀", { status: 200 });
  },
};
