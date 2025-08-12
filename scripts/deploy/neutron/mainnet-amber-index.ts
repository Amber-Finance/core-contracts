import { taskRunner } from '../base/index-mainnet-amber.js'
import { neutronMainnetConfig } from './mainnet-amber-config.js'

void (async function () {
  await taskRunner({
    config: neutronMainnetConfig,
    label: 'deployer-owner',
  })
})()
