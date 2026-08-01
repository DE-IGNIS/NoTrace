/**
 * server.js — NoTrace Backend Entry Point
 *
 * Privacy policy enforced at the server level:
 *  - NO request logging middleware (morgan removed)
 *  - NO IP address storage
 *  - NO analytics or telemetry
 *  - Zero persistence of user data
 */

'use strict';

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const compression = require('compression');

const proxyRoutes = require('./routes/proxyRoutes');

const app = express();

// ── Security headers (helmet sets sane defaults) ─────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
// React Native WebView requests arrive without an Origin header, so we accept
// all origins here. Restrict CORS_ORIGIN in .env when deploying to production.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
  })
);

// ── Compression ───────────────────────────────────────────────────────────────
app.use(compression());

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check — no sensitive data exposed
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'NoTrace proxy server is running.' });
});

// Privacy proxy — all filtering applied inside the router
app.use('/api/proxy', proxyRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'not_found', message: 'Route not found.' });
});

// ── Global error handler ──────────────────────────────────────────────────────
// Deliberately terse — no request details are exposed or logged
app.use((err, _req, res, _next) => {
  res.status(500).json({ error: 'internal_error', message: 'An unexpected error occurred.' });
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 NoTrace proxy server running on http://localhost:${PORT}`);
  console.log(`   Proxy endpoint : POST/GET http://localhost:${PORT}/api/proxy`);
  console.log(`   Health check   : GET  http://localhost:${PORT}/api/health`);
});
