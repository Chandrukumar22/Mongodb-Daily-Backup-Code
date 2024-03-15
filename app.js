const { spawn } = require("child_process");
const { error } = require("console");
const moment = require('moment')
const path = require('path')
const cron = require('node-cron')
const Db_Name = "Planning_And_Scheduling"
let date = moment().format("DD-MM-YYYY");
console.log(date)
const Archive_Path = path.join('D:/Daily Backup',`${Db_Name}${date}.gzip`)
console.log(Archive_Path)

// Scheduling the backup every 5 seconds (using node-cron)
cron.schedule('0 0 * * *', () => backupMongoDB());

function backupMongoDB() {
    console.log("true")
    const child = spawn('mongodump', [
      `--db=${Db_Name}`,
      `--archive=${Archive_Path}`,
      '--gzip',
    ]);
  
    child.stdout.on('data', (data) => {
      console.log('stdout:\n', data);
    });
    child.stderr.on('data', (data) => {
      console.log('stderr:\n', Buffer.from(data).toString());
    });
    child.on('error', (error) => {
      console.log('error:\n', error);
    });
    child.on('exit', (code, signal) => {
      if (code) console.log('Process exit with code:', code);
      else if (signal) console.log('Process killed with signal:', signal);
      else console.log('Backup is successfull ✅');
    });
  }