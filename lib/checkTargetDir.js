const fs = require("fs-extra");
const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = async function checkTargetDir(targetDir, options) {
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      const { action } = await inquirer.prompt({
        name: "action",
        type: "list",
        message: `目标文件夹 ${chalk.cyan(targetDir)} 已经存在`,
        choices: [
          { name: "Overwrite", value: "overwrite" },
          { name: "Merge", value: "merge" },
          { name: "Cancel", value: false },
        ],
      });
      if (!action) {
        return;
      } else if (action === "overwrite") {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
        await fs.remove(targetDir);
      }
    }
  }
};
