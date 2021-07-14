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

-- Issue #167
ALTER TABLE transactions
  ADD total_volume numeric NOT NULL DEFAULT 0
  
-- Issue #33

ALTER TABLE networks
DROP COLUMN delete_at,
ADD COLUMN native_token character varying(100);

ALTER TABLE networks
ALTER COLUMN create_at SET DATA TYPE timestamp without time zone USING to_timestamp(create_at),
ALTER COLUMN update_at SET DATA TYPE timestamp without time zone USING to_timestamp(update_at);
