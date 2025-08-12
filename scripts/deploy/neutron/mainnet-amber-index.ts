import { taskRunner } from '../base/index-mainnet-amber.js'
import { neutronMainnetConfig } from './mainnet-amber-config.js'

void (async function () {
  await taskRunner({
    config: {
      ...neutronMainnetConfig,
    multisigAddr: 'neutron1ld67026gdnq4x2uyddhcdrtesxh0sypummyv9hsslm8es8yej8fqct70qj',
    },
    label: 'multisig-owner',
  })
})()
