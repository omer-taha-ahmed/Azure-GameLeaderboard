const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE || "GameLeaderboardDB";
const containerId = process.env.COSMOS_CONTAINER || "GameScores";

const client = new CosmosClient({ endpoint, key });
const container = client.database(databaseId).container(containerId);

module.exports = async function (context, req) {
    context.log('GetPlayerStats function triggered');

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
        // Get playerId from query params
        let playerId = req.query.playerId || req.params.playerId;

        if (!playerId) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: false,
                    message: 'playerId is required'
                })
            };
            return;
        }

        context.log(`Fetching stats for playerId: ${playerId}`);

        // Query all games for this player
        const querySpec = {
            query: "SELECT * FROM c WHERE c.PlayerId = @playerId",
            parameters: [
                { name: "@playerId", value: playerId }
            ]
        };

        const { resources: games } = await container.items.query(querySpec).fetchAll();

        if (games.length === 0) {
            context.res = {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: false,
                    message: 'Player not found'
                })
            };
            return;
        }

        // Calculate statistics
        const scores = games.map(g => g.Score);
        const totalScore = scores.reduce((a, b) => a + b, 0);

        const playerStats = {
            playerId: playerId,
            playerName: games[0].PlayerName,
            stats: {
                totalGames: games.length,
                totalScore: totalScore,
                averageScore: Math.round(totalScore / games.length),
                bestScore: Math.max(...scores),
                worstScore: Math.min(...scores)
            },
            gameHistory: games.map(g => ({
                gameId: g.GameId,
                score: g.Score,
                timestamp: g.Timestamp,
                submittedAt: g.SubmittedAt
            })).sort((a, b) => b.timestamp - a.timestamp) // Most recent first
        };

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                player: playerStats,
                generatedAt: new Date().toISOString()
            })
        };

    } catch (error) {
        context.log.error('Error in GetPlayerStats:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                message: 'Error fetching player stats',
                error: error.message
            })
        };
    }
};
