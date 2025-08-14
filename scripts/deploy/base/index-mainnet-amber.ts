import { setupDeployer } from './setup-deployer'
import { printGreen, printRed, printYellow } from '../../utils/chalk'
import { DeploymentConfig } from '../../types/config'
import { wasmFile } from '../../utils/environment'

export interface TaskRunnerProps {
  config: DeploymentConfig
  label: string
}

export const taskRunner = async ({ config, label }: TaskRunnerProps) => {
  const deployer = await setupDeployer(config, label)

  try {

    // Set our rewards collector as the protocol admin
    deployer.storage.addresses.rewardsCollector = config.protocolAdminAddr

    await deployer.assertDeployerBalance()


    // Upload contracts
    await deployer.upload('redBank', wasmFile('mars_red_bank'))
    await deployer.upload('addressProvider', wasmFile('mars_address_provider'))
    await deployer.upload('incentives', wasmFile('mars_incentives'))
    await deployer.upload('oracle', wasmFile(`mars_oracle_${config.oracle.name}`))
    // await deployer.upload(
    //   'rewardsCollector',
    //   wasmFile(`mars_rewards_collector_${config.rewardsCollector.name}`),
    // )
    await deployer.upload('swapper', wasmFile(`mars_swapper_${config.swapper.name}`))
    await deployer.upload('dualitySwapper', wasmFile(`mars_swapper_${config.dualitySwapper?.name}`))
    await deployer.upload('params', wasmFile(`mars_params`))
    await deployer.upload('accountNft', wasmFile('mars_account_nft'))
    await deployer.upload('mockVault', wasmFile('mars_mock_vault'))
    await deployer.upload('zapper', wasmFile(config.zapperContractName))
    await deployer.upload('creditManager', wasmFile('mars_credit_manager'))
    await deployer.upload('health', wasmFile('mars_rover_health'))
    await deployer.upload('perps', wasmFile('mars_perps'))

    // Instantiate contracts
    await deployer.instantiateAddressProvider()
    await deployer.instantiateRedBank()
    await deployer.instantiateIncentives()
    await deployer.instantiateOracle(config.oracle.customInitParams)
    // await deployer.instantiateRewards()
    await deployer.instantiateSwapper()
    await deployer.instantiateDualitySwapper()
    await deployer.instantiateParams()
    await deployer.instantiateMockVault()
    await deployer.instantiateZapper()
    await deployer.instantiateHealthContract()
    await deployer.instantiateCreditManager()
    await deployer.instantiateNftContract()
    await deployer.instantiatePerps()
    await deployer.setConfigOnHealthContract()
    await deployer.transferNftContractOwnership()
    await deployer.setConfigOnCreditManagerContract()
    await deployer.saveDeploymentAddrsToFile(label)

    await deployer.updateAddressProvider()

    if (config.swapper.name == 'astroport') {
      await deployer.updateSwapperAstroportConfig(config.astroportConfig!)
      await deployer.setAstroportIncentivesAddress(config.astroportConfig!.incentives!)
    }

    if (config.multisigAddr) {
          await deployer.updateIncentivesContractOwner()
          await deployer.updateRedBankContractOwner()
          await deployer.updateOracleContractOwner()
          await deployer.updateRewardsContractOwner()
          await deployer.updateSwapperContractOwner()
          await deployer.updateParamsContractOwner()
          await deployer.updateAddressProviderContractOwner()
          await deployer.updateCreditManagerOwner()
          await deployer.updateHealthOwner()
          printGreen('It is confirmed that all contracts have transferred ownership to the Multisig')
        } else {
          printGreen('Owner remains the deployer address.')
        }

    

    await deployer.setOracle({ denom: 'usd', price_source: { fixed: { price: '1000000' } } })

    printYellow('COMPLETE')
  } catch (e) {
    printRed(e)
  } finally {
    await deployer.saveStorage()
  }
}
