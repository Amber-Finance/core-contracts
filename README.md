# Smart contracts for Amber Finance

This repository contains the source code for the core smart contracts of Amber Finance. Smart contracts are meant to be compiled to `.wasm` files and uploaded to the Cosmos chains.

This is a fork of the Mars Protocol smart contracts, and should maintain sync with the original repository, to ensure new mars features or bug fixes can be easily ported to Amber.

## Audits

See reports for mars red-bank and rover [here][1].

## Bug bounty

A bug bounty is currently open for these contracts. See details [here][2].

## Verify contracts

### For contracts deployed on the Neutron chain

1. Install [Neutrond][3]

2. Get the wasm binary executable on your local machine.

   ```bash
   git clone https://github.com/amber-finance/core-contracts.git
   git checkout <commit-id>
   cargo make rust-optimizer
   ```

   Note: Intel/Amd 64-bit processor is required. While there is experimental ARM support for CosmWasm/rust-optimizer, it's discouraged to use in production and the wasm bytecode will not match up to an Intel compiled wasm file.

3. Download the wasm from the chain.

   ```bash
   osmosisd query wasm code $CODEID -- $NODE download.wasm
   ```

4. Verify that the diff is empty between them. If any value is returned, then the wasm files differ.

   ```bash
   diff artifacts/$CONTRACTNAME.wasm download.wasm
   ```

5. Alternatively, compare the wasm files' checksums:

   ```bash
   sha256sum artifacts/$CONTRACTNAME.wasm download.wasm
   ```

## Environment set up

- Install [cargo-make][4]

  ```bash
  cargo install --force cargo-make
  ```

- Install [rust][5]

  ```bash
  cargo make install-stable
  ```

- Install [Docker][6]

- Install [Node.js v16][7]

- Install [Yarn][8]

- Create the build folder:

   ```bash
   cd scripts
   yarn
   yarn build
   ```

- Compile all contracts:

  ```bash
  cargo make rust-optimizer
  ```

- Formatting:

   ```bash
   cd scripts
   yarn format
   yarn lint
   ```

