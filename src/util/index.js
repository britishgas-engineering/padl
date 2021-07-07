import findModules from 'find-node-modules';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import net from 'net';

const randomPort = () => {
  return new Promise(function (resolve, reject) {
    const server = net.createServer()
      .listen(0, function () {
        const port = server.address().port;
        server.close(function () { resolve(port); });
      }).on('error', reject);
  });
}

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stdout + stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

const terserConfig = {
  output: {
    comments: function(node, comment) {
      const {value, type} = comment;

      if (type == "comment2") {
        return /@version:/i.test(value);
      }
    }
  }
};

const getConfigArgs = () => {
  let config;

  try {
    config = JSON.parse(fs.readFileSync('.padl').toString());
  }
  catch (e) {
    console.error('Missing config, is this the right folder?');
    process.exit(1);
  }

  return config;
};

const getRightPathLocation = (dir) => {
  return findModules().map((nodePath) => {
    const totalPath = path.join(nodePath, dir);

    if(fs.existsSync(totalPath)) {
      return totalPath;
    }
  }).filter(nodePath => nodePath)[0];
};

export {
  runCommand,
  terserConfig,
  getConfigArgs,
  getRightPathLocation,
  randomPort
};
