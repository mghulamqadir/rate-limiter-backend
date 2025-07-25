const clientConfigs = new Map();
const requestLogs = new Map();

import { responseMapper } from "../lib/response-mapper.js";

export const configAdmin = (req, res) => {
    const { client_id, limit, window_seconds, priority } = req.body;
    const client = req.body
    if (!client_id || !limit || !window_seconds || !priority) {
        return responseMapper(res, 400, { error: 'Missing required fields' });
    }

    const validPriorities = ['high', 'medium', 'low'];
    if (!validPriorities.includes(priority)) {
        return responseMapper(res, 400, { error: 'Invalid priority' });
    }

    clientConfigs.set(client_id, {
        limit,
        window_seconds,
        priority
    });

    return responseMapper(res, 200, { data: client, message: 'Configuration Added successfully' });
}

export const getStatus = (req, res) => {
    const { client_id } = req.params;
    const clientConfig = clientConfigs.get(client_id);
    if (!clientConfig) {
        return res.status(404).json({ error: 'Client not found' });
    }

    const { limit, window_seconds } = clientConfig;
    const requestsInWindow = requestLogs.get(client_id) || 0;

    const timeLeft = window_seconds - (Date.now() - requestsInWindow);
    const status = {
        client_id,
        limit,
        requests_in_window: requestsInWindow,
        time_left: timeLeft > 0 ? timeLeft : 0,
        window_seconds
    };
    return responseMapper(res, 200, { data: status, message: 'Client status retrieved successfully' });
}

export const requestClient = (req, res) => {
    const { client_id } = req.params;
    const clientConfig = clientConfigs.get(client_id);
    if (!clientConfig) {
        return res.status(404).json({ error: 'Client not found' });
    }

    const { limit, window_seconds } = clientConfig;
    const requestsInWindow = requestLogs.get(client_id) || 0;

    const allowed = requestsInWindow < limit;
    const timeLeft = window_seconds - (Date.now() - requestsInWindow);

    if (!allowed) {
        return responseMapper(res, 429, { error: 'Rate limit exceeded' });
    }
    return responseMapper(res, 200, {
        allowed,
        client_id,
        requests_in_window: requestsInWindow,
        limit,
        window_seconds,
        time_left: timeLeft > 0 ? timeLeft : 0
    });
}