This compiles and optimizes all contracts, storing them in `/artifacts` directory along with `checksum.txt` which contains sha256 hashes of each of the `.wasm` files (The script just uses CosmWasm's [rust-optimizer][9]).

**Note:** Intel/Amd 64-bit processor is required. While there is experimental ARM support for CosmWasm/rust-optimizer, it's discouraged to use in production.

## Deployment

When the deployment scripts run for the first time, it will upload code IDs for each contract, instantiate each contract, initialize assets, and set oracles. If you want to redeploy, you must locally delete the file with `.json` extension (e.g. `devnet-deployer-owner.json`) in the artifacts directory.

Everything related to deployment must be ran from the `scripts` directory.

Each outpost has a config file for its respective deployment and assets.

For Osmosis:

```bash
cd scripts

# for devnet deployment with deployerAddr set as owner & admin:
yarn deploy:neutron-devnet

# for mainnet deployment:
yarn deploy:neutron-mainnet
```

## Schemas

```bash
cargo make --makefile Makefile.toml generate-all-schemas
```

Creates JSON schema files for relevant contract calls, queries and query responses (See: [cosmwams-schema][10]).

## Linting

`rustfmt` is used to format any Rust source code:

```bash
cargo make fmt
```

`clippy` is used as a linting tool:

```bash
cargo make clippy
```

## Testing

Install [Go][17]. It is used by [neutron-test-tube][18] dependency.

Integration tests (task `integration-test` or `test`) use `.wasm` files. They have to be generated with `cargo make build`.

Run unit tests:

```bash
cargo make unit-test
```

Run integration tests:

```bash
cargo make integration-test
```

Run all tests:

```bash
cargo make test
```

## Deployments

### neutron-1

| Contract                  | Address                                                                    | Tag
| ------------------------- | -------------------------------------------------------------------------- | --------------
| mars-address-provider     | [`neutron1n6m2ykuq9w83a9kq2p6dr4202dcxjpz7a2hwutw5rk4n9kwqmdxsad65pd`][11] | [`v2.3.0`][35] |
| mars-account-nft          | [`neutron1nl8d943u3k8lext62c2vplsmpr257zmfdd2mwvegc77xfjy5w0qq5zqc6e`][26] | [`v2.2.0`][31] |
| mars-credit-manager       | [`neutron1et4xza4pge3asumk8yxdx6qm85k9eplk0kathtkheln6znxsqheqfytsza`][27] | [`v2.3.0`][35] |
| mars-health               | [`neutron17dy4j4rt9pw497mfpkd5gghw8q63kjyrd26h9yc2ugfwqke8x33stfmwrz`][28] | [`v2.2.0`][31] |
| mars-incentives           | [`neutron1u9eg2njpcvdprtes8s78hwddayrxzgw9akkjpxx0umr0awvapxrshmjlsd`][12] | [`v2.2.0`][31] |
| mars-oracle               | [`neutron18l6cfm34qng2h9cvl3mxfw9zck9j5awv9jen4sa4f67x6t98y47s9vmuye`][13] | [`v2.2.3`][34] |
| mars-params               | [`neutron1y2hjwse8sq77gvsmcy8gm6kjye6a3g9ksyxdjg99ceg3rmlpq5usyv5n07`][29] | [`v2.3.0`][35] |
| mars-perps                | [`neutron1g3catxyv0fk8zzsra2mjc0v4s69a7xygdjt85t54l7ym3gv0un4q2xhaf6`][32] | [`v2.2.3`][34] |
| mars-red-bank             | [`neutron1k8xyccg9nvfavagqjsqngh66w4z286utqweswl4txtnewaymkc9ss5f5e8`][14] | [`v2.3.0`][35] |
| mars-rewards-collector    | [`neutron1h4l6rvylzcuxwdw3gzkkdzfjdxf4mv2ypfdgvnvag0dtz6x07gps6fl2vm`][15] | [`v2.2.0`][31] |
| mars-swapper              | [`neutron1ratz633muu96er3wn7kx5hzty8zdg5d8maqduykesun30ddcseeqceyhfl`][16] | [`v2.3.0`][35] |
| mars-zapper               | [`neutron1595ht54wjekzku0k4z2a485072ntr9cwdr5d3y5qc4qv59y2pmsqmsg6aw`][30] | [`v2.2.3`][34] |

## License

This project is licensed under the Functional Source License, Version 1.1, Apache 2.0 Future License (FSL-1.1-Apache-2.0).

Key points:
- You can use, copy, modify, and redistribute this software for any purpose other than a Competing Use as defined in the license.
- On the second anniversary of the date we made this software available, it will also become available under the Apache License, Version 2.0.

For full terms and conditions, see the [LICENSE](./LICENSE) file.

[1]: https://github.com/mars-protocol/mars-audits
[2]: https://immunefi.com/bounty/mars/
[3]: https://github.com/neutron-org/neutron
[4]: https://github.com/sagiegurari/cargo-make
[5]: https://rustup.rs/
[6]: https://docs.docker.com/get-docker/
[7]: https://github.com/nvm-sh/nvm
[8]: https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable
[9]: https://github.com/CosmWasm/rust-optimizer
[10]: https://github.com/CosmWasm/cosmwasm/tree/main/packages/schema
[11]: https://neutron.celat.one/neutron-1/contracts/neutron1n6m2ykuq9w83a9kq2p6dr4202dcxjpz7a2hwutw5rk4n9kwqmdxsad65pd
[12]: https://neutron.celat.one/neutron-1/contracts/neutron1u9eg2njpcvdprtes8s78hwddayrxzgw9akkjpxx0umr0awvapxrshmjlsd
[13]: https://neutron.celat.one/neutron-1/contracts/neutron18l6cfm34qng2h9cvl3mxfw9zck9j5awv9jen4sa4f67x6t98y47s9vmuye
[14]: https://neutron.celat.one/neutron-1/contracts/neutron1k8xyccg9nvfavagqjsqngh66w4z286utqweswl4txtnewaymkc9ss5f5e8
[15]: https://neutron.celat.one/neutron-1/contracts/neutron1h4l6rvylzcuxwdw3gzkkdzfjdxf4mv2ypfdgvnvag0dtz6x07gps6fl2vm
[16]: https://neutron.celat.one/neutron-1/contracts/neutron1ratz633muu96er3wn7kx5hzty8zdg5d8maqduykesun30ddcseeqceyhfl
[17]: https://go.dev/
[18]: https://github.com/neutron-org/neutron-test-tube
[19]: https://github.com/mars-protocol/contracts/releases/tag/v2.0.0
[20]: https://github.com/mars-protocol/contracts/releases/tag/v2.0.1
[21]: https://github.com/mars-protocol/rover/releases/tag/v2.0.0
[22]: https://github.com/mars-protocol/contracts/releases/tag/v2.0.3
[23]: https://github.com/mars-protocol/contracts/releases/tag/v2.0.4
[24]: https://github.com/mars-protocol/contracts/releases/tag/v2.0.5
[25]: https://github.com/mars-protocol/contracts/releases/tag/v2.0.7
[26]: https://neutron.celat.one/neutron-1/contracts/neutron1nl8d943u3k8lext62c2vplsmpr257zmfdd2mwvegc77xfjy5w0qq5zqc6e
[27]: https://neutron.celat.one/neutron-1/contracts/neutron1et4xza4pge3asumk8yxdx6qm85k9eplk0kathtkheln6znxsqheqfytsza
[28]: https://neutron.celat.one/neutron-1/contracts/neutron17dy4j4rt9pw497mfpkd5gghw8q63kjyrd26h9yc2ugfwqke8x33stfmwrz
[29]: https://neutron.celat.one/neutron-1/contracts/neutron1y2hjwse8sq77gvsmcy8gm6kjye6a3g9ksyxdjg99ceg3rmlpq5usyv5n07
[30]: https://neutron.celat.one/neutron-1/contracts/neutron1595ht54wjekzku0k4z2a485072ntr9cwdr5d3y5qc4qv59y2pmsqmsg6aw
[31]: https://github.com/mars-protocol/core-contracts/releases/tag/v2.2.0-perps
[32]: https://neutron.celat.one/neutron-1/contracts/neutron1g3catxyv0fk8zzsra2mjc0v4s69a7xygdjt85t54l7ym3gv0un4q2xhaf6
[33]: https://github.com/mars-protocol/core-contracts/releases/tag/v2.2.1-perps
[34]: https://github.com/mars-protocol/core-contracts/releases/tag/v2.2.3-perps
[35]: https://github.com/mars-protocol/core-contracts/releases/tag/v2.3.0-perps