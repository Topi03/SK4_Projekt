module.exports = class Doorhandler {
  constructor(max) {
    this.doorlog = [];
    this.max = max;
    const fs = require("fs");
    if (fs.existsSync(__dirname + "/doorData.txt")) {
      this.doorlog = JSON.parse(fs.readFileSync(__dirname + "/doorData.txt"));
    }
  }
  doFoto(cb) {
    this.fcb = cb;
  }
  addLog() {
    this.doorlog.unshift({ date: new Date().getTime() });
    if (this.doorlog.length > this.max) {
      this.doorlog.slice(this.max, this.max + 1);
    }
    if (this.fcb !== undefined) {
      this.fcb();
    }
  }
  getLog() {
    return this.doorlog;
  }
  save() {
    const fs = require("fs");
    fs.writeFileSync(
      __dirname + "/doorData.txt",
      JSON.stringify(this.doorlog, null, "\t")
    );
  }
};
