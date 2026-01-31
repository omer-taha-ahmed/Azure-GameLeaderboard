const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE || "GameLeaderboardDB";
const containerId = process.env.COSMOS_CONTAINER || "GameScores";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

module.exports = async function (context, req) {
    context.log('SubmitScore function triggered');

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        return;
    }

    try {
        const body = req.body || {};
        const { playerId, gameId, score, playerName } = body;

        // Validate required fields
        if (!playerId || !gameId || score === undefined || !playerName) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: false,
                    message: 'Missing required fields: playerId, gameId, score, playerName'
                })
            };
            return;
        }

        // Validate score range
        if (score < 0 || score > 999999) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: false,
                    message: 'Score must be between 0 and 999999'
                })
            };
            return;
        }

        const id = `${playerId}_${gameId}`;
        let previousScore = 0;
        let isNewRecord = true;

        // Check for existing score
        try {
            const { resource: existing } = await container.item(id, gameId).read();
            if (existing) {
                previousScore = existing.Score || 0;
                isNewRecord = false;

                // Only update if new score is higher
                if (score <= previousScore) {
                    context.res = {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: JSON.stringify({
                            success: true,
                            message: 'Previous score was higher - no update made',
                            currentScore: previousScore,
                            attemptedScore: score
                        })
                    };
                    return;
                }
            }
        } catch (err) {
            if (err.code !== 404) {
                throw err;
            }
            // 404 means no existing record - that's fine
        }

        // Save the new score
        const timestamp = Date.now();
        const scoreRecord = {
            id: id,
            PlayerId: playerId,
            GameId: gameId,
            Score: score,
            PlayerName: playerName,
            Timestamp: timestamp,
            SubmittedAt: new Date().toISOString()
        };

        await container.items.upsert(scoreRecord);

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                message: isNewRecord ? 'New score recorded!' : 'New personal best!',
                score: score,
                previousScore: previousScore,
                improvement: score - previousScore,
                isNewRecord: isNewRecord,
                timestamp: timestamp
            })
        };

    } catch (error) {
        context.log.error('Error in SubmitScore:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: error.message
            })
        };
    }
};
