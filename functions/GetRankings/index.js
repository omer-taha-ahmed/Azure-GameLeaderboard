const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE || "GameLeaderboardDB";
const containerId = process.env.COSMOS_CONTAINER || "GameScores";

const client = new CosmosClient({ endpoint, key });
const container = client.database(databaseId).container(containerId);

module.exports = async function (context, req) {
    context.log('GetRankings function triggered');

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        return;
    }

    try {
        // Get gameId from query params
        let gameId = req.query.gameId || req.params.gameId || 'game001';
        const limit = parseInt(req.query.limit) || 100;

        context.log(`Fetching rankings for gameId: ${gameId}, limit: ${limit}`);

        // Query Cosmos DB for scores
        const querySpec = {
            query: "SELECT * FROM c WHERE c.GameId = @gameId ORDER BY c.Score DESC OFFSET 0 LIMIT @limit",
            parameters: [
                { name: "@gameId", value: gameId },
                { name: "@limit", value: limit }
            ]
        };

        const { resources: items } = await container.items.query(querySpec).fetchAll();

        // Format rankings
        const rankings = items.map((item, index) => ({
            rank: index + 1,
            playerId: item.PlayerId,
            playerName: item.PlayerName || 'Anonymous',
            score: item.Score,
            timestamp: item.Timestamp,
            submittedAt: item.SubmittedAt
        }));

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                gameId: gameId,
                totalPlayers: rankings.length,
                rankings: rankings,
                generatedAt: new Date().toISOString()
            })
        };

    } catch (error) {
        context.log.error('Error in GetRankings:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                message: 'Error fetching rankings',
                error: error.message
            })
        };
    }
};
