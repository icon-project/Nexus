#!/bin/bash
# chmod +x cmc_conversion.sh

COIN_MARKET_CAP_URL=https://sandbox-api.coinmarketcap.com/v1 \
COIN_MARKET_CAP_KEY=b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c \
POSTGRES_DB_URL=postgresql://postgres:test123@localhost:5432/postgres \
node cmc_conversion.js > cmc_conversion.log
