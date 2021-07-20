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

-- Issue #168

ALTER TABLE minted_tokens
DROP COLUMN delete_at,
DROP COLUMN update_at,
DROP COLUMN total_amount_usd,
ADD COLUMN total_token_amount numeric NOT NULL DEFAULT 0, 
ALTER COLUMN create_at SET DATA TYPE timestamp without time zone USING to_timestamp(create_at);

-- Issue #153
ALTER TABLE transactions
ALTER COLUMN create_at SET DATA TYPE timestamp without time zone USING to_timestamp(create_at),
ALTER COLUMN update_at SET DATA TYPE timestamp without time zone USING to_timestamp(update_at);

-- Issue #170
CREATE TABLE public.relay_rewards (
    created_time timestamp without time zone NOT NULL,
    id character varying(100) NOT NULL,
    relay_id character varying(100) NOT NULL,
    reward_value numeric NOT NULL,
    update_time timestamp without time zone
);

ALTER TABLE ONLY public.relay_rewards
    ADD CONSTRAINT relay_rewards_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.relay_rewards
    ADD CONSTRAINT relay_rewards_relay_id_fkey FOREIGN KEY (relay_id) REFERENCES public.relay_candidates(id);
