/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker.
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = '82ef9b96d8393b6da34527d1d6e19187'
const bypassHeaderName = 'x-msw-bypass'
const activeClientIds = new Set()

self.addEventListener('install', function () {
    return self.skipWaiting()
})

self.addEventListener('activate', function (event) {
    return self.clients.claim()
})

self.addEventListener('message', async function (event) {
    const clientId = event.source.id

    if (!clientId || !self.clients) {
        return
    }

    const client = await self.clients.get(clientId)

    if (!client) {
        return
    }

    const allClients = await self.clients.matchAll()

    switch (event.data) {
        case 'KEEPALIVE_REQUEST': {
            sendToClient(client, {
                type: 'KEEPALIVE_RESPONSE',
            })
            break
        }

        case 'INTEGRITY_CHECK_REQUEST': {
            sendToClient(client, {
                type: 'INTEGRITY_CHECK_RESPONSE',
                payload: INTEGRITY_CHECKSUM,
            })
            break
        }

        case 'MOCK_ACTIVATE': {
            activeClientIds.add(clientId)

            sendToClient(client, {
                type: 'MOCK_ENABLED',
                payload: true,
            })
            break
        }

        case 'MOCK_DEACTIVATE': {
            activeClientIds.delete(clientId)
            break
        }

        case 'CLIENT_CLOSED': {
            activeClientIds.delete(clientId)

            const remainingClients = allClients.filter((client) => {
                return client.id !== clientId
            })

            // Unregister itself when there are no more clients
            if (remainingClients.length === 0) {
                self.registration.unregister()
            }

            break
        }
    }
})

// Resolve the "master" client for the given event.
async function resolveMainClient(event) {
    const client = await self.clients.get(event.clientId)

    if (client.frameType === 'top-level') {
        return client
    }

    const allClients = await self.clients.matchAll()

    return allClients
        .filter((client) => {
            return client.types.includes('window')
        })
        .find((client) => {
            return client.frameType === 'top-level'
        })
}

async function handleRequest(event, requestId) {
    const client = await resolveMainClient(event)
    const response = await getResponse(event, client, requestId)

    if (response) {
        sendToClient(client, response, requestId)
    }
}

async function getResponse(event, client, requestId) {
    const { request } = event

    if (request.method === 'OPTIONS') {
        return {
            type: 'RESPONSE',
            payload: null,
            status: 200,
            statusText: 'OK',
            headers: new Headers({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
            }),
        }
    }

    const clonedRequest = request.clone()

    function passthrough() {
        const headers = Object.fromEntries(clonedRequest.headers.entries())

        if (headers[bypassHeaderName] === 'true') {
            return {
                type: 'PASSTHROUGH',
                payload: null,
            }
        }

        return {
            type: 'PASSTHROUGH',
            payload: fetch(clonedRequest),
        }
    }

    if (!client) {
        return passthrough()
    }

    if (!activeClientIds.has(client.id)) {
        return passthrough()
    }

    const requestBuffer = await request.arrayBuffer()
    const clientMessage = await sendToClient(client, {
        type: 'REQUEST',
        payload: {
            id: requestId,
            url: request.url,
            method: request.method,
            headers: Object.fromEntries(request.headers.entries()),
            cache: request.cache,
            mode: request.mode,
            credentials: request.credentials,
            destination: request.destination,
            integrity: request.integrity,
            redirect: request.redirect,
            referrer: request.referrer,
            referrerPolicy: request.referrerPolicy,
            body: requestBuffer,
            keepalive: request.keepalive,
        },
    })

    switch (clientMessage.type) {
        case 'MOCK_RESPONSE': {
            return clientMessage.payload
        }

        case 'PASSTHROUGH': {
            return passthrough()
        }
    }

    return passthrough()
}

function sendToClient(client, message, transferrables = []) {
    return new Promise((resolve) => {
        const channel = new MessageChannel()

        channel.port1.onmessage = (event) => {
            resolve(event.data)
        }

        client.postMessage(
            message,
            [channel.port2].concat(transferrables.filter(Boolean)),
        )
    })
}

self.addEventListener('fetch', function (event) {
    const { request } = event

    if (request.url.startsWith(self.location.origin)) {
        return
    }

    const requestId = uuidv4()

    event.respondWith(
        handleRequest(event, requestId).catch((error) => {
            console.error(
                '[MSW] Failed to mock a "%s" request to "%s": %s',
                request.method,
                request.url,
                error,
            )
        }),
    )
})

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0
        const v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}