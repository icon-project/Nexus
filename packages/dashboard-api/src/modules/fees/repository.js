'use strict';

const { logger, pgPool } = require('../../common');

async function getAuctionById(auctionId) {
  const query = 'SELECT * FROM auctions WHERE id=$1';
  const values = [auctionId];

  try {
    const { rows } = await pgPool.query(query, values);

    if (rows.length > 0) {
      const auction = {
        id: rows[0].id,
        tokenName: rows[0].token_name,
        tokenAmount: Number(rows[0].token_amount),
        bidder: rows[0].bidder_address,
        winner: rows[0].winner_address,
        bidAmount: Number(rows[0].bid_amount),
        winAmount: rows[0].winner_bid_amount ? Number(rows[0].winner_bid_amount) : null,
        txHash: rows[0].tx_hash,
        txHashEnded: rows[0].tx_hash_ended,
        endTime: rows[0].end_time,
        createdTime: rows[0].created_time,
        updatedTime: rows[0].updated_time
      };

      return auction;
    }
  } catch (error) {
    logger.error(`getAuctionById fails with auction ID ${auctionId}`, { error });
    throw error;
  }
}

async function getBidByAuctionId(auctionId) {
  const query = 'SELECT * FROM bids WHERE auction_id=$1 ORDER BY created_time';
  const values = [auctionId];

  try {
    const { rows } = await pgPool.query(query, values);

    if (rows.length > 0) {
      const bids = [];

      for (const row of rows) {
        bids.push({
          id: row.id,
          auctionId: row.auction_id,
          tokenName: row.token_name,
          currentBidder: row.current_bidder_address,
          currentBidAmount: Number(row.current_bid_amount),
          newBidder: row.new_bidder_address,
          newBidAmount: Number(row.new_bid_amount),
          txHash: row.tx_hash,
          createdTime: row.created_time
        });
      }

      return bids;
    }
  } catch (error) {
    logger.error(`getBidByAuctionId fails with auction ID ${auctionId}`, { error });
    throw error;
  }

  return [];
}

module.exports = {
  getAuctionById,
  getBidByAuctionId
};
