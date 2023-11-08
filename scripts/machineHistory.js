import MachinesStatesHistory from '../models/MachinesStatesHistory.js'
import Machines from '../models/Machines.js'
import Errors from '../models/Errors.js'

const addMachineHistory = async () => {
  const machine = await Machines.findOne({ where: { machineId: '5f0e2699-7e0e-4435-afc8-4d8e20099572' } })
  if (!machine) return

  const error = await Errors.findOne({})
  if (!error) return

  const states = ['ok', 'ko', 'unknown']
  const randomState = states[Math.floor(Math.random() * states.length)]

  for (let i = 0; i < 150; i++) {
    if (randomState === 'ko') {
      await MachinesStatesHistory.create({
        machineId: machine.machineId,
        errorId: error.errorId,
        state: randomState
      })
    } else {
      await MachinesStatesHistory.create({
        machineId: machine.machineId,
        state: randomState
      })
    }
  }
  console.log('Histories created with success')
}

addMachineHistory()
