const main = async () => {
  const [owner, firstPerson, secondPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  // We wave at ourselves
  let waveTxn = await waveContract.wave('A message from contract!');
  await waveTxn.wait();

  // Only one wave so far from us
  waveCount = await waveContract.getTotalWaves();

  // Switch to first Person and wave
  waveTxn = await waveContract.connect(firstPerson).wave('A message from first person!');
  await waveTxn.wait();

  /** 
   * Wave count should be 2 so far (us and first Person)
   * first Person address: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
   * */
  waveCount = await waveContract.getTotalWaves();
  let firstPersonAddress = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';

  // Wave again with first Person
  waveTxn = await waveContract.connect(firstPerson).wave('Second message from first person!');
  await waveTxn.wait();

  // Wave count from first Person is two at this stage 
  waveCount = await waveContract.getTotalWavesFromAccount(firstPersonAddress);

  // Number of unique wave count is 2 (us and 2 waves form first Person)
  waveCount = await waveContract.getNumOfUniqueWaves();

  let allWaves = await waveContract.getAllWaves();
  console.log('allWaves', allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();