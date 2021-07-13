-- Issue #171

ALTER TABLE transfer_fees
  ADD token_amount_usd numeric NOT NULL DEFAULT 0,
  ADD total_fee_usd numeric NOT NULL DEFAULT 0

-- add default value for column total_fee_usd, token_amount_usd
UPDATE transfer_fees SET total_fee_usd=b.token_amount
FROM (SELECT id, token_amount FROM transfer_fees) AS b
WHERE transfer_fees.id=b.id

UPDATE transfer_fees SET token_amount_usd=b.token_amount
FROM (SELECT id, token_amount FROM transfer_fees) AS b
WHERE transfer_fees.id=b.id


ALTER TABLE transactions
  ADD total_volume numeric(100,6) NOT NULL DEFAULT 0,