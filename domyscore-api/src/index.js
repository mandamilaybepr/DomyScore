export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

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
              "User-Agent": "domyscore-api-worker/1.0", // Ajout de l'en-tête User-Agent
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
          const errorText = await response.text();
          throw new Error(`GitHub error: ${response.status}, Details: ${errorText}`);
        }

        return new Response(
          JSON.stringify({ success: true, message: "Action GitHub déclenchée !" }),
          { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 200 }
        );
      } catch (err) {
        console.error('Worker Error:', err.message);
        return new Response(JSON.stringify({ error: err.message }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 500,
        });
      }
    }

    return new Response("Cloudflare Worker actif 🚀", { headers: corsHeaders, status: 200 });
  },
};