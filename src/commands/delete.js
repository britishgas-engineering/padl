import fs from 'fs-extra';

export default async (config, name) => {
  let options = {};

  if (!name) {
    console.log('Missing name for component.');
    process.exit(1);
    return;
  };

  if (!fs.existsSync(`src/${name}`)) {
    console.log(`The component ${name} doesn't exists.`);
    process.exit(1);
    return;
  }

  await fs.remove(`src/${name}`);
  await fs.remove(`test/${name}`);

  console.log(`Deleted component '${name}'.`);

  process.exit(0);
  return;

}
